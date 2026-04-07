# Marketing Command Center — Spec Addendum
## LLM Model Routing Strategy

Date: 2026-04-07
Extends: webapp-spec-2026-04-07.md, webapp-architecture-hardening.md (Section 4.2 Cost Control)

---

## Purpose

Not every AI call needs the same model. Content research doesn't need Opus. A compliance scan doesn't need an LLM at all. This document maps every AI call in the system to the cheapest model that does the job well, and opens the door to non-Anthropic models where appropriate.

---

## Model Tiers

| Tier | Model | Cost (per 1M tokens in/out) | Use When |
|---|---|---|---|
| **T1 — Flagship** | Claude Sonnet 4 | ~$3/$15 | Final content generation that goes to market — needs brand voice, compliance awareness, creative quality |
| **T2 — Fast** | Claude Haiku 3.5 | ~$0.80/$4 | Summarization, classification, extraction, drafting, recommendations — doesn't need creative brilliance |
| **T3 — Deterministic** | No LLM | $0 | Regex, string matching, rule-based checks — compliance checker, formatting validation |
| **T4 — External** | Gemini 2.0 Flash | ~$0.10/$0.40 | Bulk research, data extraction from scraped pages, simple Q&A — highest volume, lowest stakes |

**Why no Opus?** Opus is 5x the cost of Sonnet for marginal quality improvement on structured marketing content. Sonnet with a well-crafted system prompt (which we have — the SKILL.md files are detailed) produces equivalent output for this use case. If a specific task consistently underperforms on Sonnet, we can upgrade that single call to Opus without changing the architecture.

---

## Every AI Call, Mapped

### Content Creator

| Call | What It Does | Volume | Tier | Rationale |
|---|---|---|---|---|
| LinkedIn post generation | Generates 3 hook options + full post from brief | ~16/month | **T1 Sonnet** | Goes to market. Needs voice mode accuracy, compliance, creative hooks |
| LinkedIn batch (4/week) | Generates 4 posts from weekly brief | ~4 batches/month | **T1 Sonnet** | Same as above, batched |
| Blog/guide generation | Long-form content (2000+ words) | ~4-8/month | **T1 Sonnet** | Highest-stakes content. Needs authority, structure, SEO awareness |
| Email sequence generation | Individual email copy within a sequence | ~6-12/month | **T1 Sonnet** | Goes to real inboxes. Needs voice accuracy and CTA precision |
| Video script generation | Generates scripts from topic + format | ~2-4/month | **T1 Sonnet** | Represents brand on video. Needs tone control |
| Instagram caption | Short caption for Instagram post | ~4-8/month | **T2 Haiku** | Short format, constrained template, lower stakes than LinkedIn |
| Carousel slide content | Generates 5-8 slide text for carousels | ~4-8/month | **T2 Haiku** | Structured output, template-driven, each slide is 1-2 sentences |
| YouTube thumbnail text | Generates overlay text options | ~2-4/month | **T2 Haiku** | 3-5 word phrases. Haiku is fine |
| Content research/analysis | Analyzes pasted URL or content for gaps | ~10-20/month | **T2 Haiku** | Analytical, not generative. Summarization task |
| Competitive research | Analyzes scraped competitor page | ~4-8/month | **T4 Gemini Flash** | Extraction + summarization from scraped HTML. Bulk, low stakes |
| "Expand section" / "Rewrite paragraph" | Inline editing assists | ~20-40/month | **T2 Haiku** | Small, fast edits. User will review immediately |
| Content topic suggestions | "What should I write about this week?" | ~4/month | **T2 Haiku** | Idea generation from existing data. Doesn't go to market |

### SEO Specialist

| Call | What It Does | Volume | Tier | Rationale |
|---|---|---|---|---|
| Programmatic page generation | Full 2000-word page from template + sector/country | ~62 pages total, then ~5/month updates | **T1 Sonnet** | Goes live on website. Needs unique content >40%, SEO structure, authority |
| Per-section AI generation | "Generate Market Context for SaaS/Singapore" | ~50-100/month during build | **T2 Haiku** | Single section (~300 words), template-constrained, user reviews before publish |
| Weekly SEO recommendations | Analyzes GSC data → 5-10 action items | ~4/month | **T2 Haiku** | Internal recommendations, not published. Analytical task |
| AI readability audit | Scores pages for AI extractability | ~10-20/month | **T4 Gemini Flash** | HTML analysis, structural checks. Pattern matching, not creative |
| AI citation checking | Queries AI platforms for Capital8 mentions | N/A | **T3 None** | Uses Playwright MCP to query, then regex/string match for mentions. No LLM needed |
| Meta description generation | Generates meta titles + descriptions for pages | ~62 initial + ongoing | **T2 Haiku** | Short, formulaic, SEO-constrained. Haiku handles this perfectly |
| Keyword clustering | Groups keywords by intent/topic | ~4/month | **T4 Gemini Flash** | Classification task. High volume, low complexity |
| Schema markup generation | Generates JSON-LD for pages | ~62 initial | **T3 None** | Template-based. Fill in variables. No LLM needed |

### Autonomous Engine (Inngest Jobs)

| Call | What It Does | Volume | Tier | Rationale |
|---|---|---|---|---|
| Overnight content batch | Pre-generates next week's content drafts | ~4/month | **T1 Sonnet** | These become real content after approval. Needs full quality |
| SEO recommendation generation | Weekly SEO analysis | ~4/month | **T2 Haiku** | Internal analysis, not published |
| Email sequence trigger evaluation | Checks which contacts should receive which email | N/A | **T3 None** | Rule-based: score band + days since last email. No LLM |
| Content calendar planning | Suggests next week's content mix | ~4/month | **T2 Haiku** | Planning/analytical. Internal only |
| Metric summary generation | Turns raw metrics into natural language dashboard summary | ~30/month | **T2 Haiku** | Short summaries. "ExitFit completions up 23% week-over-week" |
| Compliance sweep | Scans all draft content for violations | ~30/month | **T3 None** | Regex + string matching. The compliance checker is deterministic |
| Skill evolution analysis | Analyzes performance data → skill recommendations | ~4/month | **T1 Sonnet** | Needs to understand skill content deeply, reason about cause/effect, propose specific text changes |
| Data freshness checks | Verifies integration connections are live | ~30/month | **T3 None** | API health checks. No LLM |

### Skill Evolution Engine

| Call | What It Does | Volume | Tier | Rationale |
|---|---|---|---|---|
| Performance analysis | Reads 4 weeks of metrics, identifies patterns | ~4/month | **T2 Haiku** | Data analysis. Summarize trends, flag anomalies |
| Recommendation generation | Proposes specific skill text changes with rationale | ~4/month | **T1 Sonnet** | Needs to read full skill content, understand brand voice, propose precise edits |
| Override impact prediction | Estimates effect of a proposed skill change | ~8/month | **T2 Haiku** | Analytical reasoning from historical data |

---

## Cost Projection

### Monthly Volume Estimate (steady state, not initial build)

| Tier | Calls/Month | Avg Tokens (in+out) | Cost/Call | Monthly Cost |
|---|---|---|---|---|
| **T1 Sonnet** | ~50 | ~6,000 in + 2,000 out | ~$0.048 | ~$2.40 |
| **T2 Haiku** | ~120 | ~4,000 in + 1,000 out | ~$0.007 | ~$0.84 |
| **T3 None** | ~100 | 0 | $0 | $0 |
| **T4 Gemini Flash** | ~30 | ~8,000 in + 1,000 out | ~$0.001 | ~$0.03 |
| **TOTAL** | ~300 | | | **~$3.27/month** |

During initial build (62 programmatic pages + backlog content):

| Phase | Extra Calls | Model | Est. Cost |
|---|---|---|---|
| Programmatic page generation (62 pages) | 62 | T1 Sonnet | ~$3.00 |
| Per-section generation during build | ~200 | T2 Haiku | ~$1.40 |
| Meta descriptions (62 pages) | 62 | T2 Haiku | ~$0.43 |
| **Build burst total** | | | **~$4.83 one-time** |

**Revised daily cap: $10/day** (down from $25 in the hardening doc — the model routing makes $25 unnecessary)
**Revised monthly cap: $150/month** (down from $500 — generous buffer over ~$3.27 steady state for growth + experiments)
**Per-call cap: $0.50** (down from $2.00 — Sonnet calls max out around $0.10 with our token budgets)

---

## Implementation

### Model Registry

```typescript
// lib/ai/models.ts

export type ModelTier = 'T1_FLAGSHIP' | 'T2_FAST' | 'T3_DETERMINISTIC' | 'T4_EXTERNAL';

export const MODEL_CONFIG = {
  T1_FLAGSHIP: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4096,
    costPer1MInput: 3.00,
    costPer1MOutput: 15.00,
  },
  T2_FAST: {
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    maxTokens: 4096,
    costPer1MInput: 0.80,
    costPer1MOutput: 4.00,
  },
  T3_DETERMINISTIC: {
    provider: 'none',
    model: null,
    maxTokens: 0,
    costPer1MInput: 0,
    costPer1MOutput: 0,
  },
  T4_EXTERNAL: {
    provider: 'google',
    model: 'gemini-2.0-flash',
    maxTokens: 4096,
    costPer1MInput: 0.10,
    costPer1MOutput: 0.40,
  },
} as const;

// Task-to-model mapping
export const TASK_MODEL_MAP: Record<string, ModelTier> = {
  // T1 — Goes to market or needs deep reasoning
  'content.linkedin.generate': 'T1_FLAGSHIP',
  'content.linkedin.batch': 'T1_FLAGSHIP',
  'content.blog.generate': 'T1_FLAGSHIP',
  'content.email.generate': 'T1_FLAGSHIP',
  'content.video.generate': 'T1_FLAGSHIP',
  'seo.programmatic.generate': 'T1_FLAGSHIP',
  'content.overnight.batch': 'T1_FLAGSHIP',
  'skills.recommendation.generate': 'T1_FLAGSHIP',

  // T2 — Internal analysis, short-form, template-driven
  'content.instagram.caption': 'T2_FAST',
  'content.carousel.slides': 'T2_FAST',
  'content.youtube.thumbnail_text': 'T2_FAST',
  'content.research.analyze': 'T2_FAST',
  'content.edit.expand': 'T2_FAST',
  'content.edit.rewrite': 'T2_FAST',
  'content.topics.suggest': 'T2_FAST',
  'seo.section.generate': 'T2_FAST',
  'seo.recommendations.weekly': 'T2_FAST',
  'seo.meta.generate': 'T2_FAST',
  'dashboard.metric.summarize': 'T2_FAST',
  'content.calendar.plan': 'T2_FAST',
  'skills.performance.analyze': 'T2_FAST',
  'skills.impact.predict': 'T2_FAST',

  // T3 — No LLM needed
  'compliance.check': 'T3_DETERMINISTIC',
  'seo.citation.check': 'T3_DETERMINISTIC',
  'seo.schema.generate': 'T3_DETERMINISTIC',
  'email.trigger.evaluate': 'T3_DETERMINISTIC',
  'data.freshness.check': 'T3_DETERMINISTIC',

  // T4 — Bulk extraction, low stakes
  'content.competitive.research': 'T4_EXTERNAL',
  'seo.readability.audit': 'T4_EXTERNAL',
  'seo.keywords.cluster': 'T4_EXTERNAL',
};
```

### Unified AI Caller

```typescript
// lib/ai/caller.ts

import { MODEL_CONFIG, TASK_MODEL_MAP, ModelTier } from './models';
import { checkCostBudget, trackUsage } from './cost-tracker';

export async function callAI(
  task: string,
  systemPrompt: string,
  userMessage: string,
  options?: { tierOverride?: ModelTier; maxTokens?: number }
): Promise<AIResponse> {
  const tier = options?.tierOverride || TASK_MODEL_MAP[task];

  if (!tier) throw new Error(`No model mapping for task: ${task}`);

  // T3: deterministic, no LLM call
  if (tier === 'T3_DETERMINISTIC') {
    throw new Error(`Task ${task} is deterministic — use the dedicated function, not callAI`);
  }

  const config = MODEL_CONFIG[tier];

  // Cost budget check (applies to all LLM calls)
  const budget = await checkCostBudget();
  if (!budget.allowed) {
    throw new ApiError('BUDGET_EXHAUSTED', `Daily AI budget reached. Remaining: $${budget.remaining.toFixed(2)}`);
  }

  if (config.provider === 'anthropic') {
    return callAnthropic(config, systemPrompt, userMessage, task, options?.maxTokens);
  }

  if (config.provider === 'google') {
    return callGemini(config, systemPrompt, userMessage, task, options?.maxTokens);
  }

  throw new Error(`Unknown provider: ${config.provider}`);
}

async function callAnthropic(config, systemPrompt, userMessage, task, maxTokens) {
  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: maxTokens || config.maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  await trackUsage({
    task,
    provider: 'anthropic',
    model: config.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    costUsd: calculateCost(response.usage, config),
  });

  return parseResponse(response);
}

async function callGemini(config, systemPrompt, userMessage, task, maxTokens) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: maxTokens || config.maxTokens },
      }),
    }
  );

  const data = await response.json();

  await trackUsage({
    task,
    provider: 'google',
    model: config.model,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    costUsd: calculateCost(data.usageMetadata, config),
  });

  return parseGeminiResponse(data);
}
```

### Admin Model Override

In Settings > AI Models, the admin can:

```
┌─────────────────────────────────────────────────────────┐
│  AI Model Configuration                                  │
│─────────────────────────────────────────────────────────│
│                                                          │
│  Task                        Model          Override     │
│  ──────────────────────────────────────────────────────  │
│  LinkedIn post generation    Sonnet 4       [Default ▼]  │
│  Blog generation             Sonnet 4       [Default ▼]  │
│  Email generation            Sonnet 4       [Default ▼]  │
│  Content research            Haiku 3.5      [Default ▼]  │
│  Competitive research        Gemini Flash   [Default ▼]  │
│  SEO recommendations         Haiku 3.5      [Default ▼]  │
│  ...                                                     │
│                                                          │
│  Override options per task:                               │
│  • Default (recommended)                                 │
│  • Upgrade to Sonnet (higher quality, higher cost)       │
│  • Downgrade to Haiku (lower cost, may reduce quality)   │
│  • Use Gemini Flash (lowest cost, external provider)     │
│                                                          │
│  ──────────────────────────────────────────────────────  │
│  Cost This Month: $2.84 / $150.00 cap                    │
│  Calls This Month: 247                                   │
│  [View usage breakdown →]                                │
└──────────────────────────────────────────────────────────┘
```

---

## Upgrade Path

If a specific task consistently underperforms:

1. Admin sees low approval rate or high edit rate for that content type in the dashboard
2. Goes to Settings > AI Models
3. Upgrades that single task from Haiku → Sonnet or Sonnet → Opus
4. Cost impact shown immediately: "This will increase estimated monthly cost by $X.XX"
5. No code change needed — just a database row update

If Claude releases a cheaper model (e.g., Haiku 4) or a better Sonnet:
1. Update `MODEL_CONFIG` with new model name and pricing
2. All tasks automatically use the new model
3. No task mapping changes needed

---

## Environment Variables

```bash
# .env.local (add to existing)
ANTHROPIC_API_KEY=sk-ant-...          # Already planned
GEMINI_API_KEY=AIza...                # NEW — for T4 calls
AI_DAILY_COST_CAP=10.00              # Revised down from 25
AI_MONTHLY_COST_CAP=150.00           # Revised down from 500
AI_PER_CALL_CAP=0.50                 # Revised down from 2
```

---

## Database Schema Addition

```sql
-- AI usage tracking (replaces claude_api_usage from hardening doc)
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  task TEXT NOT NULL,                  -- e.g. 'content.linkedin.generate'
  provider TEXT NOT NULL,              -- 'anthropic', 'google', 'none'
  model TEXT NOT NULL,                 -- 'claude-sonnet-4-...', 'gemini-2.0-flash'
  tier TEXT NOT NULL,                  -- 'T1_FLAGSHIP', 'T2_FAST', etc.
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC NOT NULL DEFAULT 0,
  latency_ms INTEGER,                 -- response time for performance tracking
  job_name TEXT,                       -- null for interactive, job name for autonomous
  user_id UUID REFERENCES auth.users(id),
  content_item_id UUID,               -- links to content that was generated
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

CREATE INDEX idx_ai_usage_date ON ai_usage(created_at DESC);
CREATE INDEX idx_ai_usage_task ON ai_usage(task, created_at DESC);
CREATE INDEX idx_ai_usage_cost ON ai_usage(cost_usd DESC) WHERE cost_usd > 0;

-- Model override config (admin-adjustable)
CREATE TABLE ai_model_overrides (
  task TEXT PRIMARY KEY,
  tier_override TEXT NOT NULL CHECK (tier_override IN ('T1_FLAGSHIP', 'T2_FAST', 'T4_EXTERNAL')),
  reason TEXT,
  set_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Summary

| Before | After |
|---|---|
| Every call uses Claude API (Sonnet assumed) | 4 tiers: Sonnet, Haiku, deterministic, Gemini Flash |
| ~$25/day budget | ~$10/day budget (with room to spare) |
| ~$500/month cap | ~$150/month cap |
| ~$3.27/month steady state (all Sonnet pricing) | ~$3.27/month steady state (with routing, likely ~$1.50) |
| No visibility into which calls cost what | Full per-task usage tracking with cost breakdown |
| Model changes require code changes | Admin UI toggle per task |
| Single provider lock-in | Multi-provider (Anthropic + Google), extensible to OpenAI/Mistral |
