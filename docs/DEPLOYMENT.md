# Deployment & Client Handoff

How to take this project from demo to production.

## 1. Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository in the Vercel dashboard.
3. Framework preset: **Next.js** (auto-detected).

Environment variables (project settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Production PostgreSQL connection string |
| `AUTH_SECRET` | `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

4. Deploy. After the first successful deploy, apply the schema to the
   production database:

   ```bash
   npx prisma db push   # or: npx prisma migrate deploy
   npx prisma db seed   # only once, if you want demo data
   ```

   > Recommend using the Vercel CLI for the first `db push` against production,
   > or run it from CI with the production `DATABASE_URL`.

## 2. Configure the payment gateway

1. Create a merchant account with the chosen provider (for an Egyptian business,
   e.g. **Paymob**; availability must be verified with the provider).
2. Use sandbox credentials during development.
3. Set on Vercel:
   - `PAYMENT_PROVIDER=paymob`
   - `PAYMOB_API_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_INTEGRATION_ID`
4. Configure the webhook URL in the provider dashboard:
   `https://your-domain.com/api/payments/webhook`
   - The webhook handler must verify the HMAC signature and be idempotent.
5. Only then can bookings move from `PAYMENT_PENDING` to `CONFIRMED`
   server-side. **Do not claim payments work until this is tested end-to-end.**

## 3. Configure email

- `EMAIL_PROVIDER=resend` (needs `RESEND_API_KEY`) or `smtp`
  (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- Emails: welcome, verification, password reset, booking confirmation, payment
  confirmation, cancellation, refund.

## 4. Add rooms & change prices

Admin → Rooms → Add room / Edit. Fields: name (EN/AR), slug, description,
size, bed type, max guests, view, image, price per night, currency, active.
The price is also written to the room's `Rate` record.

## 5. Manage bookings

Admin → Bookings → filter by status/search → open a booking → update status.
Valid transitions are enforced by the UI (e.g. `CONFIRMED → CHECKED_IN →
CHECKED_OUT`).

## 6. Refunds

Refunds require a payment provider and are executed through the provider
abstraction. The `Refund` model is ready; the admin refund UI is not yet
exposed. Refunds must go through the gateway and be recorded with a provider
transaction ID.

## 7. Edit homepage / gallery / content

Content is stored in `SiteSetting` (text) and `Page` (structured content).
A no-code editing UI is the next milestone. Until then, text changes go through
`prisma/seed.ts` or Prisma Studio (`npm run db:studio`). Real hotel imagery
replaces the `/media/demo/*.svg` placeholders.

## 8. Staff & permissions

- Staff accounts live in the `Staff` table with a `Role`.
- Roles: `SUPER_ADMIN`, `HOTEL_MANAGER`, `RESERVATION_MANAGER`, `RECEPTION`,
  `CONTENT_EDITOR`, `ACCOUNTANT`.
- Permissions are enforced server-side on every admin API route.
- Google login never grants admin access.

## 9. SEO

- Titles/descriptions per page; structured data (Hotel schema) can be added
  per room (`Room` model is product-like).
- `sitemap.xml` and `robots.txt` are generated automatically.

## 10. Backups

PostgreSQL: enable daily backups (provider-level) or `pg_dump`:

```bash
pg_dump "DATABASE_URL" > backup_$(date +%F).sql
```

## 11. Security checklist

- [ ] `AUTH_SECRET` is a long random value, not the default
- [ ] No secrets in the repo (`.env` gitignored)
- [ ] Webhook HMAC verified
- [ ] Rate limiting on auth/booking routes (scaffolded in `lib/rate-limit.ts`
      — enable before launch)
- [ ] HTTPS enabled (Vercel default)
- [ ] Staff passwords are strong
- [ ] Admin emails/roles reviewed before launch

## 12. Before launch — hotel must provide

- Real name, address, contact details, photos/video
- Real room categories, inventory and prices
- Payment merchant account + credentials (sandbox → production)
- Email provider account
- Cancellation/refund policy text
- Privacy policy + terms text
- Google OAuth client (optional)
