---
name: Gardu Warga — Kampung Sapen
description: Portal warga yang hangat dan mudah dibaca, berpusat pada kabar serta layanan kampung.
colors:
  ink: "#38271f"
  ink-soft: "#66594d"
  paper: "#faf3e6"
  paper-raised: "#fffaf1"
  rule: "#d8c9b3"
  clay: "#a8452c"
  clay-deep: "#71331f"
  leaf: "#3d6544"
  gold: "#bd792d"
  warm-wash: "#f4e8d5"
  success-wash: "#edf1e8"
  focus: "#8b492b"
  selection: "#d8ae78"
typography:
  display:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(32px, 6vw, 52px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(23px, 3.5vw, 30px)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: 'Trebuchet MS, "Segoe UI", sans-serif'
    fontSize: "18px"
    fontWeight: 800
  body:
    fontFamily: 'Trebuchet MS, "Segoe UI", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: 'Trebuchet MS, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 800
rounded:
  xs: "4px"
  sm: "5px"
  md: "6px"
  control: "7px"
  card: "8px"
  panel: "10px"
  modal: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "28px"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.control}"
    padding: "10px 15px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "#873923"
  card-content:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(18px, 3vw, 28px)"
  input:
    backgroundColor: "#fffdf8"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 12px"
    height: "48px"
---

# Design System: Gardu Warga — Kampung Sapen

## Overview

**Creative North Star: “Gardu Warga”**

This system treats the homepage like a neighborhood guard post handover board: residents should quickly recognize the RW, read the current notice and ronda details, then move into news or services. Warm roster-paper cream, dark brown ink, terracotta, and leaf green give practical information a familiar local character.

The interface is mobile-first and supports residents across age groups. Clear sans-serif interface text, prominent serif headings, strong dividers, readable status labels, and generous touch targets carry the visual hierarchy. Surfaces remain simple and functional, without decorative texture.

**Key Characteristics:**
- Warm paper surfaces with dark, high-contrast text.
- Terracotta for primary actions; green for civic and positive status.
- Strong rules and compact labels organize information.
- Large, legible type and controls sized for touch.

## Colors

The palette pairs parchment cream and brown ink with restrained clay, leaf, and gold accents; status meaning is also stated in text and icons.

### Primary
- **Sapen Clay** (`#a8452c`): Primary buttons, active states, section accents, and article links.
- **Deep Clay** (`#71331f`): Hover and pressed emphasis for clay actions.

### Secondary
- **Leaf Green** (`#3d6544`): Community ticker and positive or civic status indicators.
- **Roster Gold** (`#bd792d`): Small supporting accent and warm details.

### Neutral
- **Dark Ink** (`#38271f`): Main text and dark header/footer bands.
- **Soft Ink** (`#66594d`): Supporting copy on light backgrounds.
- **Roster Paper** (`#faf3e6`): Main page background.
- **Raised Paper** (`#fffaf1`): Cards, controls, and raised content.
- **Warm Wash** (`#f4e8d5`): Secondary panels and selected warm surfaces.
- **Rule** (`#d8c9b3`): Borders and dividers.
- **Success Wash** (`#edf1e8`): Positive service status background.

### Named Rules
**The Status-in-Words Rule.** Pair color-coded statuses with readable text and, where present, an icon.

## Typography

**Display Font:** Georgia (with Times New Roman, serif fallback)  
**Body Font:** Trebuchet MS (with Segoe UI, sans-serif fallback)

**Character:** A familiar editorial serif gives headlines neighborhood noticeboard character; a sturdy humanist system sans keeps controls, labels, and body copy practical and readable.

### Hierarchy
- **Display** (700, `clamp(32px, 6vw, 52px)`, 1.08): Homepage hero heading.
- **Headline** (700, `clamp(23px, 3.5vw, 30px)`, 1.2): Main content section headings.
- **Title** (800, 18px): Brand title and service headings.
- **Body** (400, 15px, 1.55): Default reading text; article copy is spaced more openly.
- **Label** (800, 12px): Status, category, and compact interface labels.

## Layout

Start with a single-column mobile reading flow. The homepage content container reaches 1224px; hero and floating service shortcuts use a 1160px maximum. The article uses a 1160px outer container and a restrained reading column. Content panels use responsive padding, generally `clamp(18px, 3vw, 28px)`, with full-width rules that make sections easy to scan.

On wider screens, the four service shortcuts form a four-column grid, news and map areas use two-column layouts, and the article pairs its story with related content. At 760px and below, homepage grids and article layouts stack; at 420px and below, the homepage shortcuts collapse further. News administration stacks its form fields and list actions at 700px and below. Common controls have a 44px minimum touch height; form controls are 48px.

## Elevation & Depth

The system is flat by default: borders, paper-tone shifts, and dark header bands establish grouping. Homepage cards explicitly have no shadow. The centered modal is the notable lifted surface, using `0 18px 48px rgba(37, 26, 19, .28)` over a dark overlay. Focus uses a visible 3px outline rather than elevation.

## Shapes

Use modest rounded rectangles rather than pills: controls commonly use 5–7px radii, cards 8px, main panels 10px, and modal surfaces 12px. Borders are part of the information structure, usually 1px warm rules; prominent header bands have a 3px clay edge. Circular marks are reserved for the small neighborhood emblem and modal icon.

## Components

### Buttons
- **Shape:** Compact rounded rectangle, usually 5–7px.
- **Primary:** Clay fill (`#a8452c`), raised-paper text, 10px 15px padding, and 46px minimum height.
- **Hover / Focus:** Darken to `#873923`; keyboard focus receives a 3px visible outline with 3px offset.
- **Secondary:** Raised paper or warm wash with an ink label and a fine brown border.

### Chips
- **Style:** Small warm-tinted label with a fine gold or brown border, 4px radius, and bold 11–12px text.
- **State:** Active tabs use clay fill and raised-paper text; status labels preserve explicit wording.

### Cards / Containers
- **Corner Style:** 8px for service and news cards; 10px for larger content panels.
- **Background:** Raised paper, with warm wash for secondary groupings.
- **Shadow Strategy:** Flat at rest; see Elevation & Depth for the modal exception.
- **Border:** 1px roster rule.
- **Internal Padding:** 15–22px for compact cards; responsive 18–28px for main panels.

### Inputs / Fields
- **Style:** Warm white (`#fffdf8`), 1px brown stroke, 5px radius, 48px minimum height, and 11px 12px padding.
- **Focus:** Clay border with a 3px warm focus outline and 1px offset.
- **Error / Disabled:** Use explicit error copy and differentiated status colors; disabled submit controls lower opacity and show a wait cursor.

### Navigation
The sticky paper navigation uses a bottom rule, simple sans labels, and 44px minimum link height. Hover adds a warm wash and clay text. The primary administrator entry is a clay button; mobile navigation adapts to a compact stacked layout.

### Ronda Handover and Service Status
The hero status and roster statistics foreground the ronda team and time. Use tabular numerals for schedule counts; keep status text visible alongside green or clay cues. The four service shortcuts remain distinct, generously padded targets.

## Do's and Don'ts

### Do:
- **Do** use Bahasa Indonesia and keep essential neighborhood information quick to find on a phone.
- **Do** pair status color with a text label and supporting icon where available.
- **Do** use the paper, ink, clay, and leaf palette and the established serif/sans pairing.
- **Do** preserve large controls, visible keyboard focus, and responsive single-column reading.
- **Do** keep card depth flat and use borders and tonal paper shifts to group information.

### Don't:
- **Don't** introduce decorative paper textures; the selected direction uses plain paper-toned surfaces.
- **Don't** rely on color alone to explain a status.
- **Don't** replace the clear information hierarchy with an undifferentiated run of cards.
- **Don't** reduce mobile tap targets below the established 44px minimum for common controls.
