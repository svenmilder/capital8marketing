# Capital8 Marketing Engine — Database Integration Design

> **Purpose:** Define how the Capital8 marketing engine reads from the operational database so all content, CRO, and distribution work is grounded in real deal data — not generic theory.
>
> **Principle:** Marketing agents should never generate content in a vacuum. Every post, every CTA, every conversion test should have a real data anchor. This file is the bridge between the database and the marketing stack.

---

## 1. Database Schema Reference

These are the five source tables the marketing engine reads from. All are **read-only**. The engine never writes to the operational database.

---

### Table: `exitfit_completions`
Captures every completed ExitFit Diagnostic submission.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `completed_at` | TIMESTAMP | Completion datetime |
| `score` | INTEGER | 0–100 exit readiness score |
| `score_band` | VARCHAR | `red` / `amber` / `green` |
| `sector` | VARCHAR | e.g. manufacturing, SaaS, distribution, professional services |
| `country` | VARCHAR | ISO country code |
| `revenue_range` | VARCHAR | e.g. `2M-5M`, `5M-10M`, `10M-30M` |
| `ebitda_range` | VARCHAR | e.g. `500K-1M`, `1M-3M`, `3M-5M` |
| `converted_to_sprint` | BOOLEAN | Did this lead progress to Sprint? |
| `days_to_sprint` | INTEGER | NULL if not converted |
| `source` | VARCHAR | `linkedin`, `organic`, `referral`, `paid`, `direct` |
| `utm_campaign` | VARCHAR | Campaign tag if applicable |

---

### Table: `sprint_engagements`
Tracks Sprint sessions (paid diagnostic + advisory engagement).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `exitfit_id` | UUID | FK to exitfit_completions (nullable — some Sprints are direct) |
| `started_at` | TIMESTAMP | |
| `sector` | VARCHAR | |
| `country` | VARCHAR | |
| `deal_size_range` | VARCHAR | Estimated deal value range |
| `outcome` | VARCHAR | `mandate_signed` / `not_ready` / `referred_out` / `no_decision` |
| `days_to_outcome` | INTEGER | |
| `score_at_entry` | INTEGER | ExitFit score when Sprint began |

---

### Table: `active_mandates`
Current live advisory mandates. Anonymised for agent use.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | |
| `sector` | VARCHAR | |
| `country` | VARCHAR | |
| `revenue_range` | VARCHAR | |
| `ebitda_range` | VARCHAR | |
| `deal_size_target` | VARCHAR | Estimated exit value range |
| `stage` | VARCHAR | `prep` / `positioning` / `market` / `loi` / `due_diligence` / `close` |
| `mandate_start` | DATE | |
| `days_in_stage` | INTEGER | Days in current stage |
| `buyer_interest_count` | INTEGER | Number of buyers engaged |

---

### Table: `closed_deals`
Completed exits. Core content fuel for social proof and case study posts.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | |
| `closed_at` | DATE | |
| `sector` | VARCHAR | |
| `country` | VARCHAR | |
| `deal_size` | NUMERIC | Actual close value in USD |
| `revenue_at_close` | NUMERIC | |
| `ebitda_at_close` | NUMERIC | |
| `ebitda_multiple` | NUMERIC | Deal size / EBITDA — key proof point |
| `asking_price` | NUMERIC | Founder's initial expectation |
| `outcome_vs_asking` | NUMERIC | `deal_size / asking_price` — e.g. 1.23 = 23% above asking |
| `time_to_close_days` | INTEGER | Days from mandate to close |
| `competing_iois` | INTEGER | Number of competing indications of interest |
| `buyer_type` | VARCHAR | `strategic` / `financial` / `pe` / `family_office` / `operator` |
| `deal_structure` | VARCHAR | `full_cash` / `earnout` / `seller_finance` / `rollover` / `hybrid` |
| `off_market` | BOOLEAN | Was this positioned off-market? |
| `referral_source` | VARCHAR | `linkedin` / `dealmaker_network` / `direct` / `paid` / `organic` |

---

### Table: `dealmaker_network`
Members of the Capital8 Dealmaker Network.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | |
| `joined_at` | DATE | |
| `track` | VARCHAR | `dealmaker` / `connector` / `advisor` |
| `country` | VARCHAR | |
| `sector_focus` | VARCHAR | |
| `active` | BOOLEAN | Engaged in last 90 days |
| `referrals_submitted` | INTEGER | Total referrals submitted |
| `referrals_qualified` | INTEGER | Referrals that reached Sprint |
| `referrals_closed` | INTEGER | Referrals that became closed deals |
| `last_activity_at` | DATE | |
| `commission_earned` | NUMERIC | USD — anonymised in agent context |

---

## 2. Session-Start Query Set

The marketing engine pulls this data bundle **at the start of every session** when a live DB connection is available. When no connection exists, the agent reads `.agents/db-snapshot.md` instead (see Section 4).

These are the four queries that run on session init:

---

### Query S1: Recent Closed Deals (Content Fuel)
```sql
SELECT
  sector,
  country,
  deal_size,
  ebitda_multiple,
  ROUND(outcome_vs_asking * 100 - 100, 1) AS pct_above_asking,
  time_to_close_days,
  competing_iois,
  buyer_type,
  deal_structure,
  off_market,
  closed_at
FROM closed_deals
WHERE closed_at >= NOW() - INTERVAL '90 days'
ORDER BY closed_at DESC
LIMIT 5;
```
**Feeds:** `social-content-capital8` — gives specific deal data for ADVISOR and PEER posts so content references real recent outcomes, not abstract claims.

---

### Query S2: Funnel Conversion Rates (Conversion Health)
```sql
SELECT
  DATE_TRUNC('month', ec.completed_at) AS month,
  COUNT(ec.id)                          AS diagnostics_completed,
  SUM(CASE WHEN ec.converted_to_sprint THEN 1 ELSE 0 END) AS converted_to_sprint,
  ROUND(
    100.0 * SUM(CASE WHEN ec.converted_to_sprint THEN 1 ELSE 0 END) / COUNT(ec.id), 1
  ) AS diagnostic_to_sprint_pct,
  COUNT(se.id)                          AS sprints_total,
  SUM(CASE WHEN se.outcome = 'mandate_signed' THEN 1 ELSE 0 END) AS sprints_to_mandate,
  ROUND(
    100.0 * SUM(CASE WHEN se.outcome = 'mandate_signed' THEN 1 ELSE 0 END)
    / NULLIF(COUNT(se.id), 0), 1
  ) AS sprint_to_mandate_pct
FROM exitfit_completions ec
LEFT JOIN sprint_engagements se ON se.exitfit_id = ec.id
WHERE ec.completed_at >= NOW() - INTERVAL '3 months'
GROUP BY 1
ORDER BY 1 DESC;
```
**Feeds:** `analytics-tracking`, `signup-flow-cro` — surfaces where the funnel is leaking so CRO work targets the actual drop-off point.

---

### Query S3: Dealmaker Network Activity Pulse
```sql
SELECT
  track,
  COUNT(*) AS total_members,
  SUM(CASE WHEN active THEN 1 ELSE 0 END) AS active_members,
  ROUND(100.0 * SUM(CASE WHEN active THEN 1 ELSE 0 END) / COUNT(*), 1) AS active_pct,
  SUM(referrals_submitted) AS referrals_submitted,
  SUM(referrals_qualified) AS referrals_qualified,
  SUM(referrals_closed) AS referrals_closed,
  ROUND(
    100.0 * SUM(referrals_qualified) / NULLIF(SUM(referrals_submitted), 0), 1
  ) AS submit_to_qualified_pct
FROM dealmaker_network
GROUP BY track
ORDER BY referrals_closed DESC;
```
**Feeds:** `referral-program`, `revops` — shows which tracks are generating real deal flow vs. which are dormant.

---

### Query S4: Active Pipeline Snapshot
```sql
SELECT
  stage,
  COUNT(*) AS mandates_in_stage,
  AVG(days_in_stage) AS avg_days_in_stage,
  MAX(days_in_stage) AS max_days_in_stage,
  AVG(buyer_interest_count) AS avg_buyers_engaged
FROM active_mandates
GROUP BY stage
ORDER BY
  CASE stage
    WHEN 'prep' THEN 1
    WHEN 'positioning' THEN 2
    WHEN 'market' THEN 3
    WHEN 'loi' THEN 4
    WHEN 'due_diligence' THEN 5
    WHEN 'close' THEN 6
  END;
```
**Feeds:** `marketing-orchestrator` — gives the orchestrator a live view of pipeline health so content priorities align with where deals are in the funnel.

---

## 3. Ten Skill-Specific Queries

Each query below feeds a specific marketing skill. Run these on demand, not at session start.

---

### Query 1 — Social Content Input: Last 5 Closed Deals
*For: `social-content-capital8`*
```sql
SELECT
  sector,
  country,
  ROUND(deal_size / 1000000.0, 1)              AS deal_size_m,
  ROUND(ebitda_multiple, 1)                    AS ebitda_multiple,
  ROUND(outcome_vs_asking * 100 - 100, 1)      AS pct_above_asking,
  time_to_close_days,
  competing_iois,
  buyer_type,
  deal_structure,
  off_market,
  closed_at::DATE
FROM closed_deals
ORDER BY closed_at DESC
LIMIT 5;
```
**How to use it:** Feed output directly to social-content-capital8 with the prompt "Use these deal outcomes as the factual anchor for this week's ADVISOR post." The agent should pick the most striking data point (largest multiple, highest % above asking, most competing IOIs) as the proof element.

---

### Query 2 — Diagnostic Completion-to-Sprint Conversion Rate This Month
*For: `signup-flow-cro`, `form-cro`*
```sql
SELECT
  COUNT(*)                                                    AS completions,
  SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END)       AS converted,
  ROUND(
    100.0 * SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END) / COUNT(*), 1
  )                                                           AS conversion_rate_pct,
  AVG(days_to_sprint)                                         AS avg_days_to_convert,
  source,
  score_band
FROM exitfit_completions
WHERE completed_at >= DATE_TRUNC('month', NOW())
GROUP BY source, score_band
ORDER BY conversion_rate_pct DESC;
```
**How to use it:** If `green` score band has low conversion, the problem is follow-up or CTA messaging — not the diagnostic itself. If `amber` converts better than `green`, your post-completion nurture is working but your high-readiness path needs work.

---

### Query 3 — Dealmaker Referral Activity by Track
*For: `referral-program`, `cold-email`*
```sql
SELECT
  track,
  country,
  sector_focus,
  referrals_submitted,
  referrals_qualified,
  referrals_closed,
  ROUND(100.0 * referrals_closed / NULLIF(referrals_submitted, 0), 1) AS close_rate_pct,
  last_activity_at,
  CASE
    WHEN last_activity_at >= NOW() - INTERVAL '30 days' THEN 'hot'
    WHEN last_activity_at >= NOW() - INTERVAL '90 days' THEN 'warm'
    ELSE 'cold'
  END AS activity_status
FROM dealmaker_network
WHERE referrals_submitted > 0
ORDER BY referrals_closed DESC, last_activity_at DESC
LIMIT 20;
```
**How to use it:** Feed to `referral-program` skill to identify which network segments deserve re-engagement campaigns. Cold members with high historical close rates are a re-activation priority. Warm members with zero closes need qualification — they may be submitting low-quality referrals.

---

### Query 4 — Sector Performance: Deal Multiples and Outcomes
*For: `social-content-capital8`, `content-strategy`, `programmatic-seo`*
```sql
SELECT
  sector,
  COUNT(*)                                   AS deals_closed,
  ROUND(AVG(ebitda_multiple), 1)             AS avg_ebitda_multiple,
  ROUND(MAX(ebitda_multiple), 1)             AS peak_multiple,
  ROUND(AVG(outcome_vs_asking) * 100, 1)     AS avg_outcome_vs_asking_pct,
  ROUND(AVG(time_to_close_days))             AS avg_days_to_close,
  MODE() WITHIN GROUP (ORDER BY buyer_type)  AS most_common_buyer_type,
  SUM(CASE WHEN off_market THEN 1 ELSE 0 END) AS off_market_deals
FROM closed_deals
GROUP BY sector
HAVING COUNT(*) >= 2
ORDER BY avg_ebitda_multiple DESC;
```
**How to use it:** This is your sector authority data. Use it to write sector-specific LinkedIn content ("Manufacturing exits are averaging X.Xx EBITDA — here's why") and to brief `programmatic-seo` on which sectors warrant dedicated landing pages.

---

### Query 5 — ExitFit Score Distribution and Quality Signal
*For: `analytics-tracking`, `onboarding-cro`*
```sql
SELECT
  score_band,
  sector,
  COUNT(*)                    AS completions,
  ROUND(AVG(score), 1)        AS avg_score,
  MIN(score)                  AS min_score,
  MAX(score)                  AS max_score,
  SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END) AS sprint_conversions,
  ROUND(
    100.0 * SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END) / COUNT(*), 1
  )                           AS conversion_pct,
  source
FROM exitfit_completions
WHERE completed_at >= NOW() - INTERVAL '6 months'
GROUP BY score_band, sector, source
ORDER BY score_band, conversion_pct DESC;
```
**How to use it:** If certain sectors produce high scores but low conversion, the follow-up sequence for that sector is broken. If LinkedIn-sourced leads have lower scores but higher conversion, your content is attracting the right founders at the wrong stage — good signal for nurture sequence investment.

---

### Query 6 — Buyer Type Breakdown for Content Positioning
*For: `social-content-capital8`, `sales-enablement`*
```sql
SELECT
  buyer_type,
  COUNT(*)                                  AS deals,
  ROUND(AVG(ebitda_multiple), 2)            AS avg_multiple,
  ROUND(AVG(outcome_vs_asking) * 100, 1)   AS avg_vs_asking_pct,
  ROUND(AVG(time_to_close_days))            AS avg_days,
  MODE() WITHIN GROUP (ORDER BY deal_structure) AS most_common_structure,
  SUM(CASE WHEN off_market THEN 1 ELSE 0 END) AS off_market_count
FROM closed_deals
GROUP BY buyer_type
ORDER BY avg_multiple DESC;
```
**How to use it:** This is founder psychology fuel. If PE buyers pay higher multiples but take longer to close, that's a post: "Why the highest offer isn't always the right offer." If strategic buyers close fastest, that's a different post. These buyer dynamics make for the most credible PEER-voice content.

---

### Query 7 — Monthly Funnel Health (Full Waterfall)
*For: `analytics-tracking`, `marketing-orchestrator`*
```sql
WITH monthly AS (
  SELECT
    DATE_TRUNC('month', completed_at) AS month,
    COUNT(*)                           AS diagnostics,
    SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END) AS to_sprint
  FROM exitfit_completions
  GROUP BY 1
),
mandates AS (
  SELECT
    DATE_TRUNC('month', mandate_start) AS month,
    COUNT(*) AS new_mandates
  FROM active_mandates
  GROUP BY 1
),
closes AS (
  SELECT
    DATE_TRUNC('month', closed_at) AS month,
    COUNT(*)    AS closed,
    SUM(deal_size) AS revenue_closed
  FROM closed_deals
  GROUP BY 1
)
SELECT
  m.month,
  m.diagnostics,
  m.to_sprint,
  ROUND(100.0 * m.to_sprint / NULLIF(m.diagnostics, 0), 1) AS d_to_s_pct,
  mn.new_mandates,
  c.closed,
  ROUND(c.revenue_closed / 1000000.0, 1) AS revenue_closed_m
FROM monthly m
LEFT JOIN mandates mn ON mn.month = m.month
LEFT JOIN closes c ON c.month = m.month
ORDER BY m.month DESC
LIMIT 6;
```
**How to use it:** This is the single most important query for orchestration decisions. If diagnostics are up but sprint conversions are flat, the problem is post-diagnostic follow-up. If sprints are up but mandates are flat, Sprint quality or pricing is the issue. These diagnostics directly determine which skill chain to run.

---

### Query 8 — Creative Deal Structures (Content Differentiation Fuel)
*For: `social-content-capital8`, `copywriting`*
```sql
SELECT
  deal_structure,
  COUNT(*)                                 AS deals,
  ROUND(AVG(ebitda_multiple), 2)           AS avg_multiple,
  ROUND(AVG(outcome_vs_asking) * 100, 1)  AS avg_vs_asking_pct,
  ROUND(AVG(time_to_close_days))           AS avg_days,
  SUM(CASE WHEN off_market THEN 1 ELSE 0 END) AS off_market_count,
  sector
FROM closed_deals
GROUP BY deal_structure, sector
ORDER BY avg_multiple DESC;
```
**How to use it:** Capital8's deal structure differentiation is a core content angle. "Why the founder who took a hybrid earnout walked away with 31% more than the cash offer" is a post that only works if you have the data. This query surfaces those stories.

---

### Query 9 — Geographic Expansion Signals
*For: `launch-strategy`, `programmatic-seo`, `cold-email`*
```sql
SELECT
  country,
  COUNT(ec.id)     AS diagnostics_completed,
  COUNT(se.id)     AS sprints,
  COUNT(cd.id)     AS deals_closed,
  ROUND(AVG(cd.deal_size) / 1000000.0, 1) AS avg_deal_size_m,
  ROUND(
    100.0 * COUNT(se.id) / NULLIF(COUNT(ec.id), 0), 1
  )                AS diagnostic_to_sprint_pct
FROM exitfit_completions ec
LEFT JOIN sprint_engagements se ON se.exitfit_id = ec.id
LEFT JOIN closed_deals cd ON cd.country = ec.country
  AND cd.closed_at >= NOW() - INTERVAL '12 months'
GROUP BY country
ORDER BY diagnostics_completed DESC;
```
**How to use it:** Countries with high diagnostic completions but zero closed deals represent a broken funnel or unqualified traffic. Countries with high deal close rates but low diagnostic volume are underserved markets worth targeting with `launch-strategy`. This grounds geographic expansion decisions in actual demand signals — not assumptions.

---

### Query 10 — LinkedIn Content Performance Attribution
*For: `social-content-capital8`, `analytics-tracking`*
```sql
SELECT
  utm_campaign,
  source,
  COUNT(*)                                                   AS completions,
  ROUND(AVG(score), 1)                                       AS avg_score,
  SUM(CASE WHEN score_band = 'green' THEN 1 ELSE 0 END)     AS green_scores,
  SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END)      AS sprint_conversions,
  ROUND(
    100.0 * SUM(CASE WHEN converted_to_sprint THEN 1 ELSE 0 END) / COUNT(*), 1
  )                                                          AS conversion_rate_pct,
  revenue_range
FROM exitfit_completions
WHERE source = 'linkedin'
  AND completed_at >= NOW() - INTERVAL '3 months'
GROUP BY utm_campaign, source, revenue_range
ORDER BY sprint_conversions DESC;
```
**How to use it:** This closes the loop between LinkedIn content and actual pipeline. If posts tagged `utm_campaign=advisor-posts` convert at 2x the rate of `sales-posts`, that's a signal to shift the content mix. Tie UTM tags to specific post themes in your content calendar so you can run this query after 30 days and see what's actually moving the funnel.

---

## 4. The db-snapshot-template.md

When there is **no live database connection**, the agent reads `.agents/db-snapshot.md` instead. This is a manually-pasted snapshot of current database state, formatted so the agent treats it identically to a live query result.

**How it works:**
1. Run the four session-start queries (S1-S4) against your database
2. Paste the results into `.agents/db-snapshot.md` using the template below
3. At the start of each session, the agent checks for a live connection first — if none, reads the snapshot
4. The snapshot is dated so the agent knows how fresh the data is

See `.agents/db-snapshot-template.md` for the fill-in format.

---

## 5. Routing: How Skills Use Database Output

The marketing engine routes database output to skills as follows:

| Query | Primary Skill | Secondary Skill | Trigger |
|-------|--------------|-----------------|---------|
| S1 Recent closed deals | `social-content-capital8` | `copywriting` | Every content session |
| S2 Funnel conversion | `analytics-tracking` | `signup-flow-cro` | Weekly review |
| S3 Dealmaker activity | `referral-program` | `revops` | Monthly review |
| S4 Active pipeline | `marketing-orchestrator` | — | Every session |
| Q1 Last 5 deals | `social-content-capital8` | — | Content requests |
| Q2 Diagnostic conversion | `signup-flow-cro` | `form-cro` | CRO work |
| Q3 Referral by track | `referral-program` | `cold-email` | Network growth work |
| Q4 Sector performance | `content-strategy` | `programmatic-seo` | Strategy sessions |
| Q5 Score distribution | `analytics-tracking` | `onboarding-cro` | Funnel diagnosis |
| Q6 Buyer type breakdown | `social-content-capital8` | `sales-enablement` | PEER post input |
| Q7 Monthly funnel | `marketing-orchestrator` | `analytics-tracking` | Orchestration start |
| Q8 Deal structures | `social-content-capital8` | `copywriting` | Differentiation posts |
| Q9 Geographic signals | `launch-strategy` | `programmatic-seo` | Market entry planning |
| Q10 LinkedIn attribution | `social-content-capital8` | `analytics-tracking` | Content performance review |

---

## 6. Implementation Notes

**Privacy:** All queries operate on anonymised data. No founder names, company names, or personally identifiable information is exposed to marketing agents. The `id` fields are UUIDs — they cannot be reverse-engineered.

**Connection:** When integrating with a live database, use a read-only database role with SELECT permissions only on these five tables. No INSERT, UPDATE, DELETE, or schema access.

**Refresh cadence:**
- Session-start queries (S1-S4): run at every agent session start
- Skill-specific queries (Q1-Q10): run on demand when the relevant skill is invoked
- db-snapshot.md: update weekly, or after any significant deal close

**UTM discipline:** Query 10 only works if LinkedIn posts are tagged with UTM parameters. Every post that includes a link to `capital8.io/dealready` should append `?utm_source=linkedin&utm_campaign=[post-type]` — e.g. `utm_campaign=advisor-post`, `utm_campaign=peer-insight`, `utm_campaign=sales-methodology`. This creates a closed feedback loop between content production and pipeline conversion.
