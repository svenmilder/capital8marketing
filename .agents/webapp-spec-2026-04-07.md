# Capital8 Marketing Command Center -- Product Specification

**Version:** 1.0
**Date:** 2026-04-07
**Status:** Pre-build specification. Approved by architecture review. Ready for implementation.
**Tech Stack:** Next.js 15 + shadcn/ui + Tailwind CSS + Supabase + Claude API + Inngest + Vercel + Resend

---

## 1. Application Architecture

### 1.1 Route Structure

```
/                                   -> Redirect to /dashboard
/login                              -> Supabase Auth (magic link + Google OAuth)
/dashboard                          -> Morning Command Center
/content                            -> Content Creator hub
/content/research                   -> Content research & competitive analysis
/content/create                     -> AI content creation workspace
/content/linkedin                   -> LinkedIn batch creator (4 posts/week)
/content/linkedin/[id]              -> Individual post editor with preview
/content/linkedin/design            -> Visual post designer (carousels, images)
/content/email                      -> Email sequence builder
/content/email/[id]                 -> Individual sequence editor with timeline
/content/blog                       -> Blog/guide editor (mapped to SEO architecture)
/content/blog/[id]                  -> Individual blog post editor
/content/video                      -> Video script generator
/content/video/[id]                 -> Individual script editor
/content/youtube                    -> YouTube thumbnail creator
/content/instagram                  -> Instagram content creator (nano-banana)
/content/carousel                   -> Carousel creator (LinkedIn/Instagram)
/content/poster                     -> Content poster (scheduling & publishing)
/seo                                -> SEO Specialist hub
/seo/programmatic                   -> Programmatic pages grid (48 sector x country)
/seo/architecture                   -> Site architecture tree view
/seo/keywords                       -> Keyword tracking dashboard
/seo/ai                             -> AI SEO section (AEO/GEO/LLMO)
/seo/onsite                         -> On-site SEO audit & recommendations
/seo/recommendations                -> Weekly AI-generated SEO recommendations
/seo/editor/[slug]                  -> In-place content editor for SEO pages
/pages                              -> Webpage Creator hub
/pages/generator                    -> Bulk programmatic page generator
/pages/templates                    -> Template manager
/pages/[id]                         -> Individual page editor
/settings                           -> App settings, API keys, integrations
/settings/integrations              -> MCP tool connections & API keys
/settings/skills                    -> SKILL.md browser & management
```

### 1.2 Layout Structure

```
+--------------------------------------------------+
|  Top Bar: Logo | Search (Cmd+K) | Notifications  |
+--------+-----------------------------------------+
|        |                                         |
| Side   |        Main Content Area                |
| Nav    |                                         |
|        |                                         |
| [D]    |   (varies by route)                     |
| [C]    |                                         |
| [S]    |                                         |
| [W]    |                                         |
|        |                                         |
| ----   |                                         |
| [Set]  |                                         |
+--------+-----------------------------------------+
```

**Side Navigation (persistent, collapsible):**
- Dashboard (grid icon)
- Content (pen icon)
- SEO (search icon)
- Webpages (layout icon)
- Separator
- Settings (gear icon)

**Top Bar:**
- Left: Capital8 logo + "Command Center" text
- Center: Global search (Cmd+K) -- searches content, posts, pages, SEO data
- Right: Notification bell (unread count badge), approval queue count badge, user avatar

---

## 2. Screen Specifications

### 2.1 Dashboard -- Morning Command Center

**Purpose:** The single-screen morning briefing. Sven opens this at 7am and knows exactly what needs attention, what happened overnight, and where the numbers stand.

**Layout:** 3-column grid on desktop. Single column on mobile. Top section is full-width alerts/queue.

```
+--------------------------------------------------+
|  APPROVAL QUEUE (full width, collapsible)        |
|  [Post: "Manufacturing exits are..." ] [Approve] |
|  [Email: Seller nurture #3]          [Approve]   |
|  [Blog: Exit Planning SaaS/SG]       [Review]    |
|  2 more items...                                  |
+--------------------------------------------------+
|                                                   |
| SPRINT STATUS        | ACTIVITY FEED             |
| +-----------------+  | +----------------------+  |
| | Current Sprint  |  | | 03:14 Generated 4    |  |
| | Week 2 of 4     |  | |   LinkedIn posts      |  |
| | Priority: Sell  |  | | 03:16 Ran SEO audit  |  |
| | Phase: Content  |  | |   on 12 prog pages    |  |
| | [Progress bar]  |  | | 06:00 Buffer queued  |  |
| | Goals:          |  | |   Mon post            |  |
| | - 50 ExitFit    |  | | 06:01 Sent nurture   |  |
| |   completions   |  | |   #4 to 23 contacts   |  |
| | - 4 Sprint      |  | | 06:30 GSC data pull  |  |
| |   bookings      |  | |   complete             |  |
| +-----------------+  | +----------------------+  |
|                      |                            |
+--------------------------------------------------+
|                                                   |
| PERFORMANCE METRICS (full width)                  |
| +-------+ +-------+ +-------+ +-------+         |
| |ExitFit| |News-  | |Follow | |Engage |         |
| |Tests  | |letter | |Growth | |Rate   |         |
| |Started| |Subs   | |       | |       |         |
| | 47    | | 312   | |+84    | | 4.2%  |         |
| | +12%  | | +3    | |this wk| |       |         |
| +-------+ +-------+ +-------+ +-------+         |
|                                                   |
| +-------+ +-------+ +-------+ +-------+         |
| |ExitFit| |Churns | |Sprint | |Mandate|         |
| |Compl. | |       | |Conv.  | |Desk   |         |
| | 31    | | 2     | | 15.2% | |Active |         |
| | +8%   | | -1    | |       | | 7     |         |
| +-------+ +-------+ +-------+ +-------+         |
|                                                   |
+--------------------------------------------------+
```

**Components:**

**Approval Queue (top, full-width):**
- Card list, horizontally scrollable on mobile
- Each card: content type icon + title (truncated) + audience badge (Seller/Buyer/Dealmaker color-coded) + creation timestamp + [Preview] [Approve] [Edit] [Reject] buttons
- Preview opens a slide-over panel with full content and compliance check results
- Count badge in top bar syncs with this queue
- Filters: All | LinkedIn | Email | Blog | Pages
- Empty state: "Nothing awaiting approval. The system is caught up."

**Sprint Status (left column):**
- Card showing current sprint from `.agents/marketing-sprint-current.md`
- Fields: Sprint name, date range, priority audience (color badge), current phase (1-8 with named label), progress bar (phases completed / total), sprint goals as checklist with current numbers vs targets
- "View Full Sprint" link opens sprint file in a read-only markdown viewer
- If no active sprint: "No active sprint. Start one?" button triggers orchestrator Phase 1

**Activity Feed (right column):**
- Reverse-chronological log of autonomous system actions
- Each entry: timestamp + icon (content, SEO, email, data) + description + optional [View] link
- Sources: Inngest job completions, Make.com webhook events, cron task results
- Filter chips: All | Content | SEO | Email | Data | Errors
- Errors highlighted in red with [Investigate] action
- Maximum 50 entries visible, with "Load more" pagination

**Performance Metrics (bottom, full-width grid):**
- 8 metric cards in a 4x2 grid (responsive to 2x4 on mobile)
- Each card: metric label, current value (large), delta (percentage or absolute change, with green/red color), sparkline chart (last 30 days)
- Metrics:
  1. ExitFit Tests Started (from `exitfit_completions` where started but not yet completed -- requires new column or separate tracking)
  2. ExitFit Tests Completed (from `exitfit_completions` count this period)
  3. Newsletter Subscribers (from email list via Resend API)
  4. Churns (unsubscribes from email lists this period)
  5. Follower Growth -- LinkedIn (from LinkedIn API or manual entry)
  6. Engagement Rate -- LinkedIn (comments + profile visits per post average)
  7. Sprint Conversion Rate (from query S2: diagnostic_to_sprint_pct)
  8. Mandate Desk Active (from `active_mandates` count)
- Data refresh: real-time via Supabase Realtime subscriptions for DB-sourced metrics; daily pull for LinkedIn/external metrics

### 2.2 Content Creator

**Purpose:** Central workspace for all content production. Research, create, design, schedule, publish.

#### 2.2.1 Content Hub `/content`

**Layout:** Grid of content type cards with recent items and quick actions.

```
+--------------------------------------------------+
|  CONTENT CREATOR                     [+ New]      |
+--------------------------------------------------+
|                                                   |
| QUICK ACTIONS                                     |
| [Weekly LinkedIn Batch] [New Blog Post]           |
| [Email Sequence] [Video Script]                   |
+--------------------------------------------------+
|                                                   |
| RECENT CONTENT                                    |
| +----------------------------------------------+ |
| | Type | Title | Audience | Status | Updated   | |
| |------|-------|----------|--------|-----------|  |
| | LI   | Mfg.. | Seller   | Draft  | 2h ago   | |
| | Blog | Exit..| Seller   | Review | 1d ago   | |
| | Email| Nurt..| Seller   | Sent   | 2d ago   | |
| +----------------------------------------------+ |
|                                                   |
| CONTENT CALENDAR (week view)                      |
| +----------------------------------------------+ |
| | Mon    | Tue    | Wed    | Thu    | Fri      | |
| | PEER   |        | ADVSR  |        | SALES    | |
| | [post] |        | [post] |        | [post]   | |
| |        |        |        | BRAND  |          | |
| |        |        |        | [post] |          | |
| +----------------------------------------------+ |
+--------------------------------------------------+
```

**Components:**
- Quick Actions: 4 large buttons triggering the most common workflows. Each opens the relevant sub-route.
- Recent Content: Data table with type icon, title, audience badge, status badge (Draft/Review/Approved/Scheduled/Published/Sent), last updated timestamp. Click opens editor.
- Content Calendar: Week-strip view showing scheduled posts by day. Voice mode color-coded (ADVISOR=blue, PEER=green, SALES=orange, BRAND=purple). Drag-and-drop to reschedule. Click to open editor.
- [+ New] dropdown: LinkedIn Post, Blog/Guide, Email Sequence, Video Script, Instagram Post, Carousel, YouTube Thumbnail

#### 2.2.2 Content Research `/content/research`

**Layout:** Split panel. Left: research inputs. Right: results.

**Left panel:**
- "Analyze Existing Content" section: paste URL or select from content library. Claude API analyzes for topic gaps, audience alignment, pillar coverage, voice consistency
- "Competitive Research" section: enter competitor URL or company name. Uses Playwright MCP to scrape. Claude API generates competitive positioning analysis
- "Topic Research" section: enter a topic keyword. Returns: related questions (from GSC/Ahrefs API), content gaps vs existing library, suggested angles with pillar/voice mapping

**Right panel:**
- Research results displayed as structured cards
- Each result: headline, summary, relevance score, suggested action (Write Post / Write Blog / Add to Calendar)
- "Use as Brief" button pre-fills the content creation form
- Research history saved to Supabase for reference

#### 2.2.3 AI Content Creation `/content/create`

**Layout:** Full-width creation workspace.

```
+--------------------------------------------------+
|  CREATE CONTENT                                   |
+--------------------------------------------------+
| Content Type: [LinkedIn Post v]                   |
| Audience:     [Seller v]                          |
| Voice Mode:   [ADVISOR v]                         |
| Pillar:       [Exit Education v]                  |
| Brief/Notes:  [textarea -- deal context, angles]  |
|                                                   |
| [Generate with AI]                                |
+--------------------------------------------------+
| GENERATED OUTPUT                                  |
| +----------------------------------------------+ |
| | Hook Options:                                 | |
| | (o) Hook A: "I just spent two..." (8.5/10)  | |
| | ( ) Hook B: "A founder told me..." (7.8/10) | |
| | ( ) Hook C: "The pattern is..." (7.2/10)    | |
| +----------------------------------------------+ |
| | Full Post Preview:                            | |
| | [Editable rich text area with LinkedIn        | |
| |  formatting preview. Shows character count,   | |
| |  word count, compliance check status]         | |
| +----------------------------------------------+ |
| | Metadata:                                     | |
| | CTA: Seller (DEALREADY) | Pillar: Exit Ed    | |
| | Psychology: Loss aversion | Words: 347        | |
| +----------------------------------------------+ |
| | Compliance: [PASS] All checks passed          | |
| | [Save Draft] [Send to Approval] [Schedule]    | |
+--------------------------------------------------+
```

**AI Generation Process:**
1. User fills in content type, audience, voice mode, pillar, and optional brief
2. System loads product-marketing-context.md, relevant SKILL.md, and most recent db-snapshot data
3. Sends to Claude API with full system prompt constructed from skill files
4. Returns structured output: 3 hook options with scores, full post, metadata, compliance check
5. User can select hook, edit post inline, regenerate sections
6. Compliance checker runs automatically: forbidden words, exclamation marks, emojis, hashtags, audience mixing, brand glossary terms, regulatory language

**Compliance Checker (runs on every save/generate):**
- Scans for all 19 forbidden words from product-marketing-context.md
- Checks for exclamation marks in body
- Checks for emojis in body
- Checks for hashtags
- Verifies brand glossary usage (Capital8 not "Capital 8", ExitFit Diagnostic not "quiz", etc.)
- Verifies sign-off format (CTA + introduction line)
- Verifies only [VERIFIED] metrics are used
- Returns pass/fail with specific line-level annotations

#### 2.2.4 LinkedIn Batch Creator `/content/linkedin`

**Purpose:** Generate 4 posts per week following the content-strategy-capital8 rotation.

**Layout:** Split view. Left: configuration. Right: batch preview.

**Left panel (Configuration):**
- Week selector (date picker for target week)
- "Load Weekly Brief" button (reads weekly-content-brief-template.md or manual input)
- Deal context textarea: "Any deals, conversations, or market observations this week?"
- Priority audience selector (defaults from sprint)
- Auto-populated rotation: Mon=PEER, Wed=ADVISOR, Fri=SALES, Thu/Tue=BRAND (per content-strategy-capital8)
- [Generate Batch] button

**Right panel (Batch Preview):**
- 4 post cards stacked vertically, each showing:
  - Day + Voice mode badge + Audience badge + Pillar badge
  - Hook (selected, with option to see alternatives)
  - Full post text (truncated, expandable)
  - Metadata row: word count, CTA type, psychology lever
  - Compliance status badge
  - [Edit] [Regenerate] [Remove] actions
- Sequencing checks displayed at top: consecutive voice mode check, consecutive audience check, consecutive CTA check, pillar ratio check, real-deal-anchor check
- [Approve All] sends entire batch to approval queue
- [Schedule All] opens date/time picker for each post

#### 2.2.5 LinkedIn Post Design `/content/linkedin/design`

**Purpose:** Visual design for LinkedIn content beyond text-only posts.

**Layout:** Canvas-based editor.

**Features:**
- Template library: quote cards, data visualization cards, before/after comparisons, process diagrams
- Brand-consistent templates: Capital8 colors, typography, no emojis
- Text overlay editor with Capital8 brand fonts
- Image generation via nano-banana MCP tool (`generate_image`, `edit_image`, `continue_editing`)
- Export formats: 1200x1200 (LinkedIn square), 1200x627 (LinkedIn landscape), 1080x1080 (Instagram)
- Preview pane showing how the image appears in LinkedIn feed

#### 2.2.6 YouTube Thumbnail Creator `/content/youtube`

**Layout:** Side-by-side template selector + editor.

**Features:**
- Thumbnail templates optimized for YouTube (1280x720)
- Face overlay zones (drag portrait photo into position)
- Text headline editor (max 6 words, high contrast)
- Background generation via nano-banana MCP
- A/B variant generator: creates 2-3 thumbnail options automatically
- Preview at YouTube search-result size and suggested-video size

#### 2.2.7 Carousel Creator `/content/carousel`

**Layout:** Slide-by-slide editor with preview strip.

```
+--------------------------------------------------+
|  CAROUSEL CREATOR                                 |
+--------------------------------------------------+
| Slides: [1] [2] [3] [4] [5] [+]    Preview >    |
+--------------------------------------------------+
| +---------------------+ +---------------------+  |
| | EDITOR (current)    | | PREVIEW             |  |
| |                     | | [Slide 1 render]    |  |
| | Headline: [____]    | |                     |  |
| | Body: [________]    | | < 1 of 5 >          |  |
| | Background: [pick]  | |                     |  |
| | Image: [gen/upload] | | Platform: [LI v]    |  |
| +---------------------+ +---------------------+  |
+--------------------------------------------------+
```

**Features:**
- Slide management: add, remove, reorder slides (drag in strip)
- Per-slide editor: headline, body text, background color/image, overlay image
- AI content generation: provide a topic, generates 5-8 slide carousel content automatically
- Templates: educational (numbered tips), case study (problem-solution), data (stat per slide), process (step-by-step)
- Image generation per slide via nano-banana MCP
- Export: PDF (for LinkedIn document upload), individual PNGs (for Instagram carousel)
- Platform selector: LinkedIn (1080x1080 or 4:5) / Instagram (1080x1350)

#### 2.2.8 Instagram Content `/content/instagram`

**Layout:** Grid view of created Instagram content + creation form.

**Features:**
- Direct integration with nano-banana MCP for image generation
- Prompt builder tailored to Capital8 brand: inputs are topic, mood, style
- Image editing workflow: generate -> edit -> continue_editing chain
- Caption generator (Claude API, adapted for Instagram -- still no emojis per brand rules, but shorter format)
- Grid preview: shows how the post fits into the existing Instagram grid aesthetic
- Stories template creator (9:16 format)

#### 2.2.9 Email Sequence Builder `/content/email`

**Layout:** Visual timeline editor.

```
+--------------------------------------------------+
|  EMAIL SEQUENCE: Post-Diagnostic Seller Nurture   |
+--------------------------------------------------+
| Audience: [Seller v]  Trigger: [ExitFit Complete] |
+--------------------------------------------------+
|                                                   |
| TIMELINE                                          |
|                                                   |
| Day 0 ----[Email 1]---- Day 7 ----[Email 2]---  |
|           "Welcome +            "The cost of      |
|            Score"                waiting"          |
|           Open: 42%             Open: 38%         |
|                                                   |
| Day 14 ---[Email 3]---- Day 30 ---[Email 4]---   |
|           "Pattern               "Your sector     |
|            matching"              is moving"       |
|           Open: --              Open: --           |
|                                                   |
| Day 60 ---[Email 5]---- Day 90 ---[Email 6]---   |
|           "Check-in"             "Last touch"     |
|           Open: --              Open: --           |
+--------------------------------------------------+
| [+ Add Email] [Edit Triggers] [Preview Sequence]  |
+--------------------------------------------------+
```

**Features:**
- Visual timeline showing emails as nodes on a horizontal timeline
- Each node shows: email subject, open rate (if sent), click rate, send count
- Click a node to open the email editor (rich text, Claude AI generation, compliance check)
- Drag nodes to adjust timing
- Conditional branching: "If opened Email 2, skip to Email 4" type logic
- Sequence templates pre-loaded from seller-nurture-email skill:
  - Post-awareness (6 emails / 90 days)
  - Post-diagnostic (4 emails / 60 days)
  - Stalled consideration
  - Re-engagement
- Integration: Resend API for sending, Supabase for subscriber management
- Performance dashboard per sequence: open rates, click rates, conversion to Sprint

#### 2.2.10 Blog/Guide Editor `/content/blog`

**Layout:** Full-width editor with SEO sidebar.

**Features:**
- Rich text editor (Tiptap/ProseMirror based)
- AI writing assistant: generate from brief, expand section, rewrite paragraph, generate outline
- SEO sidebar showing: target keyword, search volume, keyword density, meta title/description preview, readability score, internal link suggestions (from site architecture)
- Mapped to SEO architecture: when creating a new guide, select the pillar and cluster it belongs to. System suggests URL structure and internal links automatically.
- Image insertion via nano-banana MCP generation
- Schema markup auto-generation (Article + BreadcrumbList + FAQPage)
- Publish workflow: Draft -> Review -> Approved -> Published (via Vercel MCP deployment)
- Content pillars: guides/selling-your-business/*, guides/acquiring-a-business/*, guides/dealmaker-network/*, guides/glossary/*

#### 2.2.11 Video Script Generator `/content/video`

**Layout:** Script editor with format selector.

**Features:**
- Format selector: Short-form (30/45/60 sec) or Long-form (8-10 min)
- AI generation following the exact template from social-content-capital8 SKILL.md
- Short-form output: Hook (0:00) > Point (0:15) > Why (0:30) > Close (0:45)
- Long-form output: Hook > Problem > Your Take > Reframe > Mechanism > Close
- Delivery notes section: pace, energy, eye contact guidance
- Repurposing suggestions: "Extract 3 short clips from sections X, Y, Z"
- Teleprompter mode: full-screen scrolling text at adjustable speed
- Export: plain text, PDF, teleprompter format

#### 2.2.12 Content Poster `/content/poster`

**Purpose:** Schedule and publish content to external platforms.

**Layout:** Calendar view + queue.

```
+--------------------------------------------------+
|  CONTENT POSTER                                   |
+--------------------------------------------------+
| View: [Calendar v]  Filter: [All Platforms v]     |
+--------------------------------------------------+
|                                                   |
| APRIL 2026                                        |
| Mon  | Tue  | Wed  | Thu  | Fri  | Sat  | Sun   |
| [LI] |      | [LI] |      | [LI] |      |       |
| [IG] |      |      | [LI] |      |      |       |
|      |      | [EM] |      |      |      |       |
+--------------------------------------------------+
| PUBLISHING QUEUE                                  |
| +----------------------------------------------+ |
| | Content        | Platform | Scheduled | Stat | |
| | "Mfg exits..." | LinkedIn | Apr 7 8am | Queued |
| | Carousel #3    | Instagram| Apr 8 12p | Draft|  |
| | Nurture #4     | Email    | Apr 9 6am | Ready|  |
| +----------------------------------------------+ |
| [Publish Now] [Reschedule] [Remove]               |
+--------------------------------------------------+
```

**Integrations:**
- LinkedIn API (via Make.com MCP): direct post publishing
- Buffer API (via Make.com MCP): scheduling for LinkedIn, Instagram
- Resend API: email sending
- Platform preview: shows exactly how the post will render on each platform
- Post-publish tracking: pulls engagement data back into the system after 24h, 48h, 7d

### 2.3 SEO Specialist

**Purpose:** Complete SEO operations center covering programmatic pages, site architecture, keyword tracking, AI SEO, and on-site SEO.

#### 2.3.1 SEO Hub `/seo`

**Layout:** Dashboard with key SEO metrics and section navigation.

```
+--------------------------------------------------+
|  SEO SPECIALIST                                   |
+--------------------------------------------------+
| KEY METRICS                                       |
| [Indexed Pages: 47/62] [Organic Traffic: 1,240]  |
| [Avg Position: 18.3]   [AI Citations: 3 this wk] |
+--------------------------------------------------+
|                                                   |
| SECTIONS                                          |
| +-------------------+ +-------------------+       |
| | PROGRAMMATIC SEO  | | SITE ARCHITECTURE |       |
| | 48 pages planned  | | Tree view of      |       |
| | 12 published      | | capital8.io       |       |
| | 24 in draft       | | structure         |       |
| | [Open Grid]       | | [Open Tree]       |       |
| +-------------------+ +-------------------+       |
| +-------------------+ +-------------------+       |
| | AI SEO            | | ON-SITE SEO       |       |
| | AEO/GEO/LLMO     | | Technical audit    |       |
| | Citation tracking | | Schema, speed,    |       |
| | Bot access status | | crawlability      |       |
| | [Open AI SEO]     | | [Open On-Site]    |       |
| +-------------------+ +-------------------+       |
|                                                   |
| WEEKLY RECOMMENDATIONS (AI-generated)             |
| 1. "SaaS/Singapore page needs 400 more words..."  |
| 2. "Healthcare/Indonesia has no FAQ schema..."     |
| 3. "3 programmatic pages not yet indexed..."       |
| [View All Recommendations]                         |
+--------------------------------------------------+
```

#### 2.3.2 Programmatic Pages Grid `/seo/programmatic`

**Purpose:** Manage the 48 sector x country exit-planning pages plus 8 valuation pages plus 6 location pages.

**Layout:** Spreadsheet-style grid.

```
+--------------------------------------------------+
|  PROGRAMMATIC SEO PAGES                           |
+--------------------------------------------------+
| Matrix: [Exit Planning v]  Filter: [All Status v] |
+--------------------------------------------------+
|                                                   |
|              | SG  | MY  | ID  | AU  | TH  | VN |
| B2B SaaS     | [P] | [P] | [D] | [P] | [D] | [-]|
| Tech Svc     | [D] | [-] | [-] | [D] | [-] | [D]|
| Prof Svc     | [P] | [P] | [-] | [P] | [-] | [-]|
| Agencies     | [P] | [-] | [-] | [P] | [-] | [-]|
| Healthcare   | [P] | [-] | [P] | [-] | [-] | [-]|
| Logistics    | [-] | [D] | [D] | [-] | [D] | [-]|
| E-commerce   | [P] | [-] | [P] | [-] | [-] | [-]|
| Education    | [D] | [-] | [D] | [-] | [-] | [-]|
|                                                   |
| Legend: [P]=Published  [D]=Draft  [-]=Not started |
|         [I]=Indexing   [E]=Error                  |
+--------------------------------------------------+
```

**Cell interaction:**
- Click any cell to open a detail panel:
  - Page URL, title, meta description
  - Word count, unique content percentage
  - Indexing status (GSC data)
  - Organic impressions + clicks (last 30 days)
  - [Edit Content] [Regenerate] [View Live] [Check Index] actions
- Color coding: green=published+indexed, blue=published+not-indexed, yellow=draft, gray=not-started, red=error
- Bulk actions: select multiple cells, "Generate All Selected" triggers batch AI generation via Inngest
- Priority badges: P1 cells have a star indicator (the 12 priority-1 pages from SEO strategy)

**Matrix selector tabs:** Exit Planning (8x6) | Business Valuation (8 sector pages) | M&A Advisory (6 location pages) | Glossary (term list)

#### 2.3.3 Site Architecture Tree `/seo/architecture`

**Layout:** Interactive tree visualization.

**Features:**
- Full site architecture from seo-strategy-2026-04-06.md rendered as an expandable tree
- Each node shows: URL path, page title, status (live/draft/planned), page type (transactional/content/programmatic)
- Click a node: shows page details, internal link count (inbound + outbound), schema types present, last modified date
- Drag-and-drop to reorganize (generates redirect rules)
- "Add Page" at any node level
- Internal linking visualization: toggle to show link relationships as colored lines between nodes
- Breadcrumb preview for any selected node
- Export: sitemap.xml generation

#### 2.3.4 Keyword Tracking Dashboard `/seo/keywords`

**Layout:** Data table with chart panel.

```
+--------------------------------------------------+
|  KEYWORD TRACKING                                 |
+--------------------------------------------------+
| Source: [GSC v]  Period: [Last 30 days v]         |
+--------------------------------------------------+
| +----------------------------------------------+ |
| | Keyword         | Pos | Impr | Clicks | CTR  | |
| | sell business sg | 12  | 340  | 28     | 8.2% | |
| | m&a advisory sg  | 8   | 520  | 61     | 11.7%| |
| | saas valuation   | 23  | 180  | 6      | 3.3% | |
| | exit planning    | 31  | 90   | 2      | 2.2% | |
| +----------------------------------------------+ |
|                                                   |
| POSITION TREND (selected keyword)                 |
| [Line chart: position over last 90 days]          |
+--------------------------------------------------+
```

**Features:**
- GSC integration: pulls search performance data via Google Search Console API
- Optional Ahrefs integration: domain rating, backlink count, keyword difficulty scores
- Keyword grouping by: pillar page, programmatic page, cluster
- Position trend charts per keyword (90-day view)
- Alerts: position drops of 5+ places highlighted in red
- "Content Gap" view: keywords where Capital8 appears on page 2-3 with suggested content actions
- Target keyword management: add/remove tracked keywords, set target positions

#### 2.3.5 AI SEO Section `/seo/ai`

**Layout:** Dashboard for AI search optimization.

**Features:**
- AI Citation Tracker: manual or semi-automated logging of Capital8 mentions in ChatGPT, Claude, Perplexity, Google AI Overviews
  - Target questions from seo-strategy (25 questions across 3 tiers)
  - Status per question: Cited / Mentioned / Absent
  - Last checked date
  - [Check Now] button that opens Playwright MCP to query the AI platforms
- Bot Access Status: shows robots.txt configuration for GPTBot, Claude-Web, PerplexityBot, Amazonbot, Google-Extended, CCBot
- AI Readability Audit: per-page analysis of how extractable content is for AI systems (clean HTML check, FAQ schema presence, structured data, table usage)
- Recommendations panel: AI-generated weekly suggestions for improving citation likelihood

#### 2.3.6 On-Site SEO `/seo/onsite`

**Layout:** Audit report with page-level detail.

**Features:**
- Technical SEO audit: runs via Playwright MCP against live site
  - Page speed scores (Core Web Vitals)
  - Schema markup validation per page
  - Broken link checker
  - Image alt text audit
  - Meta title/description completeness
  - H1 uniqueness check
  - Internal linking depth analysis
  - SSR/SSG verification (critical per SEO strategy)
- Issue list: sortable by severity (Critical / High / Medium / Low)
- Each issue: page URL, issue description, suggested fix, [Fix Now] action (opens content editor or generates fix)
- Historical comparison: run audits weekly, compare scores over time

#### 2.3.7 Weekly AI Recommendations `/seo/recommendations`

**Purpose:** AI-generated SEO action items, refreshed weekly via Inngest cron.

**Features:**
- Generated every Monday at 6am by Inngest job:
  1. Pulls GSC data for last 7 days
  2. Checks programmatic page indexing status
  3. Analyzes keyword movement
  4. Generates 5-10 prioritized recommendations via Claude API
- Each recommendation: title, description, affected pages, estimated impact (High/Medium/Low), [Take Action] button
- Action types: "Write more content for X page", "Add FAQ schema to Y", "Improve internal linking from Z", "This keyword is trending -- create a post about it"
- Recommendation history: view past weeks' recommendations and their completion status

#### 2.3.8 SEO Content Editor `/seo/editor/[slug]`

**Purpose:** Edit programmatic page content directly from the SEO view.

**Features:**
- Same editor as blog editor but pre-loaded with programmatic template structure
- Template sections from seo-strategy: Market Context, Valuation Benchmarks, Preparation Checklist, Exit Process, Buyer Landscape, CTA
- Per-section AI generation: "Generate Market Context for SaaS/Singapore" -- uses Claude API with sector+country data
- Unique content percentage indicator (must be >40% per SEO strategy quality gate)
- Side panel shows: target keywords, search volume, current ranking, competitor content analysis
- [Publish to Vercel] button triggers Vercel MCP deployment

### 2.4 Webpage Creator

**Purpose:** Spin up and manage 100+ programmatic SEO pages at scale.

#### 2.4.1 Webpage Hub `/pages`

**Layout:** Page list with bulk actions.

```
+--------------------------------------------------+
|  WEBPAGE CREATOR                                  |
+--------------------------------------------------+
| [+ New Page] [Bulk Generate] [Templates]          |
+--------------------------------------------------+
| Filter: [All Types v] [All Status v] Search: [__] |
+--------------------------------------------------+
| +----------------------------------------------+ |
| | Page                    | Type   | Status     | |
| | /exit-planning/saas/sg  | Prog   | Published  | |
| | /exit-planning/saas/my  | Prog   | Draft      | |
| | /business-val/saas      | Prog   | Published  | |
| | /guides/selling/exit..  | Guide  | Review     | |
| | /m-and-a/singapore      | Loc    | Published  | |
| +----------------------------------------------+ |
+--------------------------------------------------+
```

#### 2.4.2 Bulk Generator `/pages/generator`

**Purpose:** Generate dozens of pages in one operation using the sector x country x deal-size matrix.

**Layout:** Matrix selector + generation controls.

```
+--------------------------------------------------+
|  BULK PAGE GENERATOR                              |
+--------------------------------------------------+
| Template: [Exit Planning v]                       |
+--------------------------------------------------+
| SELECT PAGES TO GENERATE:                         |
|                                                   |
| Sectors:        Countries:                        |
| [x] B2B SaaS    [x] Singapore                    |
| [x] Prof Svc    [x] Malaysia                     |
| [ ] Healthcare  [x] Australia                     |
| [ ] Agencies    [ ] Indonesia                     |
| [ ] Logistics   [ ] Thailand                      |
| [ ] E-commerce  [ ] Vietnam                       |
| [ ] Education                                     |
| [ ] Tech Svc                                      |
|                                                   |
| Selected: 6 pages (2 sectors x 3 countries)       |
|                                                   |
| Quality Settings:                                 |
| Min unique content: [40%]                         |
| Target word count:  [2000]                        |
| Include FAQ schema: [Yes]                         |
| Include market data: [Yes]                        |
|                                                   |
| [Preview 1 Sample] [Generate All 6]               |
+--------------------------------------------------+
```

**Generation process:**
1. User selects sectors + countries from matrix
2. System calculates total pages and estimated generation time
3. "Preview 1 Sample" generates a single page for review before committing
4. "Generate All" queues an Inngest batch job
5. Each page generation:
   a. Loads programmatic page template from seo-strategy
   b. Pulls sector+country specific data (public M&A statistics, regulatory info, buyer landscape)
   c. Sends to Claude API with full template and data context
   d. Validates unique content percentage (>40% or flags for review)
   e. Generates schema markup (Article + FAQPage + Service + BreadcrumbList)
   f. Saves as draft in Supabase
6. Progress indicator shows pages completed / total
7. On completion: all pages appear in draft status for review

#### 2.4.3 Template Manager `/pages/templates`

**Features:**
- View and edit the 3 programmatic templates: Exit Planning, Business Valuation, M&A Advisory Location
- Template editor: define sections, placeholder variables ({sector}, {country}, {city}), default content per section
- Custom template creation for new page types
- Template versioning: track changes over time

---

## 3. Data Model

### 3.1 Existing Tables (from database-integration-design.md -- read-only)

These 5 tables exist in the operational database. The Command Center reads from them via Supabase RPC or direct queries with a read-only role.

- `exitfit_completions` -- ExitFit Diagnostic submissions
- `sprint_engagements` -- Sprint session tracking
- `active_mandates` -- Live advisory mandates
- `closed_deals` -- Completed exits
- `dealmaker_network` -- Dealmaker Network members

### 3.2 New Tables (Command Center application data)

```sql
-- Content items: all content created in the system
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  type VARCHAR NOT NULL, -- 'linkedin_post', 'email', 'blog', 'video_script', 'carousel', 'instagram', 'youtube_thumbnail', 'programmatic_page'
  title TEXT NOT NULL,
  body JSONB NOT NULL, -- structured content (sections, slides, etc.)
  body_text TEXT, -- plain text extraction for search
  audience VARCHAR NOT NULL, -- 'seller', 'buyer', 'dealmaker'
  voice_mode VARCHAR, -- 'ADVISOR', 'PEER', 'SALES', 'BRAND'
  pillar VARCHAR, -- 'exit_education', 'mistake_diagnosis', 'market_patterns', 'proof_methodology', 'investor_access'
  status VARCHAR NOT NULL DEFAULT 'draft', -- 'draft', 'review', 'approved', 'scheduled', 'published', 'rejected'
  compliance_result JSONB, -- { passed: boolean, violations: [...] }
  metadata JSONB, -- type-specific metadata (hook_options, word_count, cta_type, psychology_lever, etc.)
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

-- Content schedules: when content is scheduled to publish
CREATE TABLE content_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL, -- 'linkedin', 'instagram', 'email', 'buffer', 'website'
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  external_id VARCHAR, -- ID from external platform after publishing
  status VARCHAR NOT NULL DEFAULT 'queued', -- 'queued', 'publishing', 'published', 'failed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content performance: engagement data pulled back from platforms
CREATE TABLE content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0, -- clicks to capital8.io
  custom_metrics JSONB -- platform-specific (email: opens, click_rate, bounces)
);

-- Email sequences
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  audience VARCHAR NOT NULL,
  trigger_event VARCHAR NOT NULL, -- 'exitfit_complete', 'sprint_complete', 'manual'
  status VARCHAR NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused'
  emails JSONB NOT NULL, -- ordered array of { day_offset, subject, content_id, conditions }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  audience VARCHAR NOT NULL, -- 'seller', 'buyer', 'dealmaker'
  list_segment VARCHAR, -- 'post_diagnostic', 'post_sprint', 'investor', 'dealmaker'
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  source VARCHAR, -- 'exitfit', 'website', 'linkedin', 'manual'
  utm_campaign VARCHAR,
  metadata JSONB
);

-- Programmatic pages
CREATE TABLE programmatic_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template VARCHAR NOT NULL, -- 'exit_planning', 'business_valuation', 'ma_advisory'
  sector VARCHAR, -- nullable for location pages
  country VARCHAR, -- nullable for valuation pages
  city VARCHAR, -- for location pages only
  slug VARCHAR NOT NULL UNIQUE, -- full URL path e.g. '/exit-planning/saas/singapore'
  title TEXT NOT NULL,
  meta_description TEXT,
  content JSONB NOT NULL, -- structured sections
  content_text TEXT, -- plain text for unique-content analysis
  unique_content_pct NUMERIC, -- calculated percentage of unique content
  word_count INTEGER,
  schema_markup JSONB, -- generated schema.org JSON-LD
  status VARCHAR NOT NULL DEFAULT 'not_started', -- 'not_started', 'generating', 'draft', 'review', 'published', 'error'
  priority INTEGER DEFAULT 2, -- 1=P1 (launch), 2=P2 (90 days), 3=P3 (scale)
  published_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ, -- when GSC confirmed indexing
  gsc_impressions INTEGER DEFAULT 0,
  gsc_clicks INTEGER DEFAULT 0,
  gsc_avg_position NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO keywords
CREATE TABLE seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR NOT NULL,
  page_id UUID REFERENCES programmatic_pages(id),
  content_id UUID REFERENCES content_items(id),
  tier INTEGER, -- 1, 2, or 3 from AI SEO strategy
  intent VARCHAR, -- 'seller', 'buyer', 'dealmaker'
  search_volume INTEGER,
  difficulty NUMERIC,
  current_position NUMERIC,
  target_position NUMERIC,
  impressions_30d INTEGER,
  clicks_30d INTEGER,
  ctr_30d NUMERIC,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI citation tracking
CREATE TABLE ai_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL, -- the question asked
  tier INTEGER NOT NULL, -- 1, 2, or 3
  platform VARCHAR NOT NULL, -- 'chatgpt', 'claude', 'perplexity', 'google_ai_overview'
  status VARCHAR NOT NULL, -- 'cited', 'mentioned', 'absent'
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  response_excerpt TEXT, -- relevant portion of AI response
  source_url VARCHAR -- which Capital8 page was cited
);

-- Sprints (mirrors .agents/marketing-sprint-current.md in structured form)
CREATE TABLE marketing_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  priority_audience VARCHAR NOT NULL,
  sprint_goal TEXT,
  current_phase INTEGER DEFAULT 1, -- 1-8
  status VARCHAR NOT NULL DEFAULT 'active', -- 'planning', 'active', 'complete'
  phase_data JSONB, -- structured data for each phase
  goals JSONB, -- array of { metric, target, current }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log (autonomous actions)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  category VARCHAR NOT NULL, -- 'content', 'seo', 'email', 'data', 'system', 'error'
  action VARCHAR NOT NULL, -- human-readable description
  details JSONB, -- structured details
  source VARCHAR NOT NULL, -- 'inngest', 'make', 'manual', 'cron'
  related_id UUID, -- FK to content_items, programmatic_pages, etc.
  related_type VARCHAR -- 'content_item', 'programmatic_page', 'email_sequence'
);

-- Research cache
CREATE TABLE research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  type VARCHAR NOT NULL, -- 'competitive', 'topic', 'content_analysis'
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Platform metrics (daily snapshots for dashboard)
CREATE TABLE platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  platform VARCHAR NOT NULL, -- 'linkedin', 'instagram', 'email', 'website'
  metric_name VARCHAR NOT NULL, -- 'followers', 'subscribers', 'engagement_rate', etc.
  metric_value NUMERIC NOT NULL,
  UNIQUE(date, platform, metric_name)
);
```

### 3.3 Row Level Security

All Command Center tables use Supabase RLS:
- Only authenticated users can read/write
- In the current single-user model (Sven), RLS restricts to `auth.uid() = created_by` or a configurable admin UUID
- Read-only operational tables (exitfit_completions, etc.) use a separate read-only DB role with no RLS bypass

---

## 4. API Routes

### 4.1 Next.js API Routes (App Router)

```
/api/auth/[...supabase]           -> Supabase Auth callback handling

-- Content
/api/content                      -> GET (list), POST (create)
/api/content/[id]                 -> GET, PUT, DELETE
/api/content/[id]/approve         -> POST (approve content)
/api/content/[id]/reject          -> POST (reject content)
/api/content/[id]/compliance      -> POST (run compliance check)
/api/content/generate             -> POST (Claude API content generation)
/api/content/batch                -> POST (generate weekly LinkedIn batch)

-- Scheduling & Publishing
/api/schedule                     -> GET (list), POST (create schedule)
/api/schedule/[id]                -> PUT (update), DELETE (cancel)
/api/publish/[id]                 -> POST (publish now to platform)

-- Performance
/api/performance/[content_id]     -> GET (engagement data for content item)
/api/performance/pull             -> POST (trigger pull from LinkedIn/email APIs)

-- Email
/api/email/sequences              -> GET (list), POST (create)
/api/email/sequences/[id]         -> GET, PUT, DELETE
/api/email/subscribers            -> GET (list), POST (add)
/api/email/send                   -> POST (trigger email send via Resend)

-- SEO
/api/seo/pages                    -> GET (list programmatic pages)
/api/seo/pages/[id]               -> GET, PUT
/api/seo/pages/generate           -> POST (generate single page)
/api/seo/pages/bulk-generate      -> POST (queue bulk generation via Inngest)
/api/seo/keywords                 -> GET (list), POST (add keyword)
/api/seo/keywords/sync            -> POST (pull from GSC)
/api/seo/architecture             -> GET (full site tree)
/api/seo/audit                    -> POST (trigger on-site SEO audit)
/api/seo/recommendations          -> GET (latest weekly recommendations)
/api/seo/ai-citations             -> GET (list), POST (log new check)

-- Sprints
/api/sprint                       -> GET (current), POST (create new)
/api/sprint/[id]                  -> PUT (update phase, goals)

-- Activity
/api/activity                     -> GET (activity feed, paginated)

-- Metrics
/api/metrics/dashboard            -> GET (aggregated dashboard metrics)
/api/metrics/[platform]           -> GET (platform-specific metrics)

-- Research
/api/research/competitive         -> POST (run competitive analysis)
/api/research/topic               -> POST (run topic research)
/api/research/content-analysis    -> POST (analyze existing content)

-- Image Generation
/api/images/generate              -> POST (proxy to nano-banana MCP)
/api/images/edit                  -> POST (proxy to nano-banana MCP)

-- Deployment
/api/deploy/page/[id]             -> POST (deploy page via Vercel MCP)
```

### 4.2 Supabase Edge Functions

```
-- Webhook receivers
/functions/v1/make-webhook        -> Receives Make.com automation webhooks
/functions/v1/linkedin-webhook     -> Receives LinkedIn engagement webhooks (if available)
/functions/v1/resend-webhook      -> Receives Resend email event webhooks (opens, clicks, bounces)
/functions/v1/inngest-webhook     -> Inngest event ingestion

-- Scheduled functions
/functions/v1/daily-metrics-pull  -> Pulls daily metrics from all platforms
/functions/v1/weekly-seo-report   -> Generates weekly SEO recommendations
/functions/v1/gsc-sync            -> Syncs Google Search Console data
```

---

## 5. Integration Map

### 5.1 MCP Tool Integration Points

| MCP Tool | Used In | Purpose |
|----------|---------|---------|
| **nano-banana** (generate_image, edit_image, continue_editing) | LinkedIn Design, YouTube Thumbnails, Carousel Creator, Instagram Content, Blog Image Insertion | All image generation and editing throughout the app |
| **Vercel MCP** (deploy_to_vercel, get_deployment, list_deployments) | Webpage Creator, Blog Publisher, Programmatic Page Publisher | Deploy content pages and programmatic SEO pages to production |
| **Playwright MCP** (browser_navigate, browser_snapshot, browser_take_screenshot) | Content Research (competitive scraping), AI Citation Tracker, On-Site SEO Audit | Browser automation for research, auditing, and AI platform checking |
| **Make.com MCP** (scenarios_create, scenarios_run, hooks_create) | Content Poster (LinkedIn publishing), Email triggers, Metric pulls | Automation workflows connecting external platforms |
| **Google Calendar MCP** (gcal_list_events, gcal_create_event) | Content Calendar, Sprint Planning | Sync content schedule with Google Calendar |
| **Gmail MCP** (gmail_search_messages, gmail_create_draft) | Email Sequences, Dealmaker Outreach | Draft and monitor outreach emails |
| **Google Drive MCP** (google_drive_search, google_drive_fetch) | Content Research, Sprint Files | Access shared documents and research materials |
| **Supabase MCP** (execute_sql, list_tables, apply_migration) | All data operations, Schema management | Direct database operations and migrations |
| **Chrome Extension MCP** (navigate, get_page_text, read_page) | Content Research, Competitive Analysis | Browse and extract content from competitor sites |

### 5.2 External API Integrations (non-MCP)

| API | Used In | Purpose |
|-----|---------|---------|
| **Claude API** (Anthropic) | Content generation, compliance checking, SEO recommendations, research analysis | All AI-powered features |
| **Resend** | Email sequence sending, transactional emails | Email delivery |
| **Google Search Console** | SEO keyword tracking, indexing status, search performance | Organic search data |
| **LinkedIn API** (via Make.com or direct) | Content Poster, performance pulling | Post publishing and engagement data |
| **Buffer API** (optional) | Content Poster | Multi-platform scheduling |
| **Ahrefs API** (optional) | SEO keyword tracking | Keyword difficulty, backlink data |

### 5.3 Integration Architecture

```
                           +------------------+
                           |   Next.js App    |
                           |   (Vercel)       |
                           +--------+---------+
                                    |
                    +---------------+---------------+
                    |               |               |
              +-----+-----+  +-----+-----+  +-----+-----+
              | Supabase   |  | Claude API |  | Inngest   |
              | (Postgres  |  | (Anthropic)|  | (Job      |
              |  + Auth    |  |            |  |  Queue)   |
              |  + Realtime|  +------------+  +-----+-----+
              |  + Edge Fn)|                        |
              +-----+------+                  +-----+-----+
                    |                         | Scheduled  |
              +-----+------+                  | Jobs:      |
              | Operational |                  | - Metrics  |
              | DB (read)   |                  | - SEO      |
              | - exitfit   |                  | - Content  |
              | - sprints   |                  | - Audit    |
              | - mandates  |                  +-----+-----+
              | - deals     |                        |
              | - network   |                  +-----+-----+
              +-------------+                  | Make.com   |
                                               | Scenarios  |
                                               +-----+-----+
                                                     |
                                    +----------------+----------------+
                                    |                |                |
                              +-----+-----+   +-----+-----+   +-----+-----+
                              | LinkedIn   |   | Resend     |   | GSC       |
                              | (publish)  |   | (email)    |   | (SEO)     |
                              +-----------+   +-----------+   +-----------+
```

---

## 6. Autonomous Execution Engine

### 6.1 Overview

The autonomous execution engine runs marketing tasks on schedule without human intervention. It generates content, pulls metrics, runs audits, and queues items for approval. Sven's morning dashboard shows what it did overnight.

### 6.2 Inngest Job Definitions

```typescript
// Content generation jobs
"content/weekly-batch"         // Generates 4 LinkedIn posts every Sunday night
"content/email-sequence-send"  // Checks and sends due emails from active sequences
"content/performance-pull"     // Pulls engagement data from platforms every 6 hours

// SEO jobs
"seo/weekly-recommendations"   // Generates weekly SEO recommendations every Monday 6am
"seo/gsc-sync"                 // Syncs Google Search Console data daily at 5am
"seo/index-check"              // Checks indexing status of published pages weekly
"seo/ai-citation-check"        // Checks AI citations for Tier 1 questions weekly

// Metrics jobs
"metrics/daily-snapshot"       // Pulls and stores daily metric snapshots at 11pm
"metrics/linkedin-pull"        // Pulls LinkedIn analytics daily at 7am
"metrics/email-stats"          // Pulls email performance from Resend daily

// Audit jobs
"audit/compliance-sweep"       // Re-runs compliance check on all published content weekly
"audit/onsite-seo"             // Runs on-site SEO audit weekly via Playwright

// Sprint jobs
"sprint/phase-check"           // Checks if current sprint phase has pending actions daily
"sprint/goal-update"           // Updates sprint goal progress from latest metrics daily
```

### 6.3 Job Execution Flow

```
1. Inngest cron triggers job at scheduled time
2. Job function runs in Vercel serverless environment
3. For AI tasks: loads relevant SKILL.md + product-marketing-context.md,
   constructs Claude API prompt, executes
4. Results written to Supabase tables
5. Activity log entry created
6. If content was generated: status set to 'review', added to approval queue
7. If error occurs: activity log entry with category='error', notification sent
8. Dashboard updates in real-time via Supabase Realtime subscriptions
```

### 6.4 Approval Workflow

```
Generated Content -> Compliance Check -> Review Queue -> Sven Reviews
                                                           |
                                              [Approve] -> Scheduled/Published
                                              [Edit]    -> Editor -> Re-check -> Queue
                                              [Reject]  -> Archived with reason
```

All AI-generated content enters the approval queue. Nothing publishes without explicit human approval. This matches the orchestrator's gate system (Phase 2 and Phase 4 require Sven's confirmation).

### 6.5 Overnight Run Configuration

Default overnight schedule (configurable in settings):

| Time | Job | Description |
|------|-----|-------------|
| 23:00 | metrics/daily-snapshot | Capture end-of-day metrics |
| 02:00 | content/weekly-batch | Sunday only: generate next week's LinkedIn batch |
| 03:00 | seo/ai-citation-check | Monday only: check AI platform citations |
| 05:00 | seo/gsc-sync | Pull latest GSC data |
| 05:30 | audit/onsite-seo | Sunday only: run technical SEO audit |
| 06:00 | seo/weekly-recommendations | Monday only: generate SEO recommendations |
| 06:30 | metrics/linkedin-pull | Pull LinkedIn analytics |
| 06:30 | metrics/email-stats | Pull email performance |
| 06:45 | sprint/goal-update | Update sprint goal progress |
| 07:00 | content/email-sequence-send | Check and send due nurture emails |

---

## 7. Component Library

### 7.1 Shared UI Components (shadcn/ui based)

| Component | Description | Used In |
|-----------|-------------|---------|
| `ApprovalCard` | Content preview card with approve/reject/edit actions, audience badge, compliance status | Dashboard, Content Hub |
| `ContentEditor` | Rich text editor (Tiptap) with AI assist, compliance checking, word count | All content creation screens |
| `ComplianceChecker` | Real-time compliance validation against Capital8 rules, inline annotations | All editors |
| `AudienceBadge` | Color-coded badge: Seller (blue), Buyer (green), Dealmaker (amber) | Everywhere content is listed |
| `VoiceModeBadge` | Color-coded badge: ADVISOR (blue), PEER (green), SALES (orange), BRAND (purple) | Content lists, calendar |
| `StatusBadge` | Status pill: Draft (gray), Review (yellow), Approved (green), Published (blue), Rejected (red) | Content lists |
| `MetricCard` | Card with label, large value, delta indicator, sparkline | Dashboard |
| `ActivityFeedItem` | Timestamped activity entry with icon, description, and action link | Dashboard |
| `SprintCard` | Sprint summary card with progress bar, phase indicator, goals | Dashboard |
| `ContentCalendar` | Week/month calendar view with drag-and-drop content scheduling | Content Hub, Poster |
| `ProgrammaticGrid` | Matrix grid (sector x country) with status cells | SEO Programmatic |
| `SiteTree` | Interactive tree visualization with expandable nodes | SEO Architecture |
| `EmailTimeline` | Horizontal timeline showing email sequence with draggable nodes | Email Sequence Builder |
| `ImageGenerator` | Wrapper around nano-banana MCP with prompt builder and preview | Design screens |
| `SlideEditor` | Individual carousel slide editor with text, image, background controls | Carousel Creator |
| `KeywordTable` | Data table with position trend sparklines and alert indicators | SEO Keywords |
| `SEOSidebar` | Sidebar panel for SEO metadata: keyword, density, meta preview, links | Blog Editor, SEO Editor |
| `SkillLoader` | Component that reads and parses SKILL.md files for AI prompt construction | AI generation features |
| `PlatformPreview` | Shows how content renders on LinkedIn, Instagram, email | Content creation, Poster |
| `BulkActionBar` | Floating bar for bulk operations on selected items | Content lists, Page lists |

### 7.2 Layout Components

| Component | Description |
|-----------|-------------|
| `AppShell` | Main layout: side nav + top bar + content area |
| `SideNav` | Collapsible navigation with route indicators |
| `TopBar` | Logo, global search (Cmd+K), notification bell, user menu |
| `SlideOverPanel` | Right-side slide panel for previews, details, quick edits |
| `CommandPalette` | Cmd+K search dialog: search content, navigate routes, trigger actions |

---

## 8. Phased Build Plan

### Phase 1: Foundation (Week 1-2)

**Goal:** App shell, auth, database, dashboard skeleton.

**Tasks:**
1. Initialize Next.js 15 project with App Router, Tailwind CSS, shadcn/ui
2. Set up Supabase project: create all tables from Section 3.2
3. Implement Supabase Auth (magic link + Google OAuth)
4. Build AppShell layout: SideNav, TopBar, route structure
5. Build Dashboard page with placeholder data:
   - MetricCard components (hardcoded data initially)
   - ActivityFeed component (reads from activity_log table)
   - SprintCard component (reads from marketing_sprints table)
   - ApprovalQueue component (reads from content_items where status='review')
6. Set up Inngest with Vercel deployment
7. Deploy to Vercel with Supabase env vars

**Deliverable:** Working app shell with auth, empty dashboard with component structure, database schema applied.

### Phase 2: Content Engine (Week 3-5)

**Goal:** Core content creation with AI generation and compliance checking.

**Tasks:**
1. Build ContentEditor component (Tiptap-based rich text editor)
2. Build ComplianceChecker: implement all rules from product-marketing-context.md
3. Build AI content generation endpoint (`/api/content/generate`):
   - SKILL.md parser that constructs Claude API system prompts
   - Product context loader
   - Structured output: hooks, full post, metadata, compliance result
4. Build Content Hub page (`/content`): content list, quick actions, calendar stub
5. Build LinkedIn Post Creator (`/content/create`): form, AI generation, editor, compliance
6. Build LinkedIn Batch Creator (`/content/linkedin`): weekly batch configuration, 4-post generation, sequencing checks
7. Build Content Poster (`/content/poster`): calendar view, scheduling, queue
8. Implement approval workflow: review queue, approve/reject/edit actions
9. Connect approval queue to Dashboard

**Deliverable:** Full LinkedIn content creation pipeline: generate, edit, compliance-check, approve, schedule.

### Phase 3: SEO Foundation (Week 6-8)

**Goal:** Programmatic page management and SEO tracking.

**Tasks:**
1. Build Programmatic Pages Grid (`/seo/programmatic`): matrix view with all 62 pages
2. Build SEO Content Editor (`/seo/editor/[slug]`): template-aware editor with section-by-section AI generation
3. Build Bulk Generator (`/pages/generator`): matrix selection, Inngest batch job
4. Build single-page generation API (`/api/seo/pages/generate`): template + data + Claude API
5. Build Site Architecture Tree (`/seo/architecture`): interactive tree from seo-strategy
6. Build Keyword Tracking Dashboard (`/seo/keywords`): data table, add/remove keywords
7. Implement GSC integration (`/api/seo/keywords/sync`): pull search performance data
8. Build Webpage Creator hub and Template Manager
9. Connect Vercel MCP for page deployment

**Deliverable:** Full programmatic SEO pipeline: create, generate, edit, deploy, track indexing.

### Phase 4: Email & Visual Content (Week 9-11)

**Goal:** Email sequences, visual content creation, remaining content types.

**Tasks:**
1. Build Email Sequence Builder (`/content/email`): visual timeline, template selection
2. Build email editor with AI generation (seller-nurture-email skill integration)
3. Connect Resend for email sending + webhook receiver for stats
4. Build Email Subscriber management
5. Build Carousel Creator (`/content/carousel`): slide editor, templates, export
6. Build YouTube Thumbnail Creator (`/content/youtube`): template-based with nano-banana
7. Build Instagram Content Creator (`/content/instagram`): nano-banana integration
8. Build LinkedIn Visual Design (`/content/linkedin/design`): templates, image generation
9. Build Video Script Generator (`/content/video`): short-form and long-form templates
10. Build Blog/Guide Editor (`/content/blog`): rich editor with SEO sidebar

**Deliverable:** Complete content creation suite across all content types.

### Phase 5: Autonomous Engine (Week 12-14)

**Goal:** Overnight batch processing, scheduled jobs, activity feed.

**Tasks:**
1. Implement all Inngest job definitions from Section 6.2
2. Build weekly LinkedIn batch cron job (Sunday night generation)
3. Build daily metrics pull jobs (LinkedIn, email, website)
4. Build weekly SEO recommendation generator
5. Build GSC daily sync job
6. Build email sequence scheduler (check and send due emails)
7. Build sprint goal updater
8. Build on-site SEO audit job (Playwright-based)
9. Connect all jobs to activity_log table
10. Build activity feed real-time updates via Supabase Realtime
11. Build notification system: error alerts, approval-needed notifications

**Deliverable:** Fully autonomous overnight execution. Dashboard shows all activity by morning.

### Phase 6: AI SEO & Polish (Week 15-17)

**Goal:** AI SEO features, advanced integrations, production hardening.

**Tasks:**
1. Build AI SEO section (`/seo/ai`): citation tracker, bot access status
2. Build AI citation checking via Playwright (query AI platforms)
3. Build On-Site SEO audit dashboard (`/seo/onsite`)
4. Build Content Research module (`/content/research`): competitive, topic, content analysis
5. Implement Make.com integration for LinkedIn publishing automation
6. Implement Buffer integration (optional, for multi-platform)
7. Build Settings page with API key management and integration status
8. Build SKILL.md browser in settings (browse and view all 46 skills)
9. Performance optimization: ISR for dashboard, connection pooling, edge caching
10. Mobile responsive pass on all screens
11. Error handling, loading states, empty states across all screens

**Deliverable:** Production-ready application with all features operational.

### Phase 7: Content Poster & Publishing (Week 18-19)

**Goal:** Direct publishing pipeline to external platforms.

**Tasks:**
1. LinkedIn API direct posting (or via Make.com scenario)
2. Instagram publishing (via Make.com or Buffer)
3. Email publishing via Resend with subscriber segmentation
4. Blog/guide publishing to capital8.io via Vercel MCP
5. Programmatic page publishing to capital8.io via Vercel MCP
6. Post-publish performance tracking loop (pull engagement after 24h/48h/7d)
7. Content calendar sync with Google Calendar MCP

**Deliverable:** End-to-end content lifecycle: create -> approve -> publish -> measure.

### Phase 8: Optimization & Feedback Loops (Week 20+)

**Goal:** Closed-loop optimization, advanced analytics, continuous improvement.

**Tasks:**
1. Content performance attribution: which content types drive ExitFit completions (Query 10)
2. A/B testing infrastructure: hook variants, CTA variants, publish time variants
3. AI content quality scoring: train Claude to rate content quality over time based on performance data
4. Sprint automation: AI suggests next sprint goals based on metric trends
5. Dealmaker Network dashboard extension: referral tracking integration
6. Advanced reporting: monthly marketing scorecard auto-generation
7. Command palette enhancements: natural language commands ("generate a post about SaaS valuations")

**Deliverable:** Self-improving marketing engine with closed feedback loops.

---

## 9. Technical Decisions & Constraints

### 9.1 State Management
- Server-first with Next.js 15 Server Components
- Supabase Realtime for live dashboard updates (approval queue, activity feed, metrics)
- React Query (TanStack Query) for client-side data fetching and caching
- No global client state store needed; each page fetches its own data

### 9.2 AI Prompt Construction
- Each content generation request constructs a system prompt from:
  1. Base instructions (from the relevant SKILL.md file)
  2. Product context (from product-marketing-context.md)
  3. Database context (from db-snapshot or live queries)
  4. Sprint context (from marketing-sprint-current.md)
  5. User-provided brief/inputs
- Prompt templates stored as TypeScript modules, not in the database
- Token budget: ~4000 tokens for system prompt, ~2000 for user context, remainder for generation

### 9.3 Compliance Engine
- Runs as a synchronous function in the API route, not as a separate service
- Returns structured results: `{ passed: boolean, violations: [{ rule, location, severity, suggestion }] }`
- Blocks publishing if critical violations exist (forbidden words, regulatory claims)
- Warns but allows for non-critical issues (word count slightly off, missing specific number)

### 9.4 Security
- Supabase Auth with RLS on all tables
- API routes protected by Supabase session validation
- Operational database access via read-only Postgres role
- API keys (Claude, Resend, GSC, LinkedIn) stored as Vercel environment variables
- No client-side exposure of API keys

### 9.5 Performance
- Dashboard uses ISR (Incremental Static Regeneration) with 60-second revalidation for metric cards
- Activity feed and approval queue use Supabase Realtime for instant updates
- Programmatic page generation uses Inngest background jobs (not blocking API routes)
- Image generation proxied through API routes to avoid MCP tool timeout issues

---

### Critical Files for Implementation
- `/Users/sven/Claude/Capital8Marketing/capital8marketing/.agents/product-marketing-context.md` -- source of truth for all compliance rules, voice modes, audience definitions, brand glossary, and proof points that must be encoded into the ComplianceChecker and AI prompt construction
- `/Users/sven/Claude/Capital8Marketing/capital8marketing/skills/marketing-orchestrator/SKILL.md` -- defines the 8-phase orchestration model, skill routing table, and command router that the Sprint management and autonomous engine must mirror
- `/Users/sven/Claude/Capital8Marketing/capital8marketing/.agents/database-integration-design.md` -- defines the 5 operational tables and 14 queries that the dashboard metrics and AI content generation depend on
- `/Users/sven/Claude/Capital8Marketing/capital8marketing/.agents/seo-strategy-2026-04-06.md` -- defines the complete site architecture, programmatic SEO matrix (48+8+6 pages), and AI SEO strategy that the SEO Specialist and Webpage Creator screens must implement
- `/Users/sven/Claude/Capital8Marketing/capital8marketing/skills/social-content-capital8/SKILL.md` -- defines the exact LinkedIn post structure, hook patterns, voice modes, batch workflow, and compliance rules that the Content Creator AI generation must follow
