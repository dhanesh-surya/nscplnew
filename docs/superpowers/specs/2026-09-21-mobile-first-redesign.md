# Mobile-First Redesign Specification — NSCPL Portal

**Date:** 2026-09-21  
**Project:** NSCPL Portal (`nscpl-portal-simple`)  
**Design Standard:** UI/UX Pro Max, Mobile-First, WCAG 2.1 AA Compliance, Bootstrap 5.3 Responsive Utilities  

---

## 1. Overview & Objectives

NSCPL Portal is an event and sports management CMS web application built with Next.js (App Router), React, and custom styling. The goal of this redesign is to implement a comprehensive mobile-first design architecture tested across all screen tiers:
* **320px** (Small mobile: iPhone SE 1st gen, Galaxy Fold closed)
* **375px** (Standard mobile: iPhone SE 2/3, iPhone 7/8)
* **390px** (Modern standard mobile: iPhone 12/13/14/15/16)
* **414px** (Large mobile: iPhone Plus/Max, Pixel XL)
* **768px** (Tablet portrait: iPad 10.2", iPad Mini)
* **1024px** (Tablet landscape / Small laptop: iPad Pro, MacBook Air 11")
* **1440px** (Desktop: MacBook Pro 15/16", standard 1080p browser)
* **1920px** (Widescreen / Full HD+ monitors)

### Primary Defects to Eliminate
1. **Horizontal scrolling**: Zero horizontal overflow on any viewport (320px to 1920px).
2. **Tiny text**: No body or metadata below 13px (0.8125rem); base font 16px; inputs strictly >= 16px to prevent iOS auto-zoom.
3. **Tiny buttons & touch targets**: All interactive targets (dots, icons, arrows, hamburger, links) must meet the minimum 44px × 44px touch bounding box.
4. **Overlapping elements**: Remove header wrap collisions at 768px, lightbox image clipping, and card badge crowding.
5. **Broken grids**: Responsive collapse of `.grid-auto`, `.grid-2`, `.grid-3`, `.grid-4`, and `.stats`.
6. **Inaccessible navigation**: Upgrade mobile navigation drawer with scroll lock, full viewport scrollability (`max-height: calc(100dvh - 66px)`), keyboard/tap dismiss, and accordion dropdown expansion.

---

## 2. Architecture & Technology Stack

### 2.1 Bootstrap 5.3 Utilities Integration
- Install `bootstrap@5.3.3` in `package.json`.
- Integrate Bootstrap 5.3 utilities and grid into `src/app/globals.css` or layout without overriding custom CSS custom properties (`--brand`, `--accent`, `--surface`, etc.).
- Leverage Bootstrap 5.3 responsive classes:
  - Flex & Display: `d-flex`, `d-none`, `d-md-flex`, `d-lg-none`, `flex-column`, `flex-md-row`, `justify-content-between`, `align-items-center`
  - Spacing: `p-2`, `p-3`, `p-md-4`, `px-3`, `py-4`, `gap-2`, `gap-3`, `gap-md-4`, `mb-3`
  - Responsive Grid & Containers: `row`, `col-12`, `col-md-6`, `col-lg-4`, `table-responsive`
  - Sizing: `w-100`, `h-100`

### 2.2 Fluid Typography & Layout Tokens
- Update `:root` in `globals.css` with fluid container paddings and responsive scale tokens:
  - Container padding: `clamp(16px, 4vw, 24px)`
  - Maximum content width: `1140px`
  - Fluid headings: `clamp(1.5rem, 4.5vw, 2.5rem)`
  - Safe-area insets: `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)`

---

## 3. Component-by-Component Redesign Specifications

### 3.1 Site Header & Navigation (`SiteHeaderClient.tsx` & `globals.css`)
- **Breakpoint Switch**: Upgrade mobile navigation drawer from `720px` to `991.98px` (`< lg`).
  - At 768px (iPad portrait), the full 8-item menu + CTA button no longer breaks into multi-line collisions.
- **Toggle Button**:
  - Minimum touch target: `48px × 48px`.
  - Accessible icon with smooth open (`✕`) / closed (`☰`) state and `aria-expanded` and `aria-label`.
- **Drawer Behavior**:
  - `position: fixed; top: 66px; left: 0; right: 0; bottom: 0;`
  - Background: `var(--card)` with backdrop blur.
  - `max-height: calc(100dvh - 66px); overflow-y: auto; -webkit-overflow-scrolling: touch;`
  - Overlay backdrop that allows clicking outside to close.
  - Submenu items support mobile accordion toggle (tap to expand/collapse rather than forcing all open).
  - "Get in touch" CTA button prominently anchored at bottom of drawer (`width: 100%`).

### 3.2 Hero Carousel (`HeroCarousel.tsx`)
- **Gestures**: Add native touch swipe support (`onTouchStart`, `onTouchMove`, `onTouchEnd` with threshold) for swipe-left (next) and swipe-right (prev).
- **Dots Navigation**:
  - Dots visual indicator: 10px pill expanding to 24px active pill.
  - Dot touch target: Wrapper button with minimum `44px × 44px` invisible hit area (`::before` pseudo-element).
- **Arrow Navigation**:
  - Minimum `44px × 44px` circular buttons on desktop/tablet.
  - Hide arrows on viewports `< 576px` to prevent blocking mobile screen content, relying instead on natural swipe gestures and dots.
- **Copy & Actions**:
  - Headline font size: `clamp(1.4rem, 5.5vw, 2.7rem)`.
  - Action buttons flex-wrap cleanly, `width: 100%` on screens `< 480px`.

### 3.3 Cards & Grids (`Cards.tsx`, `PageRenderer.tsx`, `globals.css`)
- `.grid-auto`: Update `grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));` so it never overflows 320px screens.
- `.grid-2`: 1 column on `< 768px`, 2 columns on `>= 768px`.
- `.grid-3`: 1 column on `< 640px`, 2 columns on `640px - 991px`, 3 columns on `>= 992px`.
- `.grid-4`: 1 column on `< 576px`, 2 columns on `576px - 991px`, 4 columns on `>= 992px`.
- `.stats`: 2 columns on `< 768px` (2x2 grid instead of tall 1x4 stack), 4 columns on `>= 768px`.
- Card image ratios: `16 / 10` with `object-fit: cover`.
- Card tags & metadata: Ensure minimum font size is `0.8rem` (12.8px–13px) and pills have adequate tap/visual clearance.

### 3.4 Tables (`src/app/admin/(dash)/[collection]/page.tsx`)
- Wrap table in Bootstrap 5.3 `.table-responsive` container with smooth horizontal scrolling and subtle fade indicators.
- Responsive mobile card view on `< 640px`: display rows as stacked card-like blocks with clear label/value pairs and full-width action buttons.
- Prevent UUID / slug overflow with `word-break: break-all;` and `font-size: 0.85rem`.

### 3.5 Forms (`ContactForm.tsx`, admin forms)
- Input font size: `font-size: 1rem (16px)` to guarantee no iOS Safari auto-zoom.
- Input height: `min-height: 48px;` for effortless fingertip selection.
- Clear `:focus-visible` styling using brand accent glow.
- Stacking layout: full width on mobile, responsive row on desktop.

### 3.6 Modals (`Lightbox.tsx`)
- Responsive padding: Reduce mobile horizontal padding from `60px` to `12px` so images take full available width.
- Close button: `48px × 48px` positioned with safe-area clearance.
- Touch gesture: Support swipe left/right to change slide, swipe down to close.
- Thumbnail strip: Smooth momentum horizontal scrolling (`-webkit-overflow-scrolling: touch`).

### 3.7 Site Footer (`SiteFooter.tsx` & `globals.css`)
- Social icons: Upgrade target size to `44px × 44px`.
- Links: Increase hit area to `padding: 6px 0; min-height: 40px; display: inline-flex; align-items: center;`.
- Columns: 1 column on `< 576px`, 2 columns on `576px - 991px`, 4 columns on `>= 992px`.
- Map embed: 100% width, responsive aspect ratio.
- Footer bottom: `flex-direction: column` on mobile with centered text and adequate line spacing.

---

## 4. Breakpoint Verification Matrix

| Breakpoint | Target Device | Navigation | Grid Layout | Touch Target Min | Max Content Width |
|---|---|---|---|---|---|
| **320px** | iPhone SE (1st gen) | Drawer (full width) | 1 col (100%) | 44px | 100% (16px pad) |
| **375px** | iPhone SE (2/3) | Drawer (full width) | 1 col | 44px | 100% (16px pad) |
| **390px** | iPhone 12/13/14/15/16 | Drawer (full width) | 1 col / 2 col stats | 44px | 100% (20px pad) |
| **414px** | iPhone Plus / Max | Drawer (full width) | 1 col / 2 col stats | 44px | 100% (20px pad) |
| **768px** | iPad (portrait) | Drawer (`< 992px`) | 2 col | 44px | 720px |
| **1024px** | iPad Pro / Laptop | Horizontal navbar | 3 col / 4 col stats | 40px (desktop) | 960px |
| **1440px** | Desktop (HD) | Horizontal navbar | 3-4 col | 36-40px | 1140px |
| **1920px** | Large Monitor | Horizontal navbar | 3-4 col | 36-40px | 1140px (centered) |

---

## 5. Implementation Strategy

1. **Dependencies**: Install `bootstrap@5.3.3`.
2. **Core CSS**: Update `globals.css` with Bootstrap 5.3 utilities import and responsive design enhancements.
3. **Header**: Enhance `SiteHeaderClient.tsx` for `< 992px` mobile drawer, touch targets, and accessible backdrop.
4. **Hero Carousel**: Enhance `HeroCarousel.tsx` with touch swipe and 44px dot touch areas.
5. **Lightbox**: Enhance `Lightbox.tsx` with mobile-first padding, 48px close button, and responsive controls.
6. **Footer**: Enhance `SiteFooter.tsx` and `.site-footer` for 44px touch targets and responsive column stacking.
7. **Tables**: Enhance admin collection page with `.table-responsive` and mobile-friendly stacking.
8. **Verification**: Verify Next.js build (`npm run build`), TypeScript typecheck (`npm run typecheck`), and verify responsiveness across all 8 breakpoints.
