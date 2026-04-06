# Capital8 Database Snapshot
> **Instructions:** Fill in each section below by running the corresponding query from `.agents/database-integration-design.md`. Paste results as a markdown table or plain values. When no live DB connection is available, the marketing agent reads this file as the source of truth for all data-grounded work.
>
> **Last updated:** [YYYY-MM-DD]
> **Updated by:** [name]
> **Data freshness warning:** If this snapshot is more than 14 days old, flag it to the user before generating data-anchored content.

---

## SESSION DATA — Run at Start of Every Session

### S1 · Recent Closed Deals (last 90 days)
*Run Query S1 from database-integration-design.md*

| sector | country | deal_size_m | ebitda_multiple | pct_above_asking | days_to_close | competing_iois | buyer_type | deal_structure | off_market | closed_at |
|--------|---------|-------------|-----------------|------------------|---------------|----------------|------------|----------------|------------|-----------|
| [e.g. manufacturing] | [e.g. AU] | [e.g. 8.4] | [e.g. 5.2x] | [e.g. +18%] | [e.g. 94] | [e.g. 4] | [e.g. strategic] | [e.g. full_cash] | [yes/no] | [date] |
| | | | | | | | | | | |
| | | | | | | | | | | |
| | | | | | | | | | | |
| | | | | | | | | | | |

**Agent instruction:** Use the most compelling data point from this table as the factual anchor in any ADVISOR or PEER voice LinkedIn post this session. Priority order: (1) highest % above asking, (2) highest EBITDA multiple, (3) most competing IOIs, (4) fastest close.

---

### S2 · Funnel Conversion Rates (last 3 months)
*Run Query S2 from database-integration-design.md*

| month | diagnostics_completed | converted_to_sprint | diagnostic_to_sprint_pct | sprints_total | sprints_to_mandate | sprint_to_mandate_pct |
|-------|-----------------------|---------------------|--------------------------|---------------|--------------------|-----------------------|
| [YYYY-MM] | | | [e.g. 12.4%] | | | [e.g. 38.0%] |
| [YYYY-MM] | | | | | | |
| [YYYY-MM] | | | | | | |

**Key metrics to flag:**
- Current diagnostic → sprint rate: `____%`
- MoM change: `+/- ____%`
- Current sprint → mandate rate: `____%`
- Primary drop-off point: `[ ] post-diagnostic  [ ] post-sprint  [ ] both`

**Agent instruction:** If diagnostic → sprint rate is below 10%, flag to user that signup-flow-cro or form-cro work is the highest-leverage priority. If sprint → mandate rate is below 30%, flag sales-enablement as priority.

---

### S3 · Dealmaker Network Activity
*Run Query S3 from database-integration-design.md*

| track | total_members | active_members | active_pct | referrals_submitted | referrals_qualified | referrals_closed | submit_to_qualified_pct |
|-------|---------------|----------------|------------|---------------------|---------------------|------------------|--------------------------|
| dealmaker | | | | | | | |
| connector | | | | | | | |
| advisor | | | | | | | |

**Key signal:** Which track has the highest submit-to-qualified rate? `____________`
**Dormant members (>90 days inactive):** `____` total across all tracks

**Agent instruction:** If active_pct is below 40% for any track, flag referral-program re-engagement as a priority. Surface this to the orchestrator routing decision.

---

### S4 · Active Pipeline Snapshot
*Run Query S4 from database-integration-design.md*

| stage | mandates_in_stage | avg_days_in_stage | max_days_in_stage | avg_buyers_engaged |
|-------|-------------------|-------------------|-------------------|--------------------|
| prep | | | | |
| positioning | | | | |
| market | | | | |
| loi | | | | |
| due_diligence | | | | |
| close | | | | |

**Total active mandates:** `____`
**Mandates stalled (max_days > 2x avg_days):** `____`

**Agent instruction:** Use pipeline volume to calibrate content urgency. If 3+ mandates are in `market` stage, investor-facing SevenX content should increase this week. If `prep` stage is full, deal-readiness and ExitFit Score conversion content is the priority.

---

## ON-DEMAND DATA — Pull When Needed

### Q4 · Sector Performance Summary
*Run Query Q4 when briefing sector-specific content or SEO work*

| sector | deals_closed | avg_ebitda_multiple | peak_multiple | avg_vs_asking_pct | avg_days_to_close | most_common_buyer | off_market_deals |
|--------|-------------|---------------------|---------------|-------------------|-------------------|-------------------|------------------|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

**Top sector by multiple:** `____________`
**Top sector by % above asking:** `____________`

---

### Q6 · Buyer Type Breakdown
*Run Query Q6 when preparing PEER voice posts about buyer psychology*

| buyer_type | deals | avg_multiple | avg_vs_asking_pct | avg_days | most_common_structure | off_market_count |
|------------|-------|--------------|-------------------|----------|-----------------------|------------------|
| strategic | | | | | | |
| financial | | | | | | |
| pe | | | | | | |
| family_office | | | | | | |
| operator | | | | | | |

**Key tension for content:** Which buyer type pays highest multiples? `____________` Which closes fastest? `____________` — This gap is the post.

---

### Q10 · LinkedIn Attribution (last 90 days)
*Run Query Q10 after any content performance review*

| utm_campaign | completions | avg_score | sprint_conversions | conversion_rate_pct | revenue_range |
|--------------|-------------|-----------|--------------------|--------------------|---------------|
| advisor-post | | | | | |
| peer-insight | | | | | |
| sales-methodology | | | | | |
| [other] | | | | | |

**Best converting campaign tag:** `____________` at `_____%`
**Content mix implication:** `[ ] Increase ADVISOR  [ ] Increase PEER  [ ] Increase SALES  [ ] Hold mix`

---

## Summary Flags for This Session

Fill these in after completing the snapshot. The marketing agent reads these flags first.

```
FUNNEL STATUS:     [ ] Healthy  [ ] Leaking at diagnostic  [ ] Leaking at sprint  [ ] Leaking at mandate
CONTENT PRIORITY:  [ ] Seller inbound  [ ] Investor awareness  [ ] Both equal
DEAL DATA ANCHOR:  [paste single most compelling deal stat from S1 here — e.g. "8.4x EBITDA, 18% above asking, manufacturing, AU"]
NETWORK HEALTH:    [ ] Strong  [ ] Re-engagement needed  [ ] Rebuild required
PIPELINE VOLUME:   [ ] Light (<3 active)  [ ] Healthy (3-8 active)  [ ] Full (8+)
CONTENT URGENCY:   [ ] Low  [ ] Normal  [ ] High — [reason if high]
```

---

## Agent Usage Notes

When reading this snapshot, the marketing agent must:

1. **Check freshness first.** If snapshot is >14 days old, warn the user before proceeding with data-grounded work.
2. **Use S1 deal data in every content session.** Never generate LinkedIn posts without a real deal anchor from this file.
3. **Use funnel rates to set priorities.** If diagnostic → sprint is <10%, the first recommendation should be CRO work, not more content.
4. **Surface conflicts.** If the snapshot shows strong pipeline but weak diagnostic conversion, the orchestrator should run `signup-flow-cro` before `social-content-capital8`.
5. **Never invent data.** If a field is blank, do not substitute a generic number. Ask the user to fill it in or note that the content cannot be data-anchored.
