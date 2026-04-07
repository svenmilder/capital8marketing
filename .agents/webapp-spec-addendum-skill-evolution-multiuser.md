# Marketing Command Center — Spec Addendum
## Skill Evolution Engine + Multi-User Access

Date: 2026-04-07
Extends: webapp-spec-2026-04-07.md

---

## A. Skill Evolution Engine

The system learns from its own output. Every piece of content produced, every metric pulled, every approval or rejection feeds back into skill improvement recommendations. Two modes: **autonomous** (orchestrator-driven) and **manual** (admin editor).

---

### A.1 How It Works

```
Performance Data (GA4, LinkedIn, email, ExitFit)
        │
        ▼
┌─────────────────────────┐
│   Performance Analyzer  │  ← Inngest cron: weekly
│   (Claude API call)     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Skill Improvement      │  ← Structured recommendations
│  Recommendations        │
└────────┬────────────────┘
         │
         ├──► Auto-apply (low-risk changes) ──► Updated SKILL.md
         │
         └──► Approval queue (high-risk) ──► Admin reviews ──► Apply or reject
```

### A.2 Data the Analyzer Sees

The Performance Analyzer receives a weekly digest containing:

| Data Source | Metrics | Maps To |
|---|---|---|
| Content performance | Impressions, engagement rate, clicks, saves per post | Which hooks work, which voice modes convert, which pillars drive engagement |
| ExitFit completions | Completion rate, score distribution, source attribution | Which content drives diagnostic starts |
| Email sequences | Open rate, click rate, reply rate, unsubscribe rate per sequence/email | Which subject lines, CTAs, cadence patterns work |
| SEO performance | Rankings, impressions, CTR per programmatic page cluster | Which page templates, title patterns, meta descriptions perform |
| Approval data | Approval rate, rejection reasons, edit patterns by admin | What the AI gets wrong repeatedly |
| LinkedIn analytics | Post type performance, follower growth, engagement by voice mode | Voice mode effectiveness, content format preferences |

### A.3 Recommendation Types

Each recommendation has a **risk level** that determines the approval flow:

| Risk Level | Examples | Flow |
|---|---|---|
| **LOW** | Update a proof point number, add a new hook pattern that tested well, adjust word count range | Auto-apply with notification |
| **MEDIUM** | Change voice mode weighting, add/remove a content pillar, modify CTA patterns | Approval queue — admin must approve |
| **HIGH** | Change compliance rules, modify audience definitions, alter pricing language, change forbidden vocabulary | Approval queue — requires explicit admin confirmation with diff review |

### A.4 What Gets Updated

Skills are stored as `.md` files in the repo. The Skill Evolution Engine does NOT modify files on disk. Instead:

1. **Skill overrides** are stored in a new database table (`skill_overrides`)
2. The **Skill Invoker** merges the base SKILL.md with any active overrides at invocation time
3. Original SKILL.md files remain untouched as the baseline
4. Overrides can be reverted individually or in bulk

This means:
- Git history stays clean (no AI-authored commits to skill files)
- Any override can be rolled back instantly
- The base skill always serves as fallback
- Admin can "graduate" proven overrides into the actual SKILL.md via a manual export

### A.5 Database Schema

```sql
-- Skill performance tracking
CREATE TABLE skill_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,           -- e.g. 'content-strategy-capital8'
  metric_type TEXT NOT NULL,          -- e.g. 'engagement_rate', 'conversion_rate', 'approval_rate'
  metric_value NUMERIC NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  sample_size INTEGER NOT NULL,       -- number of data points in this metric
  breakdown JSONB,                    -- optional: { voice_mode: 'ADVISOR', pillar: 'exit-planning' }
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_performance_skill ON skill_performance(skill_name, period_start DESC);
CREATE INDEX idx_skill_performance_type ON skill_performance(metric_type, period_start DESC);

-- Skill improvement recommendations
CREATE TABLE skill_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  recommendation_type TEXT NOT NULL,  -- 'update_proof_point', 'adjust_voice_weight', 'add_hook_pattern', etc.
  title TEXT NOT NULL,                -- human-readable summary
  rationale TEXT NOT NULL,            -- why this change is recommended (with data)
  current_value TEXT,                 -- what the skill currently says
  proposed_value TEXT NOT NULL,       -- what the skill should say
  skill_section TEXT,                 -- which section of the SKILL.md this affects
  supporting_data JSONB NOT NULL,     -- the metrics that drove this recommendation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'auto_applied', 'reverted')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,                   -- admin can add context when approving/rejecting
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_recommendations_status ON skill_recommendations(status, created_at DESC);
CREATE INDEX idx_skill_recommendations_skill ON skill_recommendations(skill_name, status);

-- Active skill overrides (applied recommendations)
CREATE TABLE skill_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  section TEXT NOT NULL,              -- which section this overrides
  override_type TEXT NOT NULL CHECK (override_type IN ('replace', 'append', 'prepend', 'insert_after')),
  original_content TEXT,              -- what was there before (for rollback)
  override_content TEXT NOT NULL,     -- the new content
  source_recommendation_id UUID REFERENCES skill_recommendations(id),
  source_type TEXT NOT NULL CHECK (source_type IN ('auto', 'recommendation', 'manual')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_overrides_active ON skill_overrides(skill_name, is_active) WHERE is_active = true;

-- Skill version snapshots (for audit trail)
CREATE TABLE skill_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('baseline', 'override_applied', 'manual_edit', 'export')),
  full_content TEXT NOT NULL,         -- complete rendered skill content at this point
  active_overrides JSONB,            -- list of override IDs that were active
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_snapshots_skill ON skill_snapshots(skill_name, created_at DESC);
```

### A.6 Inngest Jobs

```
skill-performance-collector        Weekly (Sunday 23:00 AEST)
  → Pulls metrics from GA4, LinkedIn, email platform, ExitFit DB
  → Writes aggregated metrics to skill_performance table
  → Groups by skill_name, voice_mode, content_pillar, audience

skill-evolution-analyzer           Weekly (Monday 02:00 AEST)
  → Reads last 4 weeks of skill_performance data
  → Compares against previous 4-week period
  → Calls Claude API with performance data + current skill content
  → Generates structured recommendations
  → Writes to skill_recommendations table
  → Auto-applies LOW risk recommendations
  → Notifies admin of MEDIUM/HIGH recommendations via dashboard + email

skill-override-applier             On-demand (triggered by approval)
  → Takes approved recommendation
  → Creates skill_override record
  → Creates skill_snapshot of current state
  → Marks recommendation as applied
```

### A.7 API Routes

```
GET    /api/skills                           List all skills with override count
GET    /api/skills/[name]                    Get skill content (base + overrides merged)
GET    /api/skills/[name]/raw                Get base SKILL.md content only
GET    /api/skills/[name]/overrides          List active overrides for a skill
POST   /api/skills/[name]/overrides          Create manual override (admin only)
DELETE /api/skills/[name]/overrides/[id]     Revert a specific override
POST   /api/skills/[name]/overrides/revert-all  Revert all overrides for a skill
POST   /api/skills/[name]/export             Graduate overrides into downloadable SKILL.md

GET    /api/skill-recommendations            List recommendations (filterable by status, skill, risk)
POST   /api/skill-recommendations/[id]/approve  Approve a recommendation
POST   /api/skill-recommendations/[id]/reject   Reject a recommendation

GET    /api/skill-performance                 Performance data (filterable by skill, metric, period)
GET    /api/skill-performance/summary         Cross-skill performance summary for dashboard
```

### A.8 UI — Settings > Skills

A new section under Settings (or as a top-level nav item if the team uses it heavily):

#### Skills List View
```
┌─────────────────────────────────────────────────────────┐
│  Skills                                    [+ Manual Override]  │
│─────────────────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────────┐  │
│  │ content-strategy-capital8        3 overrides      │  │
│  │ Last updated: 2 days ago  Performance: ↑ 12%      │  │
│  │ 1 pending recommendation                          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ copywriting-capital8             0 overrides      │  │
│  │ Last updated: baseline  Performance: → stable     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ email-sequence-capital8          1 override       │  │
│  │ Last updated: 5 days ago  Performance: ↑ 8%       │  │
│  │ 2 pending recommendations                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Skill Detail View
```
┌─────────────────────────────────────────────────────────┐
│  content-strategy-capital8                              │
│  ┌─────────┬────────────┬──────────┬─────────────┐     │
│  │ Content │ Overrides  │ Perf.    │ Recommendations│  │
│  └─────────┴────────────┴──────────┴─────────────┘     │
│                                                         │
│  [Rendered SKILL.md with overrides highlighted in blue] │
│                                                         │
│  Override sections show:                                │
│  ┌─ OVERRIDE (auto, 3 days ago) ─────────────────────┐ │
│  │ Voice mode weighting changed from                  │ │
│  │   ADVISOR 40% → ADVISOR 45%                        │ │
│  │   PEER 30% → PEER 30%                             │ │
│  │   SALES 20% → SALES 17%                           │ │
│  │   BRAND 10% → BRAND 8%                            │ │
│  │ Reason: ADVISOR voice posts showed 23% higher      │ │
│  │ engagement over 4-week period (n=47)               │ │
│  │                              [Revert] [View Data]  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Recommendation Review
```
┌─────────────────────────────────────────────────────────┐
│  Recommendation: Adjust hook patterns in content-strategy│
│  Risk: MEDIUM                    Skill: content-strategy │
│                                                          │
│  Rationale:                                              │
│  Posts using "question" hooks averaged 4.2% engagement   │
│  vs 2.1% for "statement" hooks over the past 4 weeks    │
│  (n=32 posts). Recommend increasing question hook        │
│  frequency from 25% to 40% of posts.                    │
│                                                          │
│  Current:                                                │
│  > Hook rotation: Statement 35%, Question 25%,           │
│  > Story 20%, Data 20%                                   │
│                                                          │
│  Proposed:                                               │
│  > Hook rotation: Question 40%, Statement 25%,           │
│  > Story 20%, Data 15%                                   │
│                                                          │
│  Supporting data:                                        │
│  ┌──────────────────────────────────────┐               │
│  │ [Chart: Engagement by hook type]     │               │
│  └──────────────────────────────────────┘               │
│                                                          │
│  Admin note: [____________________________]              │
│                                                          │
│                         [Reject]  [Approve & Apply]      │
└──────────────────────────────────────────────────────────┘
```

#### Manual Skill Editor

Admin can directly edit any skill section without going through the recommendation flow:

```
┌─────────────────────────────────────────────────────────┐
│  Manual Override: email-sequence-capital8                │
│                                                          │
│  Section: [Dropdown: Select section to override ▼]       │
│                                                          │
│  Override type: ○ Replace  ○ Append  ○ Prepend           │
│                                                          │
│  Current content:                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Subject: Your ExitFit score — what it means      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  New content:                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Subject: Your ExitFit result — three things to   │   │
│  │ know                                              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Reason for change: [_______________________________]    │
│                                                          │
│                              [Cancel]  [Apply Override]  │
└──────────────────────────────────────────────────────────┘
```

### A.9 Skill Invoker Integration

The existing Skill Invoker (Section 9.2 of the main spec) is modified to merge overrides:

```typescript
async function getSkillContent(skillName: string): Promise<string> {
  // 1. Read base SKILL.md from filesystem
  const baseContent = await readSkillFile(skillName);

  // 2. Fetch active overrides from database
  const overrides = await supabase
    .from('skill_overrides')
    .select('*')
    .eq('skill_name', skillName)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  // 3. Apply overrides in order
  let mergedContent = baseContent;
  for (const override of overrides.data) {
    mergedContent = applyOverride(mergedContent, override);
  }

  return mergedContent;
}
```

### A.10 Guardrails

- **Compliance rules are NEVER auto-updated.** Any recommendation touching forbidden vocabulary, regulatory constraints, or audience definitions is automatically classified as HIGH risk.
- **Maximum 5 active overrides per skill.** Beyond that, admin must export/graduate overrides into the base file or revert older ones.
- **4-week minimum data.** The analyzer will not generate recommendations with fewer than 4 weeks of performance data.
- **Minimum sample size: 20.** No recommendation will be generated from fewer than 20 data points.
- **Rollback safety.** Every override stores the original content. One-click revert, no data loss.
- **Snapshot on every change.** A full rendered snapshot is saved before and after every override application.

---

## B. Multi-User Access System

Capital8 is a team. Everyone who operates in the business should have appropriate access to the Marketing Command Center.

---

### B.1 Role Model

| Role | Who | Access |
|---|---|---|
| **Admin** | Sven + designated ops leads | Full access. Manage users, approve/reject content, edit skills, configure integrations, view all data, manage billing/API keys |
| **Creator** | Marketing team members, content writers | Create content, submit for approval, view own drafts, view published content, view performance dashboards. Cannot publish without approval, cannot edit skills, cannot manage integrations |
| **Specialist** | SEO specialist, paid ads operator | Full access to their domain screen (SEO Specialist or Content Creator), read-only on other screens. Can execute within their domain but cannot modify skills or system config |
| **Viewer** | Partners, advisors, dealmakers who need visibility | Read-only access to Dashboard and published content. Cannot create, edit, or approve anything. Useful for stakeholders who want to see marketing performance |

### B.2 Permission Matrix

| Action | Admin | Creator | Specialist | Viewer |
|---|---|---|---|---|
| View Dashboard | Yes | Yes | Yes | Yes |
| View performance metrics | Yes | Yes | Yes | Yes |
| Create content | Yes | Yes | Own domain | No |
| Edit own drafts | Yes | Yes | Yes | No |
| Edit others' drafts | Yes | No | No | No |
| Submit for approval | Yes | Yes | Yes | No |
| Approve/reject content | Yes | No | No | No |
| Publish content | Yes | No | No | No |
| Trigger autonomous jobs | Yes | No | No | No |
| View skill recommendations | Yes | No | No | No |
| Approve skill changes | Yes | No | No | No |
| Manual skill overrides | Yes | No | No | No |
| Manage integrations/API keys | Yes | No | No | No |
| Manage users | Yes | No | No | No |
| View audit log | Yes | No | No | No |
| Export data | Yes | Yes (own) | Yes (own domain) | No |

### B.3 Database Schema Changes

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'creator', 'specialist', 'viewer')),
  specialist_domain TEXT CHECK (
    (role = 'specialist' AND specialist_domain IN ('content', 'seo', 'paid_ads', 'email')) OR
    (role != 'specialist' AND specialist_domain IS NULL)
  ),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role) WHERE is_active = true;

-- Audit log (required by hardening doc, enhanced for multi-user)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,               -- 'content.create', 'content.approve', 'skill.override', etc.
  resource_type TEXT NOT NULL,        -- 'content', 'skill', 'integration', 'user', etc.
  resource_id TEXT,                   -- ID of the affected resource
  details JSONB,                      -- action-specific details
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action, created_at DESC);
```

### B.4 RLS Policy Updates

Every table in the system gets role-aware RLS:

```sql
-- Helper function: get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin'
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Example: content_items RLS
-- Admins: full access
-- Creators: own content + published content
-- Specialists: own domain content + published content
-- Viewers: published content only

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_access" ON content_items
  FOR ALL USING (is_admin());

CREATE POLICY "creators_own_content" ON content_items
  FOR ALL USING (
    get_user_role() = 'creator'
    AND (created_by = auth.uid() OR status = 'published')
  );

CREATE POLICY "specialists_domain_content" ON content_items
  FOR ALL USING (
    get_user_role() = 'specialist'
    AND (
      created_by = auth.uid()
      OR status = 'published'
      OR content_type IN (
        SELECT CASE specialist_domain
          WHEN 'content' THEN 'linkedin_post'
          WHEN 'seo' THEN 'seo_page'
          WHEN 'email' THEN 'email'
          WHEN 'paid_ads' THEN 'ad_copy'
        END
        FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "viewers_published_only" ON content_items
  FOR SELECT USING (
    get_user_role() = 'viewer'
    AND status = 'published'
  );

-- Skill overrides: admin only
ALTER TABLE skill_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only" ON skill_overrides
  FOR ALL USING (is_admin());

-- Skill recommendations: admin only
ALTER TABLE skill_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only" ON skill_recommendations
  FOR ALL USING (is_admin());
```

### B.5 API Route Protection

```typescript
// Middleware: role-based route protection
const routePermissions: Record<string, Role[]> = {
  // Dashboard — everyone
  'GET /api/dashboard/*': ['admin', 'creator', 'specialist', 'viewer'],

  // Content — admin + creator + specialist (own domain)
  'POST /api/content/*': ['admin', 'creator', 'specialist'],
  'PUT /api/content/*': ['admin', 'creator', 'specialist'],

  // Approval — admin only
  'POST /api/content/*/approve': ['admin'],
  'POST /api/content/*/reject': ['admin'],
  'POST /api/content/*/publish': ['admin'],

  // Skills — admin only
  'GET /api/skills': ['admin'],
  'POST /api/skills/*': ['admin'],
  'DELETE /api/skills/*': ['admin'],
  'POST /api/skill-recommendations/*': ['admin'],

  // Autonomous jobs — admin only
  'POST /api/jobs/*': ['admin'],

  // Users — admin only
  'GET /api/users': ['admin'],
  'POST /api/users': ['admin'],
  'PUT /api/users/*': ['admin'],
  'DELETE /api/users/*': ['admin'],

  // Integrations — admin only
  'GET /api/integrations': ['admin'],
  'POST /api/integrations/*': ['admin'],
};
```

### B.6 API Routes — User Management

```
GET    /api/users                    List all users (admin only)
POST   /api/users/invite             Invite a new user (sends email via Resend)
PUT    /api/users/[id]               Update user role, active status
DELETE /api/users/[id]               Deactivate user (soft delete)
GET    /api/users/[id]/activity      User's recent activity from audit log
GET    /api/audit-log                Paginated audit log (admin only)
```

### B.7 UI — Settings > Team

#### Team List View
```
┌─────────────────────────────────────────────────────────┐
│  Team                                    [+ Invite User] │
│─────────────────────────────────────────────────────────│
│  Name              Role          Domain    Last Active   │
│  ────────────────────────────────────────────────────── │
│  Sven Milder       Admin         —         Just now      │
│  Sarah Chen        Creator       —         2 hours ago   │
│  James Park        Specialist    SEO       Yesterday     │
│  Li Wei            Specialist    Content   3 days ago    │
│  Michael Torres    Viewer        —         1 week ago    │
│                                                          │
│  [Showing 5 active users]                                │
└─────────────────────────────────────────────────────────┘
```

#### Invite Flow
```
┌─────────────────────────────────────────────────────────┐
│  Invite Team Member                                      │
│                                                          │
│  Email: [____________________________]                   │
│  Full name: [________________________]                   │
│  Role: [Admin ▼]                                         │
│                                                          │
│  ○ Admin — Full access, manage team & skills             │
│  ○ Creator — Create & submit content for approval        │
│  ○ Specialist — Full access to specific domain           │
│       Domain: [SEO ▼]                                    │
│  ○ Viewer — Read-only access to dashboard & published    │
│                                                          │
│                              [Cancel]  [Send Invite]     │
└─────────────────────────────────────────────────────────┘
```

### B.8 Auth Flow

1. Admin invites user via email (Resend)
2. User receives invite link → Supabase Auth magic link or password setup
3. On first login, `user_profiles` row is created with the pre-assigned role
4. User sees only the screens and actions their role permits
5. Nav items are filtered by role (Viewers don't see Skills, Integrations, Team sections)

### B.9 Navigation by Role

| Nav Item | Admin | Creator | Specialist | Viewer |
|---|---|---|---|---|
| Dashboard | Yes | Yes | Yes | Yes |
| Content Creator | Yes | Yes | If domain=content | No |
| SEO Specialist | Yes | No | If domain=seo | No |
| Webpage Creator | Yes | No | If domain=seo | No |
| Settings > Skills | Yes | No | No | No |
| Settings > Integrations | Yes | No | No | No |
| Settings > Team | Yes | No | No | No |
| Settings > Autonomous | Yes | No | No | No |
| Settings > Profile | Yes | Yes | Yes | Yes |

---

## C. Dashboard Approval Queue — Multi-User Enhancement

The approval queue on the Dashboard (Section 1.1 of the main spec) is enhanced for multi-user:

- **Queue shows who created each item** (avatar + name)
- **Items are attributed**: "Sarah submitted 3 LinkedIn posts for approval"
- **Admin sees all pending items**; creators see only their own submissions and their status
- **Approval/rejection includes a note field** that the creator can see
- **Notification**: Creator gets a dashboard notification (and optional email) when their content is approved or rejected

---

## D. Build Plan Impact

### Phase 1 (Foundation) — Add:
- `user_profiles` table and RLS helper functions
- `audit_log` table
- Role-based middleware for API routes
- Supabase Auth setup with magic link flow

### Phase 3 (Content Creator) — Add:
- `created_by` attribution on all content
- Role-aware content list filtering
- Approval notifications to creators

### Phase 6 (Autonomous + Advanced) — Add:
- `skill_performance`, `skill_recommendations`, `skill_overrides`, `skill_snapshots` tables
- Performance collector and evolution analyzer Inngest jobs
- Skills management UI
- Team management UI

### Phase 7 (Polish) — Add:
- Audit log viewer
- User activity tracking
- Role-based navigation filtering

---

## E. Summary

| Feature | Status Before | Status After |
|---|---|---|
| Skill improvement | Manual only, edit files | Autonomous recommendations + manual editor + approval flow |
| Skill data feedback | None | Weekly performance analysis → structured recommendations |
| Low-risk updates | Manual | Auto-applied with notification |
| High-risk updates | Manual | Approval queue with diff review |
| User access | Sven only | 4 roles: Admin, Creator, Specialist, Viewer |
| Content attribution | None | Full audit trail with user attribution |
| Approval workflow | Admin approves | Admin approves, creator notified |
| Permission model | Single user | Role-based RLS on every table |
