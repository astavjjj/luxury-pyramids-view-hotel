# Project Plan — Luxury Pyramids View Hotel

This document records the architecture and roadmap. It is deliberately concise
and updated as the project evolves.

## 1. Requirements (summary)

A world-class luxury hotel website + booking platform for a Giza hotel with a
Pyramids View focus. It must feel editorial, calm and premium — not like a
generic tourism template. It must be a real product (persistent bookings,
server-verified availability, secure auth, admin + CMS), not a visual demo.

## 2. Architecture

```
UI (App Router, server + client components)
   │
   ▼
Services (auth, booking, availability, content)
   │
   ▼
Repositories (room, booking, user)
   │
   ▼
Prisma ORM ──► PostgreSQL
```

Integrations (email, payment, storage, OAuth) are provider-abstracted so the
app is never hard-coupled to one vendor.

## 3. Database model

Models (see `prisma/schema.prisma`):

- **Identity**: `User` (customers), `Staff` (staff, with `Role`), audit logs
- **Inventory**: `Room`, `Amenity`, `RoomAmenity`, `Rate`, `SeasonalRate`,
  `ClosedDate`, `Offer`
- **Bookings**: `Booking`, `BookingItem` (snapshot prices), `Payment`, `Refund`
- **Content**: `Page`, `SiteSetting`, `Media`
- **Social**: `Review`

Key design decisions:

- Booking items store the price paid at booking time — historical totals are
  never recomputed from today's rates.
- Booking statuses are an explicit enum with controlled transitions.
- Availability is derived from rates (closed dates, min/max stay) plus
  overlapping non-cancelled bookings.

## 4. Page map

Public: `/`, `/rooms`, `/rooms/[slug]`, `/suites`, `/offers`, `/spa`, `/dining`,
`/experiences`, `/gallery`, `/about`, `/contact`, `/location`, `/booking`,
`/booking/checkout`, `/booking/confirmation/[id]`, `/auth/login`,
`/auth/register`, `/account`, `/account/bookings/[id]`, `/privacy`, `/terms`,
`/cancellation-policy`.

Admin: `/admin/login`, `/admin` (dashboard), `/admin/rooms` (+ new/edit),
`/admin/bookings` (+ detail).

## 5. Feature map

| Area | Delivered | Notes |
| --- | --- | --- |
| Homepage | ✅ cinematic hero, rooms preview, Pyramids story | real client imagery later |
| Rooms/suites | ✅ | managed via admin |
| Availability | ✅ server-verified | dates, capacity, min/max stay, closed dates |
| Booking | ✅ persistent + transactional | price snapshot at booking time |
| Payments | 🔶 abstraction, PAYMENT_PENDING flow | gateway needs credentials |
| Customer auth | ✅ email/password sessions | Google OAuth scaffolded |
| Staff admin + RBAC | ✅ rooms + bookings + statuses | roles enum in DB |
| CMS | 🔶 content models exist | admin editing UI pending |
| i18n EN/AR | ✅ | RTL + locale cookie |
| SEO | ✅ metadata/sitemap/robots | |
| 3D | 📦 deps installed | used only when it serves the brand |
| Email | 🔶 abstraction | provider key needed |
| Reviews | 🔶 model exists | UI pending |

## 6. Authentication plan

- Register / login / logout (bcrypt, signed HTTP-only cookies via jose).
- Staff sessions separate from customer sessions.
- Google OAuth/OIDC scaffolded; admin is never granted from Google login.
- Server-side guards on every admin API route.

## 7. Booking plan

Search dates/guests → server availability check → select room → guest details →
server price calculation (rates + taxes + fees) → transactional create
(booking + items + payment) → PAYMENT_PENDING → (production) verified payment →
CONFIRMED → CHECKED_IN → CHECKED_OUT.

## 8. Payment plan

Provider abstraction (`PaymentProvider`) with `manual` and `paymob` configurable
via `PAYMENT_PROVIDER`. Webhooks must verify signatures, be idempotent, and the
booking is only confirmed after server-side payment verification. Sandbox
credentials only during development.

## 9. Admin plan

RBAC roles: SUPER_ADMIN, HOTEL_MANAGER, RESERVATION_MANAGER, RECEPTION,
CONTENT_EDITOR, ACCOUNTANT. Enforced server-side. Current UI covers dashboard,
rooms CRUD, bookings list + status workflows.

## 10. CMS plan

Content models (`Page`, `SiteSetting`, `Media`) support a no-code CMS with
DRAFT → PUBLISH. A content-editing UI is the next milestone.

## 11. Design system

- **Colors**: sand `#f5f1ea`, ink `#1a1815`, bronze `#a98a5f`, muted stone text.
- **Type**: Cormorant Garamond (display) + Inter (body).
- **Mood**: editorial, generous negative space, thin rules, letter-spaced
  eyebrows; no glassmorphism, no floating blobs, no random gradients.
- **Motion**: slow, controlled reveals; respects `prefers-reduced-motion`.

## 12. Roadmap

1. ✅ Scaffold + database + seed
2. ✅ Design system + storefront layout
3. ✅ Homepage + rooms + suites + editorial pages
4. ✅ Booking engine + account + auth
5. ✅ Admin dashboard + rooms/bookings management
6. ✅ i18n + SEO + verify build
7. 🔶 CMS editing UI
8. 🔶 Google OAuth, email, payment gateway (needs credentials)
9. 🔶 3D Pyramids element (optional, mobile fallback)
10. 🔶 Tests, security review, production audit, client handoff

Legend: ✅ done · 🔶 scaffolded/pending · 📦 installed
