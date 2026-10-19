# Architecture and implementation checklist

The corrected stack is Next.js App Router + strict TypeScript + Tailwind CSS, Google Sheets as the database, Cloudinary as image storage, Auth.js Google sign-in, SMTP notifications, and Vercel hosting. There is no PostgreSQL or Prisma dependency.

## Structure
- Public: `/`, `/about`, `/services`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/nursery`, `/contact`, `/privacy`.
- Staff: `/admin/login`, `/admin`; authenticated API handles project, plant, inquiry, service, testimonial, section and setting records.
- Server-only service account accesses private Sheets. Separate worksheets provide collections. Each row has `id`, `data` (validated JSON), `createdAt`, `updatedAt`. Nested images/attachments stay with their parent record. No public Sheet URLs or service account secrets are shipped to the browser.
- Google OAuth + explicit email allowlists provide administrator/editor roles. No shared demo credentials. The server checks roles on every administrative request.
- Cloudinary uploads are proxied through an authenticated Node route; size, magic bytes and file type are checked before a server-signed upload. Public attachments use the inquiry route with the same limits and are stored as authenticated Cloudinary assets.
- Upstash provides atomic rate limiting across Vercel instances. Local memory limits are development-only. Public writes fail closed on Vercel without rate-limit/storage configuration.
- Inquiry persistence happens before SMTP delivery. Delivery failures are recorded for staff retry.

## Material tradeoffs
Sheets is suitable for a modest catalogue and inquiry volume. It has quotas and no transactions or row-level locking. Staff should use the CMS; direct row deletion/reordering and simultaneous edits may conflict. Back up the Sheet and restrict sharing. A transactional database is advisable if volume or concurrent editing grows. Google OAuth, Cloudinary, Sheets API, SMTP and Redis accounts must be configured before live integration can be verified. Vercel and providers can incur usage charges. No account provisioning or deployment is claimed without credentials.

## Content policy
Six project drafts and twenty plant drafts are seeded, never automatically published. Stock photography is labelled illustrative, not company work. No unverified client endorsements, inventory, prices, figures, team biographies or location maps. Verified profile PDF and matching before/after images can be added via CMS.

## Checklist
- [x] Public pages, design system and mobile navigation implemented
- [x] Portfolio filtering, gallery, image comparison and nursery search implemented
- [x] Sheets adapter, setup script, safe drafts and CMS implemented
- [x] Auth.js, permissions, Cloudinary uploads and audit logging implemented
- [x] Validated inquiry persistence, spam protection and email retry implemented
- [x] SEO, analytics consent and accessibility foundations implemented
- [x] Production build, security/workflow tests and representative browser checks passed
- [x] Setup and deployment documentation
- [ ] Live provider integrations, populated-content acceptance and Vercel deployment

External acceptance checks remain pending until valid credentials and approved client content are supplied.
