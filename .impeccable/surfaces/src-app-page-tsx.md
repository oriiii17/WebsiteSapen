---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope and Mode

Route `/`, Read. Replace the activity-and-services dashboard with the focused public news portal. The work includes the homepage, article detail, legacy route redirects, and the CMS category choice.

## Audience and Job

Residents across ages, most often on mobile, arrive to read and search current Kampung Sapen news. Administrators use the existing login and CMS to publish articles.

## Content and Constraints

Homepage sequence: compact logo/search header, category chips, one featured story, compact news list in batches of ten, and footer with address, existing contact details, Google Maps link, and small Admin Login link. List cards use a left thumbnail, a three-line title, and one category/date line without excerpt. Article detail has a back button and three related stories below. Retain API routes, environment settings, administrator authentication, CMS CRUD, and the existing database schema; store announcements and schedules as news under the existing category column. Redirect `/agenda`, `/peta`, and `/berita` to `/`. Remove the game, financial and service blocks, info modal and localStorage key, ticker, slider, status panel, map embed, and contact strip. Do not create or alter news facts.

## Direction contract

THESIS: A resident opens the site to read, not to operate a dashboard. The page behaves like a concise public bulletin: current news first, archive immediately after, and search within reach.

OWN-WORLD: Warta Pemerintah Modern uses clean white and pale gray surfaces, deep navy for institutional structure, and royal blue for links and active controls. Use Atkinson Hyperlegible for accessible Indonesian copy, decisive heading weights, crisp rules, restrained borders, and no decorative cards, gradients, or ornamental motion.

STORY: The visitor recognizes the Kampung Sapen publication, searches or narrows by category, opens the latest or featured story, then continues to three related reports. Administrators retain their separate sign-in and CMS workflow.

FIRST VIEWPORT: On 360px, a single compact masthead holds the logo/name and accessible search input; a horizontally scrollable category-chip row follows; the featured article begins immediately below with a compact image, category/date, and strong title visible without a competing banner or metric block. At desktop, these elements align to a centered reading column and the featured story widens without making the list dense.

FORM: Code-led Read surface, approved direction A — Warta Pemerintah Modern; the user pinned both the government-information character and the first-viewport reading/search sequence. `seed: none (pinned)` — “Pengunjung hanya masuk, membaca, dan mencari berita. Tanpa aksi berlebihan.”

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved Decisions

None. The user approved direction A and the implementation plan.
