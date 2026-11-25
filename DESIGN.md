---
name: Warta Pemerintah Modern — Kampung Sapen
description: Portal berita warga yang ringkas, jelas, dan mudah dicari.
colors:
  navy: "#17345f"
  royal-blue: "#2458a6"
  deep-blue: "#1a427e"
  ink: "#172335"
  muted-ink: "#48586c"
  rule: "#d7dee8"
  white: "#ffffff"
  cool-wash: "#f3f6fa"
  blue-wash: "#edf3fb"
  focus: "#1d4ed8"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(1.55rem, 3vw, 2.35rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "5px"
  surface: "7px"
spacing:
  compact: "8px"
  standard: "16px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.royal-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "46px"
  search-input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "46px"
  featured-story:
    backgroundColor: "{colors.cool-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(15px, 4vw, 38px)"
---

# Design System: Warta Pemerintah Modern — Kampung Sapen

## Overview

**Creative North Star: “Warta Pemerintah Modern”**

The portal is a concise public information desk for Kampung Sapen. Its interface puts the publication name, search, category filters, and current story in a predictable reading order. White space, navy headings, and royal-blue controls create institutional clarity while Atkinson Hyperlegible keeps the Indonesian copy easy to distinguish.

The visual voice is factual and restrained. Story imagery supplies the human warmth; the interface stays quiet so residents can read and search without competing service dashboards, promotional calls to action, or decorative motion.

**Key Characteristics:**
- White and cool-gray reading surfaces with navy structure and royal-blue actions.
- Compact, familiar public-information layout.
- Atkinson Hyperlegible across interface and article text.
- Thin rules and restrained corners instead of stacked decorative cards.

## Colors

Navy carries institutional hierarchy; royal blue makes navigation and actions easy to identify against crisp white surfaces.

### Primary
- **Civic Navy** (`#17345f`): Brand mark, section rules, and primary hierarchy.
- **Notice Blue** (`#2458a6`): Search icon, selected category, and reader actions.
- **Deep Notice Blue** (`#1a427e`): Link text and hover state for sufficient contrast.

### Neutral
- **Reading Ink** (`#172335`): Headings and primary copy.
- **Slate Copy** (`#48586c`): Supporting text and dates.
- **Cool Rule** (`#d7dee8`): Section and row dividers.
- **White** (`#ffffff`): Main page and reading surfaces.
- **News Wash** (`#f3f6fa`): Featured story surface.
- **Blue Wash** (`#edf3fb`): Admin session bar and selected support states.

### Named Rules
**The Quiet Interface Rule.** Use color to identify hierarchy, links, selection, and focus; do not turn every section into a colored block.

## Typography

**Display Font:** Atkinson Hyperlegible (with Arial and sans-serif fallbacks)  
**Body Font:** Atkinson Hyperlegible (with Arial and sans-serif fallbacks)

**Character:** A single accessible sans-serif voice keeps scanning and long-form reading consistent. Weight and scale distinguish headlines from metadata without introducing a second decorative voice.

### Hierarchy
- **Display** (800, `clamp(1.55rem, 3vw, 2.35rem)`, 1.2): Featured story title.
- **Headline** (800, `clamp(2rem, 5vw, 3.15rem)`, 1.17): Article title.
- **Title** (800, 1.15rem, 1.35): Compact news-list title.
- **Body** (400, 1rem to 1.12rem, 1.5 to 1.85): Interface and article text; article copy stays near 70ch.
- **Label** (700–800, `.78rem` to `.92rem`, normal tracking): Category, date, and metadata.

### Named Rules
**The One Voice Rule.** Use the locally bundled Atkinson Hyperlegible face throughout public reading surfaces.

## Layout

The homepage uses a centered 1000px news column and a wider 1120px masthead. At mobile widths the masthead stacks a compact wordmark and full-width search field; category chips scroll horizontally; the featured story becomes a vertical image-and-title unit. The 360px viewport shows the masthead, search, categories, and the start of the featured story without a promotional hero.

News rows use a small left thumbnail and a right text column. Titles clamp to three lines and category/date metadata remains on one line. The article reading column is capped at 760px, with related stories beneath the article. Common controls remain at least 44px high.

## Elevation & Depth

The system is flat by default. Dividers and a cool surface tint establish grouping; the featured story has a light border. A restrained shadow separates the login dialog from its overlay and appears subtly on the featured story hover state.

**The Flat-by-Default Rule.** Reserve shadows for interaction or a modal that must sit above page content.

## Shapes

Use crisp rectangular surfaces with small 4–7px corners. Search and category controls have modest rounding; featured stories and login dialogs use a 7–8px radius. Full-width rules organize long lists. Avoid pill-shaped cards and ornamental geometry.

## Components

### Buttons
- **Shape:** Compact rectangle, 5px radius.
- **Primary:** Royal-blue fill, white label, 46px height.
- **Hover / Focus:** Deep-blue hover; a 3px visible blue focus outline with offset.
- **Secondary / Ghost:** Transparent or white background with navy/blue text; keep touch targets at least 44px high.

### Chips
- **Style:** Horizontal category labels on white, compact 5px corners.
- **State:** Selected chip uses Civic Navy and white text; inactive chips use dark text and a light blue hover wash. The row can scroll on narrow screens.

### Cards / Containers
- **Corner Style:** 4–7px.
- **Background:** White for lists and article content; News Wash for the featured story.
- **Shadow Strategy:** Flat, with a fine border; subtle hover shadow only on the featured story.
- **Border:** Cool Rule (`#d7dee8`).
- **Internal Padding:** 15–38px on the featured story; news rows are separated by rules rather than nested cards.

### Inputs / Fields
- **Style:** White field, 1px cool border, 5px radius, 46px height.
- **Focus:** Royal-blue border and a pale-blue focus halo.
- **Error / Disabled:** Use direct Indonesian copy and a clear red error label; disabled submit controls retain readable contrast.

### Navigation
The public masthead combines a compact Sapen mark and a single news search. Category chips sit below it. The administrator entry stays small in the footer; a narrow admin bar appears only for a validated session.

### Featured Story and News Row
The featured story uses one image and a prominent title with category/date metadata. Secondary stories use a thumbnail at left, a title limited to three lines, and category/date metadata on one line, with no excerpt.

## Do's and Don'ts

### Do:
- **Do** keep search and current news at the top of the first mobile viewport.
- **Do** preserve clear contrast, visible keyboard focus, and readable category/date metadata.
- **Do** use white, cool gray, navy, and royal blue as the system palette.
- **Do** let story imagery provide personality while the interface stays quiet.

### Don't:
- **Don't** add dashboard metrics, service panels, a game, ticker, slider, map embed, or oversized calls to action to the public homepage.
- **Don't** add financial balance widgets or the village information editor to the reading flow.
- **Don't** add excerpts to compact news-list rows.
- **Don't** use decorative gradients, emoji, or motion that competes with reading.
