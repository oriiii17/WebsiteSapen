# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: residents of Kampung Sapen, Demangan, Gondokusuman, Yogyakarta, across age groups, who visit on phones to read and search community news and announcements.
- Secondary: administrators who sign in to publish and manage news through the CMS.

## Product Purpose

The site is the public news portal for Kampung Sapen. Success means residents can quickly find, read, and search current local news and announcements, while administrators can publish updates reliably.

## Positioning

A focused Kampung Sapen publication for community news, notices, and schedules, presented in one searchable archive.

## Operating Context

Residents mainly arrive from mobile phones to read. Administrators sign in to the protected CMS and create, edit, or remove articles.

## Capabilities and Constraints

- Interface language is Bahasa Indonesia. Prioritize mobile readability, high contrast, visible keyboard focus, and touch targets of at least 44px.
- Homepage supports category filtering, news search, one featured story, and incremental loading of ten stories.
- News content, including announcements and schedules, is stored as articles. Add the `Pengumuman` category using the existing `berita.category` field; do not change the database schema.
- Preserve administrator login and CMS CRUD, existing API routes, environment-based Supabase configuration, the existing `berita` schema, and token-gated API capabilities.
- Remove homepage game, finance and service dashboards, village info editor/local data, ticker, hero slider, maps embed, and the `/agenda`, `/peta`, and `/berita` listing pages (those routes redirect to `/`).
- Stack is Next.js 14 App Router, React, TypeScript, and Tailwind CSS.

## Brand Commitments

The product name is Portal Warga Kampung Sapen. Use clear, factual Bahasa Indonesia and identify the whole Kampung Sapen community rather than a single RW.

## Evidence on Hand

- Existing application and CMS source in `src/app`.
- Community imagery in `public/sapen.jpg` and `public/re9.jpg`.
- Existing news records and fallback content in `src/data/beritaData.ts`; do not fabricate announcements, dates, contacts, or community claims.

## Product Principles

- Let residents arrive, read, and search without competing actions.
- Put current community information ahead of interface decoration.
- Keep article text readable for residents across ages and devices.
- Make publishing reliable for administrators while keeping private operations server-side.
