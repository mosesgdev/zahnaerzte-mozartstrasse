@AGENTS.md

# Zahnärzte Mozartstraße - Website

## Project

Modern, mobile-first responsive website for Zahnarztpraxis Boris Shuk in Winsen (Luhe). Replaces an existing IONOS/1&1 Editor website.

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Framer Motion
- **SEO:** next-seo + Next.js generateMetadata
- **Icons:** Lucide React
- **Design Quality:** Frontend-Design Skill installed at `.claude/skills/frontend-design/`

## Content

All scraped content from the original website is stored in `content/`:

- `site-data.ts` — Practice info, contact, opening hours, image URLs
- `team.ts` — Boris Shuk + 5 team members with qualifications
- `services.ts` — 10 dental services with descriptions
- `pages.ts` — Page content, navigation structure, SEO meta

## Design System

**Pending.** A design system will be provided separately. Do not build pages until the design system is in place.

## Architecture

- Pages follow Next.js App Router conventions in `src/app/`
- Components in `src/components/` (layout, sections, shared, ui)
- Content data imported from `content/` — no hardcoded strings in components
- All text content is in German
- SEO: JSON-LD structured data (LocalBusiness, Dentist), `<html lang="de">`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```
