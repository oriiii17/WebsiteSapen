# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: residents of Kampung Sapen, Demangan, Gondokusuman, Yogyakarta, across age groups. They use the site, often on a phone, to check neighborhood news, ronda/siskamling schedules, the waste bank, and community finances.
- Secondary: RW administrators, who use the administrator mode to update neighborhood news and information.

## Product Purpose

The site is Kampung Sapen's digital information and services hub. It should make community information easy to find and read on a phone, including for older residents, and help residents stay informed and connected.

## Positioning

A neighborhood portal for Kampung Sapen that brings local news and practical community services together in one accessible place.

## Operating Context

Residents primarily access the portal on mobile phones. RW administrators sign in to administrator mode and use its control bar to manage information.

## Capabilities and Constraints

- Keep the experience in Bahasa Indonesia and prioritize mobile-first layouts, high contrast, and large tap targets.
- Preserve the administrator login and control-bar flow, the news CMS CRUD workflow, and all existing API routes, including `/api/berita`, `/api/upload`, `/api/verify-token`, and `/api/modul-content`.
- Preserve the existing token-gated module access as part of the system; it is not the homepage's primary focus.
- Preserve the satellite map and the canvas game “Panen Berkah Sapen”.
- Preserve the localStorage keys `sapen_admin_data`, `sapen_village_info_clean`, and `sapen_game_hi`.
- Use lucide-react icons in place of emoji icons.
- Stack is Next.js 14 App Router, React, TypeScript, and Tailwind CSS, as recorded in the project README and package manifest.

## Brand Commitments

The product name is Kampung Sapen. The user describes the desired product experience as warm and characteristic of Yogyakarta. Keep the interface language in Bahasa Indonesia.

## Evidence on Hand

- Existing application source in `src/app`, `src/components`, and `src/data`.
- Neighborhood imagery in `public/sapen.jpg` and `public/re9.jpg`.
- Existing news content and fallback records in `src/data/beritaData.ts` and the homepage implementation.
- Preserve real product data and functionality; do not invent community announcements, financial figures, schedules, or testimonials.

## Product Principles

- Make essential neighborhood information quick to find on a phone.
- Keep information readable and usable for residents across ages.
- Support administrators in maintaining timely, useful community updates.
- Preserve existing services and integrations as the portal evolves.
