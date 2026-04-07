# Capital8 Growth Department App — UI Design System

**Version:** 1.0
**Date:** 2026-04-07
**Scope:** Internal application design only. Not Capital8 brand guidelines. Not customer-facing.
**Source:** Extracted from the Capital8 Dealflow Engine (Pipeline, Dashboard, Agent Control Room screens).

---

## 1. Foundation

### 1.1 Design Philosophy

The design language is **dark-mode operational** — built for a power user who lives in the app 8+ hours a day. The aesthetic is closer to a Bloomberg terminal or a military command center than a consumer SaaS product. Dense information, zero decoration, every pixel earns its place.

Key principles observed:
- **Data density over whitespace.** The dashboard packs 8 metric cards, a chart, a donut chart, and a heatmap into a single scroll. No hero sections, no marketing copy.
- **Status is always visible.** Pipeline counts, agent health indicators, network status, and cost tracking are persistent — not hidden behind clicks.
- **Dark background, bright data.** The eye goes to the numbers and status badges, not the chrome.
- **Minimal interaction design.** Actions are icon-based (play, chat, settings), not button-heavy. The UI gets out of the way.

### 1.2 Layout Model

```
+----------------------------------------------------------+
|  TOP BAR (fixed, full-width)                              |
|  Logo | Search | Mode Tabs | Network Status | User       |
+----------+-----------------------------------------------+
|          |                                                |
|  SIDE    |         MAIN CONTENT AREA                      |
|  NAV     |                                                |
|  (fixed, |    Page Title + Actions (top-right)            |
|  ~180px) |                                                |
|          |    Content Grid / Table / Cards                |
|  [items] |                                                |
|          |                                                |
|  ------  |                                                |
|  [Sett]  |                                                |
+----------+-----------------------------------------------+
|                    LIVE ACTIVITY (floating, bottom-right)  |
+----------------------------------------------------------+
```

**Side nav:** Fixed width (~180px), dark background matching page background. Active item has a colored left border accent (green/lime). Items are icon + label, stacked vertically. Settings pinned to bottom with separator.

**Top bar:** Full-width, slightly elevated from page background. Contains: logo (left), search bar (center-left), mode/audience tabs (center), network status indicator (center-right), user avatar and agent mode label (right).

**Live Activity widget:** Floating card, bottom-right corner, collapsible. Shows real-time system events with timestamp.

---

## 2. Color Palette

### 2.1 Background Layers

| Token | Hex | Usage |
|---|---|---|
| `--bg-app` | `#0D0D0D` | Page background, deepest layer |
| `--bg-surface` | `#141414` | Cards, side nav, table rows |
| `--bg-elevated` | `#1A1A1A` | Top bar, modal backgrounds, elevated cards |
| `--bg-hover` | `#1F1F1F` | Table row hover, interactive element hover |
| `--bg-active` | `#242424` | Active nav item background, selected states |
| `--bg-input` | `#1A1A1A` | Input fields, search bar, select dropdowns |

### 2.2 Border & Dividers

| Token | Hex | Usage |
|---|---|---|
| `--border-subtle` | `#1F1F1F` | Card borders, table cell dividers |
| `--border-default` | `#2A2A2A` | Input borders, section dividers |
| `--border-strong` | `#333333` | Focused input borders, active card borders |

### 2.3 Text Colors

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#FFFFFF` | Headlines, metric values, primary labels |
| `--text-secondary` | `#A0A0A0` | Descriptions, secondary labels, column headers |
| `--text-muted` | `#666666` | Timestamps, disabled text, helper text |
| `--text-inverse` | `#0D0D0D` | Text on bright-colored badges/buttons |

### 2.4 Accent Colors — Status & Semantic

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--accent-green` | `#22C55E` | Lime/Green | Active status, positive metrics, success states, nav active indicator, "ACTIVE" badges |
| `--accent-yellow` | `#EAB308` | Amber | Warning states, medium scores (60-74), "ENRICHED" stage |
| `--accent-orange` | `#F97316` | Orange | Alert states, "OUTREACH" stage, medium-low scores |
| `--accent-red` | `#EF4444` | Red | Error states, negative deltas, "HOT" stage, low scores, critical alerts |
| `--accent-blue` | `#3B82F6` | Blue | Information, links, "DISCOVERED" stage badges |
| `--accent-purple` | `#8B5CF6` | Purple | "MEETING" stage, special categories |
| `--accent-cyan` | `#06B6D4` | Cyan | "CLOSED/DONE" stage, completion states |
| `--accent-lime` | `#84CC16` | Bright Lime | Primary CTA buttons ("NEW"), positive callouts |

### 2.5 Pipeline Stage Colors (specific mapping)

| Stage | Color | Badge Style |
|---|---|---|
| DISCOVERED | `#3B82F6` (blue) | Filled pill, white text |
| ENRICHED | `#EAB308` (amber) | Filled pill, dark text |
| OUTREACH | `#F97316` (orange) | Filled pill, white text |
| HOT | `#EF4444` (red) | Filled pill, white text |
| MEETING | `#8B5CF6` (purple) | Filled pill, white text |
| CLOSED / DONE | `#06B6D4` (cyan) | Filled pill, dark text |

### 2.6 Score Colors (ICP & EXIT columns)

Scores use a gradient mapping:
- **85-100:** `#22C55E` (green) — strong fit / high readiness
- **70-84:** `#EAB308` (amber) — moderate fit
- **50-69:** `#F97316` (orange) — weak fit
- **0-49:** `#EF4444` (red) — poor fit / not ready

Scores are displayed as plain numbers with colored text on dark background. No background fill on score cells.

### 2.7 Chart Colors

| Usage | Color |
|---|---|
| Primary data series (bars, lines) | `#EAB308` (amber/gold) |
| Secondary data series | `#22C55E` (green) |
| Donut segment 1 (dominant) | `#22C55E` (green — ExitFit) |
| Donut segment 2 | `#06B6D4` (cyan — CapitalFit) |
| Donut segment 3 | `#F97316` (orange — ExitPrep) |
| Donut segment 4 | `#EF4444` (red — Conflicted) |
| Chart grid lines | `#1F1F1F` |
| Chart axis labels | `#666666` |

---

## 3. Typography

### 3.1 Font Stack

**Primary:** System font stack (no custom web font loading for performance):
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

The existing app uses a geometric sans-serif that appears to be **Inter** or a similar clean grotesque. Recommend:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-display` | 28px | 700 (Bold) | 1.2 | Page greeting ("Hello, sven!"), major headers |
| `--text-h1` | 24px | 700 (Bold) | 1.3 | Page titles ("PIPELINE", "Agent Control Room") |
| `--text-h2` | 18px | 700 (Bold) | 1.3 | Section headers ("ACTIVITY OVER TIME", "SIGNAL HEATMAP") |
| `--text-h3` | 14px | 600 (Semi-bold) | 1.4 | Subsection headers, card titles, column headers |
| `--text-body` | 14px | 400 (Regular) | 1.5 | Table cell text, descriptions, body copy |
| `--text-small` | 12px | 400 (Regular) | 1.4 | Timestamps, helper text, badge labels, metadata |
| `--text-micro` | 11px | 500 (Medium) | 1.3 | Badge text, status labels, very small labels |

### 3.3 Text Treatments

- **Page titles:** ALL CAPS, bold, white. Example: "PIPELINE", "SIGNAL HEATMAP"
- **Section headers:** ALL CAPS or Title Case bold, white. Example: "ACTIVITY OVER TIME", "LIVE STATS"
- **Metric values:** Large (28-32px), bold, white. Dollar signs and numbers same weight.
- **Metric labels:** ALL CAPS, 12px, `--text-secondary` (gray). Example: "TOTAL SPEND", "COST PER LEAD"
- **Metric sub-labels:** 12px, colored accent text (green for positive context). Example: "ENGAGEMENT MINER", "LIVE STATUS"
- **Table column headers:** ALL CAPS, 12px, semi-bold, `--text-secondary`. Example: "LEAD", "STAGE", "COUNTRY"
- **Agent names:** ALL CAPS, 14px, bold, white. Example: "NEXUS", "ATLAS", "ORACLE"
- **Agent descriptions:** 12px, regular, `--text-secondary`. Example: "LinkedIn Scanner", "Lead Enrichment"

---

## 4. Components

### 4.1 Cards

**Metric Card:**
```
+----------------------------------+
|  [icon]                          |
|  METRIC LABEL          (12px, gray, caps)
|  $8.42                 (28px, bold, white)
|  COMBINED ENGINE & API USAGE     (12px, gray, caps)
+----------------------------------+
```
- Background: `--bg-surface`
- Border: 1px `--border-subtle`
- Border radius: 8px
- Padding: 20px
- Icon: 20px, colored (`--accent-green` or `--accent-yellow`)
- Metric value: 28px, bold, white
- Label above value: 12px, caps, `--text-secondary`
- Description below value: 12px, caps, `--text-secondary`

**Agent Card (sidebar list):**
```
+----------------------------------+
|  [avatar] AGENT NAME        [dot]|
|           Agent Role             |
+----------------------------------+
```
- Background: `--bg-surface` (default), `--bg-active` (selected)
- Border radius: 12px
- Padding: 12px 16px
- Avatar: 40px circle, colored icon on dark background
- Status dot: 8px circle, top-right of card, `--accent-green` when active
- Selected state: slightly brighter background, no border change

**Agent Detail Card:**
- Full-width content area
- Agent avatar (64px), name (h1), type label (mono/code font, `--text-secondary`), tagline in quotes (italic, `--accent-green`)
- "ACTIVE" badge: outlined pill, green border, green text, no fill
- Live stats: 4-column grid of key-value pairs (label top, value bottom)
- LLM Model selector: grid of model cards with name, provider, cost. Selected model has green border/background tint.
- Settings: label-value rows with right-aligned controls (toggle, number input, dropdown)

### 4.2 Badges & Pills

**Stage Badge:**
- Filled pill shape
- Border radius: 4px (slightly rounded rectangle, not fully round)
- Padding: 4px 12px
- Font: 11px, semi-bold, ALL CAPS
- Color: white text on colored background (per stage color map)
- No border, no shadow

**Status Badge (e.g., "ACTIVE"):**
- Outlined pill shape
- Border: 1px solid `--accent-green`
- Background: transparent
- Text: `--accent-green`, 12px, semi-bold
- Border radius: 16px (fully rounded)

**"NEW" Button/Badge:**
- Outlined pill
- Border: 1px solid `--accent-lime`
- Text: `--accent-lime`
- Background: transparent
- On hover: filled with `--accent-lime`, text becomes `--text-inverse`

**Sort Indicators (ICP, EXIT):**
- Label + down arrow
- Text: `--text-secondary`
- Active sort: `--text-primary` with visible arrow

### 4.3 Tables

**Pipeline Table:**
- No visible outer border
- Header row: `--text-secondary`, ALL CAPS, 12px, semi-bold. No background differentiation — header blends with page.
- Row separator: 1px `--border-subtle`
- Row height: ~56px (accommodates 2-line content like name + company)
- Row hover: `--bg-hover`
- Cell padding: 12px 16px

**Column types observed:**
- **Lead (name + company):** Name in white bold 14px, company below in `--text-muted` 12px. LinkedIn and email icons inline after name.
- **Stage:** Badge pill component
- **Lane:** Monospace/code-style text, `--text-secondary`
- **Country:** Regular body text
- **Sector:** Regular body text, wraps to 2 lines if needed
- **ICP / EXIT scores:** Colored number, no background
- **Last Signal:** Relative time ("6h ago"), `--text-muted`
- **Move (actions):** Row of 4 icon buttons (play, chat, settings, more). Icons are `--text-muted`, brighten on hover.

### 4.4 Navigation

**Side Nav:**
- Width: ~180px, fixed
- Background: same as `--bg-app` (no differentiation from page)
- Items: icon (20px) + label (14px), left-aligned
- Item padding: 10px 16px
- Active item: `--accent-green` text, green left border (3px), slightly brighter background
- Inactive items: `--text-secondary`
- Hover: `--text-primary`
- Separator: 1px `--border-subtle`, horizontal, before Settings
- Settings: gear icon, pinned to bottom

**Top Bar:**
- Height: ~56px
- Background: `--bg-elevated`
- Logo: icon + "CAPITAL8" wordmark, left-aligned
- Search: centered, dark input field with placeholder text and search icon
- Mode tabs: "Sell Side" (green filled pill, active), "Buy Side" (outlined), "Partners" (outlined). Only one active at a time.
- Network status: green dot + "NETWORK ACTIVE" label
- Notification bell: with red count badge (top-right of icon)
- User: name + "AGENT MODE" label, avatar circle

**Mode Tabs (Sell Side / Buy Side / Partners):**
- Active: filled green background (`--accent-green`), white/dark text, with leading icon
- Inactive: transparent background, `--text-secondary`, outlined
- Border radius: 20px (fully rounded pill)
- These act as global context switches, not navigation

### 4.5 Charts

**Bar Chart (Activity Over Time):**
- Bars: `--accent-yellow` (amber/gold) fill
- Background: transparent (no chart background card)
- Grid lines: `--border-subtle`, horizontal only
- Axis labels: `--text-muted`, 12px
- Legend: dot + label, positioned top-right of chart area
- Legend items: `--text-secondary`

**Donut Chart (Engagement Focus):**
- 4 segments with distinct colors (green, cyan, orange, red)
- Center: empty (no center label)
- Legend: below chart, 2x2 grid of dot + label
- Segment colors match the engagement category semantic meaning

### 4.6 Forms & Inputs

**Text Input / Search:**
- Background: `--bg-input`
- Border: 1px `--border-default`
- Border radius: 8px
- Text: `--text-primary`, 14px
- Placeholder: `--text-muted`
- Focus: border changes to `--border-strong`
- Height: 40px
- Leading icon (search): `--text-muted`

**Number Input (Settings):**
- Right-aligned value
- Background: `--bg-input`
- Border: 1px `--border-default`
- Border radius: 8px
- Width: ~64px (compact)

**Toggle Switch:**
- Track: `--bg-hover` (off), `--accent-green` (on)
- Thumb: white circle
- Width: 44px
- Transition: smooth 200ms

**Select/Dropdown:**
- Same styling as text input
- Chevron icon right-aligned
- Dropdown menu: `--bg-elevated`, `--border-default` border, 8px radius

### 4.7 Floating Widgets

**Live Activity (bottom-right):**
- Position: fixed, bottom-right, 16px margin
- Width: ~300px
- Background: `--bg-elevated`
- Border: 1px `--border-default`
- Border radius: 12px
- Header: green dot + "LIVE ACTIVITY" label + close (X) button
- Items: avatar/icon + "SYSTEM" label + description + timestamp
- Shadow: subtle dark shadow for elevation

### 4.8 Action Icons (Pipeline Row Actions)

Four icon buttons per row under "MOVE" column:
1. **Play** (triangle) — advance to next stage
2. **Chat** (speech bubble) — open conversation/reply
3. **Copy/Settings** (square) — duplicate or configure
4. **Globe/Link** (circle) — view external profile

- Size: 16px icons
- Color: `--text-muted` default
- Hover: `--text-primary`
- Spacing: 12px between icons
- No background or border on icons

---

## 5. Spacing & Layout

### 5.1 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps (icon to badge dot) |
| `--space-2` | 8px | Compact spacing (within badges, between inline elements) |
| `--space-3` | 12px | Default cell padding, icon spacing |
| `--space-4` | 16px | Card padding, nav item padding, section gaps |
| `--space-5` | 20px | Card internal padding, metric card spacing |
| `--space-6` | 24px | Between card groups, section vertical spacing |
| `--space-8` | 32px | Major section spacing |
| `--space-10` | 40px | Page-level top padding |

### 5.2 Grid System

- **Dashboard metrics:** 4-column grid, equal width, `--space-4` gap
- **Agent sidebar + detail:** 2-column, sidebar ~280px fixed, detail fills remaining
- **Pipeline:** Single column, full-width table
- **LLM model selector:** 3-column grid, `--space-3` gap
- **Donut chart + bar chart:** 2-column, bar chart takes ~65%, donut takes ~35%

### 5.3 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Stage badges, small pills |
| `--radius-md` | 8px | Cards, inputs, buttons |
| `--radius-lg` | 12px | Agent cards, floating widgets, modals |
| `--radius-full` | 9999px | Mode tabs, status pills, avatars |

---

## 6. Iconography

### 6.1 Icon Style

- **Library:** Lucide Icons (consistent with shadcn/ui)
- **Size:** 20px default for nav and UI, 16px for inline/table actions, 24px for card feature icons
- **Stroke width:** 1.5px (matches the light, clean aesthetic)
- **Color:** Inherits from text color of context (`--text-secondary` in nav, `--text-muted` in actions)

### 6.2 Icon Mapping (from existing app)

| Location | Icon | Lucide Name |
|---|---|---|
| Dashboard nav | Lightning bolt | `Zap` |
| Lead List nav | List | `List` |
| Pipeline nav | Git branch | `GitBranch` or `Workflow` |
| Deal Scanner nav | Radar/scan | `ScanSearch` |
| Agents nav | Bot/robot | `Bot` |
| Reply Inbox nav | Inbox | `Inbox` |
| User Guide nav | Circle-help | `CircleHelp` |
| Settings nav | Gear | `Settings` |
| Search | Magnifying glass | `Search` |
| Notifications | Bell | `Bell` |
| Close/dismiss | X | `X` |
| LinkedIn icon (inline) | LinkedIn logo | Custom SVG or `Linkedin` |
| Email icon (inline) | Mail | `Mail` |

### 6.3 Agent Avatars

Each agent has a unique colored circular avatar with a custom icon:
- **NEXUS** (LinkedIn Scanner): Blue circle, radar/scan icon
- **ATLAS** (Lead Enrichment): Purple circle, database icon
- **ORACLE** (ICP Scorer): Orange circle, target icon
- **RANGER** (Profile Scout): Green circle, binoculars icon
- **PHANTOM** (Custom Scout): Dark purple circle, ghost icon
- **QUILL** (Outreach Writer): Red/coral circle, pen icon
- **FUSE** (Matchmaker): Amber circle, zap/connection icon

Avatar style: 40px circle, solid colored background, white icon centered, no border.

---

## 7. Motion & Interaction

### 7.1 Transitions

- **Default transition:** 150ms ease-in-out (hover states, color changes)
- **Toggle switch:** 200ms ease (smooth slide)
- **Sidebar navigation:** No animation on route change (instant)
- **Live Activity widget:** Slide-up entrance, 200ms

### 7.2 Hover States

- **Table rows:** Background shifts to `--bg-hover`
- **Nav items:** Text color shifts to `--text-primary`
- **Action icons:** Color shifts from `--text-muted` to `--text-primary`
- **Cards:** No hover effect (cards are not clickable containers in the current design — specific actions within cards are clickable)
- **Badges:** No hover effect (informational only)

### 7.3 Focus States

- **Inputs:** Border changes to `--border-strong`, subtle green glow (box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2))
- **Buttons:** Outline offset ring, `--accent-green`

---

## 8. Responsive Behavior

The existing app appears designed for **desktop-first, wide-screen usage** (1440px+). The design is not mobile-responsive — this is an internal power-user tool.

### 8.1 Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop wide | 1440px+ | Full layout, 4-column metric grids |
| Desktop | 1280px | Reduce metric grid to 3 columns, compress table |
| Laptop | 1024px | Collapse side nav to icons only (no labels) |
| Below 1024px | Not supported | Show "Use desktop" message |

### 8.2 Side Nav Collapse

At laptop widths, side nav collapses to icon-only mode (~56px wide). Hover reveals label tooltip. Active indicator (green border) remains visible.

---

## 9. Dark Mode Only

The application is **dark mode only**. There is no light mode toggle. The entire color system is built around dark backgrounds with light foreground elements. This is intentional:

1. Reduces eye strain for extended use sessions
2. Makes colored status indicators and data points more prominent
3. Matches the "command center" operational aesthetic
4. Aligns with the existing Capital8 Dealflow Engine

---

## 10. Applying This to the Marketing Command Center

### 10.1 Direct Mapping

| Dealflow Engine | Marketing Command Center | Notes |
|---|---|---|
| Pipeline stages (DISCOVERED → CLOSED) | Content status (Draft → Published) | Same badge component, different labels and colors |
| ICP/EXIT scores (0-100, colored) | Compliance score, content quality score | Same color gradient (red → orange → amber → green) |
| Agent Control Room | Skill Browser / Orchestrator View | Same sidebar-list + detail-panel layout |
| Dashboard metrics (spend, CPL) | Dashboard metrics (ExitFit completions, engagement) | Same MetricCard component |
| Live Activity widget | Activity Feed widget | Same floating widget, same design |
| Mode tabs (Sell Side / Buy Side / Partners) | Audience tabs (Sellers / Buyers / Dealmakers) | Same pill-tab component with same green active state |
| NEXUS/ATLAS/ORACLE agents | Content Creator / SEO Specialist / Copywriter roles | Same avatar + card pattern for role switching |

### 10.2 New Components Needed

These don't exist in the Dealflow Engine but follow the same design language:

- **Content Calendar:** Week-strip grid, same card styling, voice mode colors map to badge colors
- **Email Sequence Timeline:** Horizontal timeline nodes, using `--accent-green` for sent, `--text-muted` for unsent
- **Programmatic SEO Grid:** Matrix grid, cell colors follow the same status badge pattern
- **Carousel Slide Editor:** Dark canvas with white card overlay for editing
- **Rich Text Editor:** Dark background (`--bg-surface`), white text, toolbar uses `--bg-elevated`

### 10.3 Voice Mode Color Mapping

Map the 4 voice modes to the existing accent palette:

| Voice Mode | Color | Token |
|---|---|---|
| ADVISOR | `#3B82F6` (blue) | `--accent-blue` |
| PEER | `#22C55E` (green) | `--accent-green` |
| SALES | `#F97316` (orange) | `--accent-orange` |
| BRAND | `#8B5CF6` (purple) | `--accent-purple` |

### 10.4 Audience Tab Colors

| Audience | Active State | Badge Color |
|---|---|---|
| Sellers | `--accent-green` filled pill (matches "Sell Side") | Blue badge |
| Buyers | `--accent-blue` filled pill | Cyan badge |
| Dealmakers | `--accent-yellow` filled pill | Amber badge |

---

## 11. Tailwind CSS Configuration

```javascript
// tailwind.config.js — Capital8 Growth Department App
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'app': '#0D0D0D',
        'surface': '#141414',
        'elevated': '#1A1A1A',
        'hover': '#1F1F1F',
        'active': '#242424',

        // Borders
        'border-subtle': '#1F1F1F',
        'border-default': '#2A2A2A',
        'border-strong': '#333333',

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666666',

        // Accents
        'accent-green': '#22C55E',
        'accent-yellow': '#EAB308',
        'accent-orange': '#F97316',
        'accent-red': '#EF4444',
        'accent-blue': '#3B82F6',
        'accent-purple': '#8B5CF6',
        'accent-cyan': '#06B6D4',
        'accent-lime': '#84CC16',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['18px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '1.3', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
      },
    },
  },
}
```

---

## 12. Component Checklist for Implementation

When building the Marketing Command Center, use these components from the Dealflow Engine design:

- [ ] `AppShell` — Side nav + top bar + content area (exact layout from screenshots)
- [ ] `SideNav` — Icon + label items, green active border, settings pinned bottom
- [ ] `TopBar` — Logo, search, audience mode tabs, notifications, user
- [ ] `MetricCard` — Icon, label, value, sub-label (4-column grid)
- [ ] `StatusBadge` — Filled pill with stage/status colors
- [ ] `OutlinedBadge` — Outlined pill for "ACTIVE", "NEW" states
- [ ] `DataTable` — Header (caps, gray), rows with hover, action icons
- [ ] `ScoreCell` — Colored number based on 0-100 range
- [ ] `AgentCard` — Avatar + name + role sidebar item (for skills/agents)
- [ ] `AgentDetail` — Full detail panel with stats, settings, model selector
- [ ] `BarChart` — Amber bars, dark background, minimal grid
- [ ] `DonutChart` — Multi-segment, legend below, no center label
- [ ] `LiveActivity` — Floating bottom-right widget with timestamp entries
- [ ] `ModeTab` — Pill-shaped tab group with one active (green filled)
- [ ] `ToggleSwitch` — Green on, dark off
- [ ] `NumberInput` — Compact, right-aligned value
- [ ] `SearchInput` — Dark background, leading icon
- [ ] `IconButton` — 16px icon, muted default, bright on hover
