# Book Exchange

A small, home-run non-fiction book exchange in Krishna Nagar, Delhi. This is an in-person exchange only; books are not delivered or couriered.

## Business rules

- One book in, one book out.
- Flat Rs 100 per exchange, payable in cash or by UPI at the exchange.
- Maximum 10 books per exchange.
- Non-fiction only: self-help, finance, business, biography, history, religion and spirituality, science, health, education and study, politics, and other non-fiction. No novels or story books.
- Exchange address: **H6, Krishna Nagar, Delhi 110051**.
- Exact time is confirmed on WhatsApp.
- WhatsApp: `919643833192`.
- Instagram: <https://www.instagram.com/whoisbombastic/>.

The prompt did not include a final brand name, so the code defaults to **Book Exchange**. Set `NEXT_PUBLIC_BRAND_NAME` to the chosen brand name when it is confirmed.

## Tech stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, lucide-react, Prisma ORM 6, PostgreSQL (Supabase-compatible), Cloudinary signed image uploads, and `next/font` (Inter + Playfair Display).

## Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended)
- npm
- A PostgreSQL database (for example, Supabase)
- Cloudinary account for signed cover uploads (optional until you upload covers)

## Install and configure

```bash
npm install
cp .env.example .env.local
```

Set the variables below in `.env.local` for local development and in Render's **Environment** settings for production.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL runtime connection string (Supabase transaction pooler is commonly port 6543) |
| `DIRECT_URL` | PostgreSQL session/direct connection used by Prisma migrations (commonly port 5432) |
| `ADMIN_PASSWORD` | Strong, unique password for `/admin` |
| `ADMIN_SESSION_SECRET` | Random secret of at least 32 characters; generate with `openssl rand -base64 48` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for signed cover uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret; server-only |
| `NEXT_PUBLIC_BRAND_NAME` | Brand name; defaults to `Book Exchange` until replaced |
| `NEXT_PUBLIC_AREA` | Public area; defaults to `Krishna Nagar, Delhi` |
| `NEXT_PUBLIC_CITY` | City; defaults to `Delhi` |
| `NEXT_PUBLIC_ADDRESS` | Exchange address; defaults to `H6, Krishna Nagar, Delhi 110051` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number in digits only; defaults to `919643833192` |
| `NEXT_PUBLIC_PHONE_NUMBER` | Click-to-call number; defaults to `+919643833192` |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram profile; defaults to the supplied `whoisbombastic` profile |
| `NEXT_PUBLIC_OWNER_NAME` | Optional owner label shown on the Exchange Point page |
| `NEXT_PUBLIC_ABOUT` | Optional short introduction shown on the Exchange Point page |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical production URL, such as the Render service URL |

**Important for Render:** every `NEXT_PUBLIC_` variable is embedded into the app at build time. After changing any `NEXT_PUBLIC_` value in Render, use **Manual Deploy → Clear build cache and deploy** so the updated values are baked into the new build. Do not put `.env`, `.env.local`, database passwords, admin credentials, or Cloudinary secrets in GitHub.

For Prisma CLI commands, Prisma loads `.env` by default. For local database work, keep the connection strings in an untracked `.env` file, or copy them into `.env` from `.env.local` without committing the file.

## Database setup

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

The migrations add the book ISBN field, book lookup indexes, and reservation lookup indexes. The seed contains 12 non-fiction titles and uses Open Library medium (`-M`) covers. It removes the legacy seeded fiction IDs when those titles are not attached to a pending reservation.

To remove the old seeded fiction entries from an existing database safely (skips any book linked to a pending reservation):

```bash
npm run db:remove-legacy-fiction
```

Do not run `prisma migrate dev` against the production database. Use `prisma migrate deploy` for checked-in migrations.

## Run locally

```bash
npm run dev
```

Open <http://localhost:3000>.

Useful checks:

```bash
npm run build
npx prisma migrate status
```

The lightweight health route is `/api/health` and returns HTTP 200 with `{ "status": "ok" }`.

## Admin and reservation workflow

1. Open `/admin` and sign in with `ADMIN_PASSWORD`.
2. In **Books**, add or edit a book. The genre selector only offers the allowed non-fiction genres, and the API validates the genre again on the server.
3. ISBN lookup uses Open Library. Covers are stored as Open Library medium (`-M`) URLs or uploaded to Cloudinary.
4. Customers select available books and reserve up to 10. The server holds the books for 48 hours.
5. At the in-person exchange, the number of books brought must equal the number of books taken. The admin can add available books to the reservation before completing it.
6. Mark the reservation completed. The app records an `Exchange` row with the book count and Rs 100 fee, then marks the books as taken.
7. Collect Rs 100 in cash or by UPI at the exchange. The website does not process payments.
8. Cancelling a pending reservation releases reserved books. Expired reservations are released by the existing 48-hour expiry helper.

## Render deployment

1. Connect the GitHub repository to a Render **Web Service** (not a Static Site).
2. Use branch `main`, runtime **Node**, and the **Free** instance if desired.
3. Build command: `npm install && npm run build`.
4. Start command: `npm start`.
5. Add every production variable from `.env.example` in Render's **Environment** section, using real values. Never paste secrets into the repository.
6. Apply any new database migrations to the same Supabase database with `npx prisma migrate deploy` before relying on the updated code. This update adds `20261117030000_add_reservation_lookup_indexes`.
7. Set `NEXT_PUBLIC_SITE_URL` to the actual Render service URL if you want canonical metadata and a sitemap URL.
8. Deploy. Keep **Auto-Deploy: On Commit** enabled so pushes to `main` trigger deployments.
9. For any changed `NEXT_PUBLIC_` variables, use **Manual Deploy → Clear build cache and deploy**.
10. After deployment, test `/`, `/catalog`, `/reserve`, `/exchange-point`, `/admin`, and `/api/health`. Create a test reservation and check the 48-hour hold, cancel, and completion workflow.

## Performance and rendering notes

- Home, catalog, and book detail pages use 60-second Incremental Static Regeneration.
- Admin book changes, reservation creation/actions, and expiration processing invalidate the home, catalog, and book-detail pages.
- Open Library cover URLs are normalized to medium (`-M`) size. Next Image negotiates AVIF/WebP and caches remote covers for 30 days.
- The hero illustration is local at `public/images/book-exchange-hero.svg`; no remote Unsplash hero request is needed.
- The first four book covers in the featured/catalog lists are prioritized; later covers use lazy loading.
- The reserve list reads and writes localStorage only in effects. Reservation-time labels are formatted after mount in effects to avoid locale-dependent hydration differences.

## Launch and privacy checks

- Confirm the display brand name and owner/About text before public launch.
- The exact address is displayed publicly because this exchange is explicitly based at H6, Krishna Nagar, Delhi 110051.
- Keep the database URL, admin password, admin session secret, and Cloudinary API secret private.
- Keep the Instagram and WhatsApp links current.
- Verify that every listed physical book is non-fiction and in good condition.
