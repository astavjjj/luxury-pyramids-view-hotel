# Luxury Pyramids View Hotel

A production-oriented hotel website and booking platform for a luxury hotel in
Giza, Egypt, with a focus on the Pyramids View.

> **STATUS: DEMO** — This repository currently contains clearly-marked demo data
> (rooms, prices, contact details, an admin account). No real hotel information,
> real prices, real availability, or payment credentials are present. The hotel
> must supply production data and credentials before launch.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- PostgreSQL · Prisma 6
- Zod · React Hook Form
- jose (signed session cookies) · bcryptjs
- Motion (animations) · Three.js / React Three Fiber (3D-ready)
- i18n: English + Arabic (RTL)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create the database and configure environment
cp .env.example .env   # set DATABASE_URL, AUTH_SECRET, etc.
npm run db:push        # apply the schema
npm run db:seed        # load DEMO data (rooms, offers, admin account)

# 3. Run
npm run dev            # http://localhost:3000
```

Demo admin login: `admin@example.com` / `ChangeMe123!` at `/admin`.

## Environment variables

See `.env.example`. Required locally:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — 32+ char random secret (signed sessions). Generate with
  `openssl rand -base64 48`.

Optional integrations (empty = disabled):

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth/OIDC customer sign-in
- `EMAIL_PROVIDER` (console | resend | smtp) + provider keys
- `PAYMENT_PROVIDER` (manual | paymob) + Paymob keys
- `MEDIA_STORAGE` (local | s3) + S3 keys

**Never commit real secrets.** `.env` is gitignored.

## Pages

| Route | Description |
| --- | --- |
| `/` | Cinematic homepage (hero, rooms preview, Pyramids storytelling) |
| `/rooms`, `/rooms/[slug]` | Room catalogue + detail (amenities, availability, price) |
| `/suites` | Signature suites |
| `/offers` | Seasonal offers & packages |
| `/spa`, `/dining`, `/experiences`, `/gallery`, `/about`, `/contact`, `/location` | Editorial pages |
| `/booking` | Availability search (server-verified) |
| `/booking/checkout` | Guest details + price breakdown |
| `/booking/confirmation/[id]` | Reservation confirmation |
| `/auth/login`, `/auth/register` | Customer accounts |
| `/account`, `/account/bookings/[id]` | Customer reservations |
| `/admin` | Staff dashboard (rooms, bookings, statuses) |

## What is implemented

- **Real database schema** (users, staff, roles, rooms, rates, bookings, items,
  payments, refunds, offers, media, pages, settings, audit logs).
- **Server-verified availability**: availability and pricing are computed
  server-side; the client never decides what is bookable.
- **Booking engine** with persistent records, historical prices, statuses, and a
  transactional write that creates the booking + payment record.
- **Customer auth**: register / login / logout with bcrypt + signed HTTP-only
  session cookies.
- **Staff auth + RBAC** and an admin dashboard for rooms and bookings with
  status workflows (PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT, etc.).
- **i18n** EN/AR with RTL.
- **SEO**: metadata, sitemap.xml, robots.txt.

## What still requires the client / credentials (NOT faked)

- **Payments.** The payment abstraction is scaffolded and bookings are created as
  `PAYMENT_PENDING`. Confirming a booking after real payment requires a payment
  provider account (e.g. Paymob for an Egyptian business), sandbox credentials,
  and webhook signature verification. No payment is claimed to work until that
  integration is configured and tested.
- **Google login.** The OAuth architecture exists; real sign-in needs Google
  Cloud OAuth credentials.
- **Transactional email.** The email abstraction exists; sending real mail needs
  a provider key.
- **Object storage.** Local storage is used; S3 requires bucket credentials.
- **Real hotel data** (name, address, prices, room inventory, photos, contact
  details). Current content is clearly marked demo.

## Scripts

- `npm run dev` / `build` / `start` / `lint` / `typecheck`
- `npm run db:push` / `db:migrate` / `db:seed` / `db:studio`

## Deployment

Vercel + GitHub recommended:

1. Push to GitHub, import into Vercel.
2. Provision PostgreSQL (e.g. Neon / Supabase / Vercel Postgres) and set
   `DATABASE_URL`.
3. Set `AUTH_SECRET` (and other secrets) in the Vercel project env.
4. Deploy, then run `npm run db:push` against the production database.

See `docs/DEPLOYMENT.md` for the client handoff guide.
