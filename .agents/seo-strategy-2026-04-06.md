# Capital8 SEO Strategy — 2026-04-06

**Scope:** Site architecture, programmatic SEO content plan, AI search optimisation plan
**Domain:** capital8.io
**Market:** APAC lower mid-market M&A advisory ($3M-$20M revenue businesses)
**Audiences:** Sellers (founder-operators), Buyers (PE/family offices/strategics), Dealmakers (referral partners)

---

## Part 1: Site Architecture Recommendation

### Current State

The current capital8.io site has ~16 pages with a flat structure:

```
/                       ← Homepage (audience router)
/seller                 ← Seller landing page
/buyers                 ← Buyer landing page
/dealmakers             ← Dealmaker landing page
/dealready              ← Three-way diagnostic chooser
/how-it-works           ← Process overview
/browse                 ← Deal browsing (authenticated)
/mandate-desk           ← Mandate Desk product page
/investor-pricing       ← Buyer/investor pricing tiers
/dealmaker-pricing      ← Dealmaker pricing
/testimonials           ← Social proof
/contact                ← Contact page
/acquirefit             ← Buyer diagnostic
/dealmaker-signup       ← Dealmaker application
/submit-deal            ← Deal submission
/partners               ← Partner page
/auth                   ← Authentication
```

**Problem:** No content layer. Every page is transactional. There is nothing for Google or AI systems to index that answers the questions founders, buyers, and dealmakers are actually searching for. The site converts warm traffic but generates zero organic discovery.

### Recommended Architecture

The architecture adds a content hub layer between the homepage and the transactional pages, organised by audience. The hub uses a pillar-and-cluster model with cross-linking between related clusters.

```
/
├── /seller                              ← Seller landing (transactional)
├── /buyers                              ← Buyer landing (transactional)
├── /dealmakers                          ← Dealmaker landing (transactional)
├── /dealready                           ← Diagnostic chooser
├── /how-it-works                        ← Process overview
├── /browse                              ← Deal browsing
├── /mandate-desk                        ← Mandate Desk product
├── /investor-pricing                    ← Pricing
├── /dealmaker-pricing                   ← Pricing
│
├── /guides/                             ← CONTENT HUB ROOT
│   │
│   ├── /guides/selling-your-business/                    ← PILLAR: Seller hub
│   │   ├── /guides/selling-your-business/exit-planning/  ← Cluster: Exit planning
│   │   ├── /guides/selling-your-business/valuation/      ← Cluster: Valuation
│   │   ├── /guides/selling-your-business/preparation/    ← Cluster: Deal preparation
│   │   ├── /guides/selling-your-business/process/        ← Cluster: M&A process
│   │   └── /guides/selling-your-business/after-the-sale/ ← Cluster: Post-exit
│   │
│   ├── /guides/acquiring-a-business/                     ← PILLAR: Buyer hub
│   │   ├── /guides/acquiring-a-business/due-diligence/   ← Cluster: DD
│   │   ├── /guides/acquiring-a-business/deal-sourcing/   ← Cluster: Sourcing
│   │   ├── /guides/acquiring-a-business/valuation/       ← Cluster: Buyer-side valuation
│   │   └── /guides/acquiring-a-business/integration/     ← Cluster: PMI
│   │
│   ├── /guides/dealmaker-network/                        ← PILLAR: Dealmaker hub
│   │   ├── /guides/dealmaker-network/referral-economics/ ← Cluster: Referral fees
│   │   └── /guides/dealmaker-network/becoming-a-dealmaker/ ← Cluster: How it works
│   │
│   └── /guides/glossary/                                 ← Glossary hub
│       ├── /guides/glossary/ebitda/                      ← Term page
│       ├── /guides/glossary/seller-discretionary-earnings/
│       ├── /guides/glossary/letter-of-intent/
│       └── ... (50-80 terms)
│
├── /exit-planning/                      ← PROGRAMMATIC SEO ROOT
│   ├── /exit-planning/saas/singapore/               ← Sector × Country
│   ├── /exit-planning/saas/malaysia/
│   ├── /exit-planning/saas/indonesia/
│   ├── /exit-planning/saas/australia/
│   ├── /exit-planning/professional-services/singapore/
│   ├── /exit-planning/professional-services/malaysia/
│   ├── /exit-planning/professional-services/australia/
│   ├── /exit-planning/healthcare/singapore/
│   ├── /exit-planning/healthcare/indonesia/
│   ├── /exit-planning/logistics/indonesia/
│   ├── /exit-planning/logistics/malaysia/
│   └── ... (full matrix below)
│
├── /business-valuation/                 ← PROGRAMMATIC SEO: Valuation pages
│   ├── /business-valuation/saas/
│   ├── /business-valuation/professional-services/
│   ├── /business-valuation/healthcare/
│   └── ... (sector-specific)
│
└── /m-and-a-advisory/                   ← PROGRAMMATIC SEO: Location pages
    ├── /m-and-a-advisory/singapore/
    ├── /m-and-a-advisory/kuala-lumpur/
    ├── /m-and-a-advisory/jakarta/
    ├── /m-and-a-advisory/sydney/
    ├── /m-and-a-advisory/melbourne/
    └── /m-and-a-advisory/bangkok/
```

### Navigation Updates

**Primary nav (5 items):**
1. For Sellers → /seller
2. For Buyers → /buyers
3. Dealmakers → /dealmakers
4. Guides → /guides/selling-your-business/ (default to seller pillar, with dropdown showing all pillars)
5. Get Started → /dealready

**Footer (expanded):**
- For Sellers: /seller, /guides/selling-your-business/, /dealready
- For Buyers: /buyers, /guides/acquiring-a-business/, /acquirefit
- Dealmakers: /dealmakers, /guides/dealmaker-network/, /dealmaker-signup
- Resources: Guides, Glossary, How It Works
- Company: Contact, Testimonials, Partners

### Internal Linking Rules

1. Every programmatic page links UP to its cluster parent and ACROSS to 2-3 related programmatic pages
2. Every cluster page links UP to its pillar and DOWN to all programmatic children
3. Every pillar page links to the corresponding transactional page (e.g., seller pillar → /seller with CTA)
4. Glossary terms are auto-linked from all content pages where the term appears
5. Every content page includes a contextual CTA to the relevant diagnostic (ExitFit or AcquireFit)

### Breadcrumb Structure

```
Home > Guides > Selling Your Business > Exit Planning > Exit Planning for SaaS in Singapore
Home > Business Valuation > SaaS Business Valuation
Home > M&A Advisory > M&A Advisory Singapore
```

### Schema Markup

Every content page should include:
- `Article` schema (datePublished, dateModified, author: "Sven Milder", publisher: "Capital8")
- `BreadcrumbList` schema matching visible breadcrumbs
- `FAQPage` schema where the page contains Q&A sections
- `Organization` schema on homepage (name, logo, sameAs for LinkedIn)

Programmatic pages additionally:
- `Service` schema (serviceType: "M&A Advisory", areaServed, provider)

---

## Part 2: Programmatic SEO Content Plan

### The Matrix

Capital8's programmatic SEO is built on three interlocking matrices:

#### Matrix 1: Exit Planning (Sector × Country)

The primary programmatic template. Each page answers: "What does it take to exit a [sector] business in [country]?"

**Sectors (8):**
1. B2B SaaS
2. Tech-enabled services
3. Professional services (consulting, accounting, legal)
4. Digital agencies (marketing, design, dev shops)
5. Healthcare / clinics
6. Logistics / supply chain
7. E-commerce / D2C
8. Education / edtech

**Countries (6):**
1. Singapore
2. Malaysia
3. Indonesia
4. Australia
5. Thailand
6. Vietnam

**Matrix size:** 8 × 6 = 48 pages (not all combinations will have sufficient unique value — start with the 24 highest-volume combinations, expand based on performance)

**Priority 1 (launch with these 12):**

| Sector | Countries |
|---|---|
| B2B SaaS | Singapore, Australia, Malaysia |
| Professional services | Singapore, Malaysia, Australia |
| Healthcare / clinics | Singapore, Indonesia |
| Digital agencies | Singapore, Australia |
| E-commerce / D2C | Indonesia, Singapore |

**Priority 2 (add within 90 days):**

| Sector | Countries |
|---|---|
| Logistics | Indonesia, Malaysia, Thailand |
| Tech-enabled services | Singapore, Australia, Vietnam |
| Education / edtech | Singapore, Indonesia |
| B2B SaaS | Indonesia, Thailand, Vietnam |

#### Matrix 2: Business Valuation (Sector-specific)

Each page answers: "How is a [sector] business valued, and what multiples apply?"

**Pages (8):** One per sector. These are higher-value, lower-volume pages that attract founders actively researching valuation.

- /business-valuation/saas/ — "SaaS Business Valuation: Multiples, Methods & What Buyers Pay"
- /business-valuation/professional-services/ — "Professional Services Firm Valuation"
- /business-valuation/healthcare/ — "Healthcare Business Valuation in APAC"
- etc.

#### Matrix 3: M&A Advisory (Location-specific)

Each page answers: "Who provides M&A advisory services in [city] for businesses in the $3M-$20M range?"

**Pages (6):** One per major city.

- /m-and-a-advisory/singapore/
- /m-and-a-advisory/kuala-lumpur/
- /m-and-a-advisory/jakarta/
- /m-and-a-advisory/sydney/
- /m-and-a-advisory/melbourne/
- /m-and-a-advisory/bangkok/

### Programmatic Page Template: Exit Planning

```
URL: /exit-planning/{sector}/{country}/
Title: Exit Planning for {Sector} Businesses in {Country} — Capital8
Meta: How to plan and execute a successful exit for your {sector} business in {country}. Covers valuation, preparation, buyer types, and timeline.
H1: Exit Planning for {Sector} Businesses in {Country}

Section 1: Market Context (unique per page)
- Current state of {sector} M&A in {country}
- Recent deal activity and trends (anonymised, sourced from public data)
- Typical buyer profiles for {sector} in {country}

Section 2: Valuation Benchmarks (semi-unique)
- Revenue multiple ranges for {sector} (sourced from public market data)
- EBITDA multiple ranges
- Key value drivers specific to {sector}
- What discounts apply in {country} vs global benchmarks

Section 3: Preparation Checklist (templated with sector customisation)
- Financial normalisation priorities for {sector}
- Operational independence requirements
- Key documents buyers expect
- Common readiness gaps in {sector} businesses

Section 4: The Exit Process in {Country} (unique per country)
- Regulatory considerations
- Tax implications of different deal structures
- Timeline expectations
- Common deal structures (asset vs share sale, earnouts)

Section 5: Who Buys {Sector} Businesses in {Country} (semi-unique)
- Strategic acquirers (larger {sector} companies)
- PE firms active in {country} {sector}
- Search funds and independent sponsors
- Cross-border acquirers (e.g., AU companies buying SG {sector})

Section 6: CTA (templated)
- "See where your {sector} business stands" → ExitFit Diagnostic
- Time: "12 minutes, free, no advisor call required"
- Trust signal: "Used by [VERIFIED] founder-operators across APAC"

Sidebar:
- Related: /business-valuation/{sector}/
- Related: /m-and-a-advisory/{city}/
- Related: /exit-planning/{sector}/{adjacent-country}/
- Glossary links (auto-linked terms)

Schema: Article + FAQPage + Service + BreadcrumbList
Word count: 1,500-2,500 (enough unique value to justify indexing)
```

### Unique Value Requirements

Each programmatic page MUST have genuine unique value — not just the same template with swapped city names. The unique value comes from:

1. **Market data:** Publicly available M&A statistics, deal multiples, and trends specific to the sector-country combination. Sources: MergerMarket, PitchBook public reports, government SME statistics, industry association data.

2. **Regulatory specifics:** Tax treatment of business sales varies significantly by country. Singapore's 0% capital gains vs Australia's CGT, Indonesia's complex ownership rules — this is genuinely different per page.

3. **Buyer landscape:** The acquirers active in SaaS/Singapore are different from those in healthcare/Indonesia. Name the buyer types (not specific firms), describe their buy-boxes, explain cross-border dynamics.

4. **Cultural context:** Exit conversations happen differently in Jakarta than in Sydney. Succession dynamics in Malaysian family businesses vs Australian founder-led tech companies. This is unique, valuable, and hard to replicate.

**Quality gate:** If a page cannot have at least 40% unique content (vs the template), do not create it. An empty or thin page is worse than no page.

### Programmatic Page Template: Business Valuation

```
URL: /business-valuation/{sector}/
Title: {Sector} Business Valuation — Multiples, Methods & What Buyers Pay
H1: How {Sector} Businesses Are Valued

Section 1: Valuation methods used for {sector}
Section 2: Revenue and EBITDA multiples (with ranges, not false precision)
Section 3: Value drivers that increase multiples
Section 4: Value destroyers that compress multiples
Section 5: How APAC multiples compare to US/EU benchmarks
Section 6: CTA → ExitFit Diagnostic

Word count: 2,000-3,000
```

### Programmatic Page Template: M&A Advisory Location

```
URL: /m-and-a-advisory/{city}/
Title: M&A Advisory in {City} for $3M-$20M Businesses — Capital8
H1: M&A Advisory Services in {City}

Section 1: The {city} M&A market for lower mid-market businesses
Section 2: What to look for in an M&A advisor
Section 3: How Capital8 works in {city} (local presence, deal track record)
Section 4: Fee structures (success-fee model explained)
Section 5: CTA → ExitFit Diagnostic or /dealready

Word count: 1,500-2,000
```

### Content Production Plan

**Phase 1 (Weeks 1-4): Foundation**
- Write 4 pillar pages (seller hub, buyer hub, dealmaker hub, glossary index)
- Write 10 glossary terms (highest-volume M&A terms)
- Write 3 cluster pages under seller pillar (exit planning, valuation, preparation)

**Phase 2 (Weeks 5-8): Programmatic Launch**
- Write 12 Priority 1 exit-planning pages
- Write 4 business-valuation pages (SaaS, professional services, healthcare, agencies)
- Write 4 M&A advisory location pages (Singapore, Sydney, KL, Jakarta)

**Phase 3 (Weeks 9-16): Scale**
- Write remaining 12 Priority 2 exit-planning pages
- Write remaining 4 business-valuation pages
- Write remaining 2 location pages
- Expand glossary to 30 terms
- Write buyer-side cluster pages (due diligence, deal sourcing)

**Phase 4 (Ongoing): Optimise**
- Monitor Search Console for query coverage gaps
- Add new sector × country pages based on search demand data
- Update valuation multiples quarterly
- Refresh market data sections annually
- Expand glossary based on "People also ask" queries

---

## Part 3: AI Search Optimisation Plan

### The Goal

When a founder in APAC asks an AI assistant "How do I sell my business?", "What is my SaaS company worth?", or "Who provides M&A advisory in Singapore?", Capital8 should be cited in the response.

### How AI Systems Select Sources to Cite

Based on the Princeton GEO research and the ai-seo skill framework:

1. **Extractability:** Content must be in a format AI can parse — clean HTML, structured headings, FAQ schema, definition lists. AI systems struggle with JavaScript-rendered content, PDFs, and heavily designed pages.

2. **Specificity:** AI systems prefer content that directly answers the query with concrete data. "SaaS businesses in Singapore typically trade at 3-6x revenue" is citable. "Business valuations depend on many factors" is not.

3. **Authority signals:** Citations, statistics, named methodologies, and institutional framing increase citation likelihood by 30-40% (Princeton GEO).

4. **Freshness:** AI systems weight recently published/updated content. Date metadata matters.

### Target Questions — Seller Intent

These are the questions Capital8 should own in AI-generated responses:

**Tier 1 (highest priority — answer on pillar/cluster pages):**
1. "How do I sell my business in Singapore?"
2. "What is my business worth?" / "How to value a small business"
3. "How long does it take to sell a business?"
4. "What is an M&A advisor and do I need one?"
5. "How to prepare my business for sale"
6. "What are typical M&A fees for small businesses?"
7. "When is the right time to sell my business?"

**Tier 2 (answer on programmatic pages):**
8. "How to sell a SaaS business" / "SaaS business valuation multiples"
9. "Selling a professional services firm"
10. "M&A advisory Singapore" / "business broker Singapore"
11. "How to sell a business in Malaysia" / "business exit planning Indonesia"
12. "What do buyers look for in an acquisition?"
13. "How to find buyers for my business"

**Tier 3 (answer on glossary/cluster pages):**
14. "What is EBITDA and why does it matter for selling?"
15. "Asset sale vs share sale — which is better?"
16. "What is an information memorandum?"
17. "What is due diligence when selling a business?"
18. "What is an earnout?"

### Target Questions — Buyer Intent

19. "How to buy a business in APAC"
20. "Deal sourcing for acquisitions in Southeast Asia"
21. "What is a buy-box for acquisitions?"
22. "How to evaluate an acquisition target"

### Target Questions — Dealmaker Intent

23. "How to earn referral fees on M&A deals"
24. "M&A referral partnerships for lawyers/accountants"
25. "How dealmakers earn from business exits"

### Content Changes for AI Citation

#### A. Structure for Extractability

**Current problem:** capital8.io is JavaScript-rendered (Next.js). AI crawlers (GPTBot, Claude-Web, PerplexityBot) may not execute JS. Many AI systems will see an empty page.

**Fix (Critical):**
1. Enable server-side rendering (SSR) or static site generation (SSG) for all content pages. Programmatic pages MUST be statically generated.
2. Verify `robots.txt` allows: GPTBot, Claude-Web, PerplexityBot, Amazonbot, Google-Extended
3. Add `<meta name="robots" content="index, follow, max-snippet:-1">` to allow full content extraction
4. Ensure all content pages have clean semantic HTML: `<article>`, `<h1>`-`<h3>`, `<p>`, `<ol>`/`<ul>`, `<dl>` for definitions
5. Implement `FAQPage` schema on every page that has Q&A content — AI systems extract FAQ schema at very high rates

**Fix (Important):**
6. Add an XML sitemap at /sitemap.xml listing all content pages with `<lastmod>` dates
7. Add `datePublished` and `dateModified` in both visible text and schema markup
8. Use `<table>` for comparison data (multiples, fee structures) — tables are highly extractable

#### B. Authority for Citability

**Current problem:** The site has no citable statistics, no named methodology, no research citations. AI systems have nothing concrete to extract and attribute.

**Fix (Critical):**
1. **Name the methodology.** The 30-dimension readiness assessment should have a name beyond "ExitFit Diagnostic." On content pages, explain it: "The ExitFit framework evaluates business exit readiness across 30 dimensions including financial normalisation, operational independence, customer concentration, and growth trajectory." This is citable.

2. **Publish statistics with attribution.** Every content page should include at least 2-3 concrete statistics:
   - "In our experience across [VERIFIED] mandates, businesses that complete financial normalisation before going to market achieve 15-25% higher multiples than those that don't." (Softened per compliance, but specific enough to cite.)
   - "The median time from ExitFit Diagnostic to signed LOI across Capital8 mandates is [X] weeks." (Verify actual number.)
   - Source public statistics: "According to [Industry Association], [X]% of APAC SME exits fail to close due to inadequate preparation."

3. **Create comparison content.** AI systems cite comparisons at ~33% rate (highest of all content types). Build:
   - "M&A Advisor vs Business Broker: What's the Difference?" (cluster page under seller pillar)
   - "Success Fee vs Retainer: M&A Fee Structures Compared" (cluster page)
   - "Asset Sale vs Share Sale in [Country]" (programmatic variant)

4. **Add expert framing.** AI systems weight content from named experts. Every content page should include:
   - Author: Sven Milder, with a brief bio line ("Sven Milder advises founder-operators on exits in APAC's $3M-$20M segment")
   - `author` schema with `sameAs` pointing to LinkedIn profile

5. **Use quotable definitions.** Format key concepts as standalone, extractable definitions:
   - "**ExitFit Score:** A readiness rating from 0-100 that measures how prepared a business is for a successful sale, based on 30 dimensions of operational, financial, and strategic readiness."
   - "**Room 0-4:** Capital8's staged disclosure framework that controls what information buyers see at each phase of the deal process, protecting seller confidentiality throughout."

#### C. Presence — Where AI Systems Look

**Fix (Important):**
1. **Wikipedia / Wikidata:** If Capital8 or Sven Milder has sufficient notability, create or contribute to relevant Wikipedia articles (e.g., "M&A advisory in Southeast Asia"). Even if a dedicated article isn't warranted, contributing sourced content to existing articles about APAC M&A creates citation pathways.

2. **LinkedIn publishing:** AI systems trained on web data weight LinkedIn articles. Sven should publish 2-4 long-form LinkedIn articles per month covering the Tier 1 questions. These create redundant authority signals.

3. **Industry directory listings:** Ensure Capital8 appears in:
   - AVCJ (Asian Venture Capital Journal) directory
   - MergerMarket advisor listings
   - Singapore Business Federation / Enterprise Singapore directories
   - Relevant country-specific M&A or advisory directories

4. **Podcast/media appearances:** AI systems weight content from established media. Seek guest appearances on APAC business/M&A podcasts. Transcripts become additional citable content.

5. **Structured data on external platforms:** Ensure consistent NAP (name, address, phone) across Google Business Profile, LinkedIn, and all directory listings. Inconsistency reduces AI confidence in citing.

### AI Bot Access Configuration

Add to `robots.txt`:
```
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /
```

If the current `robots.txt` blocks any of these, fix immediately. Blocking AI crawlers is blocking AI citations.

### Measurement

**AI citation tracking:**
- Monthly: Search the Tier 1 questions in ChatGPT, Claude, Perplexity, and Google AI Overviews. Record whether Capital8 is cited, mentioned, or absent.
- Track referral traffic from chat.openai.com, claude.ai, perplexity.ai in analytics.

**Organic search tracking:**
- Search Console: Track impressions and clicks for target keywords
- Track programmatic page indexing rate (indexed / published)
- Monitor "People also ask" coverage for Tier 1 questions

**Content quality tracking:**
- Programmatic pages: Ensure >40% unique content per page
- Time on page and scroll depth for content hub pages
- ExitFit Diagnostic starts attributed to content pages (UTM tracking)

---

## Implementation Priority

| Priority | Action | Impact | Effort |
|---|---|---|---|
| P0 | Enable SSR/SSG for all pages + verify AI bot access | Without this, nothing else matters | Medium (engineering) |
| P0 | Add XML sitemap with lastmod | Crawlability foundation | Low |
| P1 | Write 4 pillar pages | Content hub foundation | Medium (content) |
| P1 | Write 12 Priority 1 exit-planning programmatic pages | Primary organic growth driver | High (content) |
| P1 | Add FAQPage schema to all Q&A content | High AI extraction rate | Low (engineering) |
| P1 | Add Article schema with author/date to all content | Authority signal | Low (engineering) |
| P2 | Write 4 business-valuation sector pages | High-value comparison content | Medium (content) |
| P2 | Write 4 M&A advisory location pages | Local SEO capture | Medium (content) |
| P2 | Write 10 glossary terms | Long-tail keyword coverage | Low (content) |
| P2 | Build 3 comparison pages (advisor vs broker, fee structures, deal structures) | AI systems cite comparisons at 33% | Medium (content) |
| P2 | Publish statistics on content pages | +37% AI citation likelihood | Low (content + verification) |
| P3 | Write Priority 2 programmatic pages | Expanded coverage | High (content) |
| P3 | LinkedIn long-form publishing programme | Redundant authority signals | Medium (ongoing) |
| P3 | Industry directory listings | Presence layer | Low |
| P3 | Expand glossary to 30+ terms | Long-tail coverage | Medium (content) |

---

## Compliance Reminders for All SEO Content

All content pages must observe Capital8's compliance framework:

- No guaranteed returns or multiples. Use "in our experience" and ranges, not specific projections.
- All deal examples anonymised: sector + country + revenue range + outcome. Never company or founder names.
- Only [VERIFIED] metrics on external pages. If not verified, do not publish.
- "Advisory services only. Not a licensed broker." in footer on every page.
- Brand terms exact: Capital8, ExitFit Diagnostic, ExitFit Score, ExitFit Sprint, Mandate, Mandate Desk, Room 0-4, Success fee.
- Forbidden vocabulary: opportunity, synergy, leverage (figurative), ecosystem, holistic, robust, excited, thrilled, game-changer, unlock, passionate, innovative, seamless, frictionless, best-in-class, world-class, revolutionary, disrupting.
- Singapore MAS, Australian ASIC, Malaysian SC rules apply. When in doubt, soften.

---

## Related Files

- `.agents/product-marketing-context.md` — Foundation product/market context
- `.agents/cro-audit-2026-04-06.md` — CRO audit with page-specific findings
- `.agents/dealmaker-outreach-sequences.md` — Cold email sequences
- `skills/seo-audit/SKILL.md` — SEO audit methodology
- `skills/programmatic-seo/SKILL.md` — Programmatic SEO playbook
- `skills/ai-seo/SKILL.md` — AI search optimisation framework
- `skills/site-architecture/SKILL.md` — Site architecture principles
