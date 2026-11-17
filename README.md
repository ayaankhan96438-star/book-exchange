# Home-run Book Exchange (Next.js)

A responsive website for a **small, home-run book exchange**. Readers browse the non-fiction catalog online and can reserve books for 48 hours. There is no public storefront, delivery, courier service, online payment, or customer login. After a reservation, the owner contacts the customer on WhatsApp to confirm an exact meeting time and a public meeting place. Only the general area is shown on the website.

## Business rules implemented

- **Non-fiction only:** We accept self-help, finance, business, biography, history, religion and spirituality, science, health, education and study, politics, and other non-fiction. No novels or story books.
- **1 book brought = 1 book taken.** Customers may choose any available non-fiction title, even one with a higher retail value; there is no per-book price balancing. They may reserve no more books than the number they say they are bringing. The admin panel requires final counts to match before an exchange can be marked complete.
- Flat **₹100 per exchange**, whether 1 book or 10. Cash or UPI is collected at the agreed public exchange point.
- Maximum **10 books per exchange**.
- Reservations are held for **48 hours**. The owner messages the customer on WhatsApp within a few hours to arrange the time and public meeting place.
- **Home-run, in-person exchange only:** no public storefront address, opening hours, maps, delivery, courier, online payment, or customer login.
- Customers can browse the catalog online, reserve books, and arrange the exchange by WhatsApp. The website displays only a general area; exact meeting details are shared privately after reservation.

## Tech stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, lucide-react, Prisma ORM 6, PostgreSQL (Supabase-compatible), Cloudinary signed image uploads, and `next/font` (Playfair Display + Inter).

## 1. Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended)
- npm
- A PostgreSQL database (for example, a Supabase project)
- A Cloudinary account for admin cover uploads (optional until you upload covers)

## 2. Install and configure

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set:

- `DATABASE_URL`: Supabase PostgreSQL runtime connection string (the shared transaction-mode pooler is commonly port 6543). `DIRECT_URL`: Supabase session/direct connection for Prisma migrations (commonly port 5432). The Prisma datasource is configured to use `DIRECT_URL` for migration commands. Ensure SSL is enabled where required.
- `ADMIN_PASSWORD`: a strong, unique admin password.
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters. Example generator: `openssl rand -base64 48`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: needed for signed cover uploads.
- `NEXT_PUBLIC_BRAND_NAME`: the exchange name displayed on the site. The config still accepts legacy `NEXT_PUBLIC_SHOP_NAME` as a fallback for existing installations; new deployments should use `NEXT_PUBLIC_BRAND_NAME`.
- `NEXT_PUBLIC_AREA`: the broad neighborhood, suburb, or city area displayed publicly. The config falls back to legacy `NEXT_PUBLIC_CITY` if `NEXT_PUBLIC_AREA` is not set. Do not put a home address or precise meeting location here.
- `NEXT_PUBLIC_OWNER_NAME`: the name shown in the About me section on `/exchange-point`.
- `NEXT_PUBLIC_ABOUT`: a short owner introduction shown on `/exchange-point`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number using digits with country code, without `+` or spaces.
- `NEXT_PUBLIC_PHONE_NUMBER`: phone number for the call button, with country code.
- `NEXT_PUBLIC_INSTAGRAM_URL`: optional Instagram profile URL.
- `NEXT_PUBLIC_SITE_URL`: production origin for sitemap and robots metadata (for example, `https://your-domain.in`).

The default brand name is **PageTurn Exchange**. The area, owner name, and About me text have safe fallback copy until configured. Remove any old street-address, opening-hours, and map settings from your local environment and hosting settings; this version does not use them.

For commands executed by Prisma locally, Prisma CLI reads `.env` by default. Either duplicate the database URLs in a local `.env` file (do not commit it) or prefix Prisma commands with the required environment variables.

## 3. Set up the database

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

For local schema development instead of applying checked-in migrations:

```bash
npx prisma migrate dev --name init
```

The initial migration is in `prisma/migrations/20261117000000_init/`; the optional book ISBN column is added by `prisma/migrations/20261117010000_add_book_isbn/`. The seed script inserts 12 non-fiction sample titles with ISBNs and Open Library cover URLs. It also removes the six legacy fiction sample IDs (`seed-9780062315007`, `seed-9780547928227`, `seed-9780141439518`, `seed-9780451524935`, `seed-9780060935467`, `seed-9780590353427`) before upserting. A legacy title linked to any pending reservation is skipped with a warning; rerun `npm run db:seed` after that reservation is completed or cancelled to remove it. The server-side admin API rejects genres outside the allowed non-fiction list.

Inspect data with:

```bash
npm run db:studio
```

## 4. Run locally

```bash
npm run dev
```

Open <http://localhost:3000>.

If there is no working database connection, the public home and catalog pages render a preview catalog. Reservation creation and admin inventory operations require a configured, migrated PostgreSQL database.

## 5. How to add and manage books

1. Open `/admin`.
2. Sign in using `ADMIN_PASSWORD`.
3. Open the **Books** tab.
4. Optionally enter an ISBN-10 or ISBN-13 and click **Fetch details**. The server looks it up through Open Library and fills the title, author, and cover URL when available. If no record is found, the form shows **Not found, enter manually**. The ISBN is saved with the book, and all fields remain editable before saving.
5. Choose one of the allowed non-fiction genres, then enter or review the condition, status, and cover URL; or use **Upload cover to Cloudinary** after configuring Cloudinary credentials.
6. Click **Add book**. Use the edit icon to change details, the status menu to change availability, or the delete icon to remove a listing.

Only books with status `available` appear in the public catalog. A reserved book is hidden until its reservation is completed, cancelled, or expired.

## 6. How to handle reservations and public meetups

1. Open `/admin` and sign in.
2. Review the **Reservations** tab. It lists the customer name, phone, WhatsApp link, books they are bringing, books reserved, and time remaining.
3. Contact the customer on WhatsApp within a few hours to agree on a time and a public meeting place. Do not publish a home address or private meeting details on the website.
4. At the agreed exchange point, count the books brought and confirm the selected books. If the customer reserved fewer books than they are bringing, use the **Add to reservation** control to add available titles until the counts match. The admin UI highlights count mismatches and disables completion unless the counts match.
5. Click **Mark completed**. The app creates an `Exchange` row with the number of books and a ₹100 fee, then marks those reserved books as `taken`.
6. Collect ₹100 in cash or UPI at the exchange. The website does not process payments.
7. Use **Cancel** if the customer does not proceed; the books are released to `available`.

## 7. Deployment to Vercel

1. Push this project to a GitHub repository. Do not commit `.env`, `.env.local`, passwords, or Cloudinary secrets.
2. In Vercel, choose **Add New → Project**, import the repository, and keep the Next.js build settings.
3. In **Project → Settings → Environment Variables**, add all production variables from `.env.example`, using real values. Set the brand name, general area, owner name, About me text, WhatsApp number, phone number, optional Instagram URL, `NEXT_PUBLIC_SITE_URL`, database URLs, admin secrets, and Cloudinary credentials. Do not configure a street address, opening hours, or Google Maps URL.
4. For Supabase, copy PostgreSQL connection strings from the project's **Connect** panel. Use an appropriate session/direct connection for migrations and a transaction pooler URL for runtime when required. Keep SSL enabled where required.
5. Apply migrations against the production database before, or as part of, the deployment release:

   ```bash
   npx prisma migrate deploy
   ```

   This can be run locally with the production database URLs set temporarily, or in a controlled CI/release job. Do not use `prisma migrate dev` against production.

6. Seed the sample catalog only if you want the sample books in production:

   ```bash
   npm run db:seed
   ```

7. Deploy from Vercel. The `build` script runs `prisma generate && next build`.
8. After deployment, test `/`, `/catalog`, `/reserve`, `/exchange-point`, the legacy `/visit` redirect, and `/admin`. Create a test reservation and verify expiry/cancel/complete actions before sharing the website.


## 9. Rendering and image performance

- The home and catalog routes use 60-second Incremental Static Regeneration (ISR); book-detail routes use the same 60-second revalidation interval. Admin book/reservation mutations invalidate the home, catalog, and book-detail route caches. New customer reservations also invalidate availability-dependent pages.
- Reservation expiry remains enforced by `releaseExpiredReservations()` when the catalog/home data regenerates and in the admin dashboard/actions. The dashboard refreshes public cache output if it releases expired books.
- Open Library covers are requested in medium (`-M`) size. Existing stored `-L` URLs are converted to `-M` for display. Next Image negotiates AVIF/WebP and caches remote images for 30 days. The first four cards in the featured/catalog lists are prioritized; remaining covers are lazy-loaded against a cream background.
- A new migration adds the standalone `Book.status` index. The initial migration already defines the `Book.genre` and `Reservation(status, expiresAt)` indexes. Apply it with `npx prisma migrate deploy`.
- The local-storage reserve list reads and writes only in effects. Admin reservation date labels and countdowns are calculated after mount to avoid locale/time hydration differences.

## 10. Important launch checks

- Replace the default brand, area, owner name, About me text, and placeholder contact values.
- Display only a broad area publicly. Agree on an exact time and a public meeting place with each customer on WhatsApp after reservation.
- Ensure real book cover URLs are publicly accessible, or use Cloudinary signed uploads.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`; do not share the admin password with customers.
- Set restrictive Supabase network/database permissions and keep the database connection string secret.
- This project intentionally has no customer login, shipping, delivery, online payment, or public storefront address.
- The seeded Open Library cover endpoints are sample assets; replace any cover with a verified photo/URL of the exact physical copy in the collection.
