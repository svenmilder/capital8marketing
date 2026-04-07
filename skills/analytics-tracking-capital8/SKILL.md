---
name: analytics-tracking-capital8
description: Capital8's full measurement stack — funnel stages, UTM taxonomy, conversion events, and how to use data to make marketing decisions.
version: 1
---

# Capital8 Analytics and Tracking

## The Capital8 Marketing Funnel (Measurement Architecture)

The funnel has five stages, each with a distinct entry event, success event, and data location.

| Stage | Entry Event | Success Event | Data Location |
|-------|-------------|---------------|---------------|
| Awareness | First LinkedIn impression / ad click / organic visit | — | LinkedIn Analytics / GA4 |
| Interest | ExitFit Diagnostic started | ExitFit Diagnostic completed | exitfit_completions table |
| Consideration | ExitFit Score delivered (any band) | Sprint booked | exitfit_completions.converted_to_sprint |
| Evaluation | Sprint completed | Mandate signed | sprint_engagements.outcome |
| Commitment | Mandate signed | Deal closed | active_mandates → closed_deals |

A founder moves through the funnel sequentially. Awareness precedes Interest. Interest precedes Consideration. But a founder can enter at any stage. Some arrive with an active deal and skip to Evaluation. Others need the full diagnostic. Track both paths separately because they have different conversion rates and timelines.

## UTM Taxonomy

Every link to capital8.io uses this structure: `?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]&utm_content=[content-variant]`

### utm_source Values
Use `linkedin`, `email`, `paid-linkedin`, `paid-google`, `organic`, `referral`, or `direct`. These map to the channel that first brought the founder to Capital8.

### utm_medium Values
Use `post` for organic posts, `newsletter` for email digests, `dm` for direct messages, `cpc` for cost-per-click (Google Ads), or `cpm` for cost-per-thousand-impressions (LinkedIn Sponsored).

### utm_campaign Values
`advisor-post` for ADVISOR voice LinkedIn posts teaching diagnosis. `peer-insight` for PEER voice posts on pattern recognition. `sales-methodology` for SALES voice posts on process. `exitfit-launch` for any campaign promoting ExitFit Score. `sprint-promo` for Sprint-specific campaigns. `dealmaker-network` for Dealmaker Network recruitment. `sevenx-deal-flow` for investor-facing content. `cold-email-[sequence-name]` for outbound sequences. `referral-[network-member-id]` for referral link tracking.

### utm_content
Use for A/B test variants: `hook-a`, `hook-b`, `cta-v1`, `cta-v2`. This captures which copy variant drove the conversion.

## Conversion Events to Track

### Priority 1: Revenue-Critical
Track ExitFit Diagnostic completed with score, sector, country, and source. Track Sprint booked from which source and campaign. Track Mandate signed. These three events directly predict revenue. Obsess over their volume and quality.

### Priority 2: Funnel Health
Track ExitFit Diagnostic started but not completed to measure abandonment rate. Track LinkedIn post to profile visit to ExitFit click to measure the conversion path. Track email open to ExitFit click. These events show where the funnel leaks and where copy or targeting is failing.

### Priority 3: Network Health
Track Dealmaker Network application submitted. Track first referral submitted. Track referral qualified to Sprint. These events show whether the network is active and whether referrals are producing exit-ready founders.

## LinkedIn Analytics: What to Actually Track

Most founders track vanity metrics. For Capital8, only these metrics matter: Comments (not likes). Comments indicate ICP resonance. A post with 3 comments from CTOs asking technical questions outperforms a post with 200 likes from marketers. Profile visits from post. This indicates intent. If a post gets 80 impressions but 12 profile visits, the content resonated. Link clicks to capital8.io/dealready. This is direct funnel attribution. DM inbound tagged "EXIT". This is the highest-intent signal.

Ignore impressions, follower growth, post reactions (likes), and share counts as primary metrics. These are vanity. A post with 500 likes from your existing network tells you nothing about whether it converts founders.

## Monthly Marketing Scorecard

Review these metrics monthly in this order. ExitFit completions (volume and month-over-month change). A 10% MoM decline signals targeting or copy decay. Diagnostic-to-Sprint conversion rate. [FILL IN: Sven to set benchmark.] Sprint-to-Mandate rate. [FILL IN: Sven to set benchmark.] LinkedIn content conversion: which campaigns drove completions using UTM tags. Dealmaker Network: new referrals submitted and qualified rate. Top 3 posts by comment quality. This is subjective—Sven reviews and flags which posts generated founder conversations vs. marketer engagement.

## Attribution Rules

First-touch attribution gives credit to the channel that first brought the founder to capital8.io. Last-touch attribution gives credit to the post or email that drove the ExitFit completion. Both matter. First-touch tells you where awareness comes from. Last-touch tells you what converts. For referrals, attribute to the network member using utm_campaign=referral-[id]. Track both the referring founder and the referred founder's conversion rate. Some network members consistently source exit-ready founders. Others source noise.

## Diagnostic Flags

These triggers indicate something needs fixing and require immediate investigation.

Diagnostic-to-Sprint conversion rate drops below [FILL IN: Sven to set threshold] for 2 consecutive weeks. Run signup-flow conversion-rate optimization. The funnel is leaking. LinkedIn posts averaging fewer than 3 comments per post for 3 consecutive weeks. Review voice mode mix with content-strategy-capital8. The content is not resonating with the target. Green-score founders not converting to Sprint booking. The post-diagnostic email sequence is broken or the Sprint CTA is missing. Referral submissions rising but qualified rate declining. This is a network quality issue, not a volume issue. The network is growing but becoming less selective.

## Query Reference

Use these database queries to populate the monthly scorecard. [FILL IN: Sven to provide exact SQL for each of the 10 core metrics queries. Structure: Query #1 ExitFit completions MoM, Query #2 Diagnostic-to-Sprint rate, etc.]
