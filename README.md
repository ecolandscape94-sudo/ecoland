# Eco Landscapes & Gardening Ltd

A premium white-and-green website for a Rwanda-based landscaping, gardening and nursery company. Built with Next.js 16 App Router, React, strict TypeScript, Tailwind CSS and Lucide icons.

**Corrected infrastructure:** Google Sheets stores content and inquiries; Cloudinary stores photos; Vercel hosts the application. No PostgreSQL or Prisma setup is required.

## Run locally

Use Node.js 22 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. To use another port, run `npm run dev -- --port 3100` and update `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` accordingly.

The public pages use the supplied company profile for company history, mission, vision, nursery operations, contact details and completed-work references. Stock photography is clearly labelled while company photographs are pending. Six case-study drafts and twenty plant drafts are available for seeding and remain hidden until approved and published. Submissions and staff login do **not** pretend to work without configuration.

## Google Sheets database

1. Create a Google Cloud project and enable the Google Sheets API.
2. Create a service account and its JSON key. Keep the key out of Git and browser code.
3. Create a **private** Google Sheet. Share it as Editor with the service account email only, alongside trusted company owners. Do not enable “anyone with the link”.
4. Set `GOOGLE_SHEETS_ID` to the ID from the Sheet URL, `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the key’s `client_email`, and `GOOGLE_PRIVATE_KEY` to its `private_key`. Newlines can be literal or escaped `\n`.
5. Run `npm run sheets:setup` locally with `.env.local` configured. The script creates missing worksheets, initializes empty worksheets and preserves existing nonempty data. Re-running it does not replace edits.

Worksheets: `projects`, `plants`, `services`, `inquiries`, `testimonials`, `sections`, `settings`, `audit`. All use four columns: `id`, `data`, `createdAt`, `updatedAt`. The `data` column contains a validated JSON record. Related project images and inquiry attachments stay in the parent JSON record. All writes use `RAW`, preventing spreadsheet formula execution from submitted text.

Manage records through `/admin`, rather than editing JSON or reordering rows manually. Back up the Sheet. Public content reads are cached for 60 seconds to reduce API usage; CMS saves invalidate public caches immediately. Staff and inquiry reads are never cached. Google Sheets has no transactions or conflict resolution: avoid simultaneous edits to the same record or manual deletion/reordering during website writes. See [architecture](docs/ARCHITECTURE.md).

## Administrator setup

1. In Google Cloud, configure the OAuth consent screen and create a **Web application** OAuth client. The OAuth client is separate from the Sheets service account.
2. Add `http://localhost:3000` as an authorized JavaScript origin and `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Add your final production domain and equivalent callback before deploying.
3. Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_URL`.
4. Generate `AUTH_SECRET` locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and place it in `.env.local` and Vercel secrets. Never commit it.
5. Set `ADMIN_EMAILS` to a comma-separated list of approved Google account emails. Optionally set `EDITOR_EMAILS` for content editors. Google must report the email as verified.
6. Visit `/admin/login` and sign in. If the Google app is in testing, add the accounts as test users in the consent-screen configuration.

Administrators manage all content, settings and inquiries. Editors manage projects, plants, services, sections and approved testimonials, but cannot read inquiries or change contact settings. Every API route checks authorization on the server. Session cookies and OAuth state/CSRF controls are supplied by Auth.js. Removing an address from the allowlist revokes authorization on the next request. Sessions expire after 8 hours. Auth.js v5 is pinned to its current beta release; repeat the dependency audit when upgrading.

The package manifest overrides Auth.js’ optional Nodemailer peer range to the patched SMTP version. Google OAuth does not use Auth.js email sign-in; inquiries use Resend.

## Cloudinary

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. Use the staff editor’s upload control to add JPG, PNG or WebP photographs up to 4 MB. Uploads are signed on the server, require staff authentication, check file magic bytes and never expose the secret. No unsigned preset is needed. Main images, project galleries and before/after photos are supported. Website images use Next.js responsive image optimization.

Inquiry attachments accept up to 3 photographs of 1 MB each so the full request fits Vercel’s request-body limits. They are uploaded as **authenticated** assets; their URLs are not returned to the public. Staff access them through a protected route using short-lived Cloudinary download signatures. The private upload flow and account feature availability must be tested with the actual Cloudinary account. Confirm your privacy requirements and retention policy before collecting customer photographs.

Bundled sample photographs are clearly labelled illustrative. Their sources are documented in [image sources](public/images/SOURCES.md). Replace them with approved company imagery through the CMS. The navigation uses the actual landscape emblem extracted from the supplied profile letterhead. The original profile PDF is available as a download; a higher-resolution standalone logo can replace the raster emblem when supplied.

## Inquiries, email and spam protection

Set `RESEND_API_KEY` and `INQUIRY_NOTIFY_EMAIL` in `.env.local` for local development and in the production host’s environment settings. `RESEND_FROM` defaults to Resend’s `onboarding@resend.dev` test sender; for production, verify a sending domain in Resend and set `RESEND_FROM` to an address on that domain. Notification messages contain inquiry details; attachments stay in the staff dashboard.

Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for an Upstash Redis database. This stores temporary counters only, **not** website or inquiry records. Vercel public writes and sign-in endpoints fail closed without shared rate limiting. Development uses in-memory counters. The form uses a honeypot, origin checks, strict server validation, bounded uploads and atomic per-IP limits. Staff writes and uploads have separate limits.

An inquiry is saved before email is attempted. Notification states are `pending`, `sent`, `failed` and `unconfigured`. If Resend fails, the inquiry remains saved and staff can retry the notification. A rare status-write failure leaves `pending` for review. Retries may send a duplicate email; review before retrying. A storage failure returns an error, never a success message. If a connection drops after Google accepts a write, its outcome can be uncertain; check the dashboard before resubmitting.

## Journal and Airtable

The public journal is available at `/blog`. It reads the `Title`, `Date`, `image`, `Content`, and `Published` fields from the configured Airtable table. Only records with `Published` checked and a title and content appear; the page and article routes refresh cached Airtable data every 60 seconds. Keep `AIRTABLE_TOKEN` server-only, with read access to this base, and set `AIRTABLE_BASE_ID` and `AIRTABLE_TABLE_ID` from `.env.example`. Article images are served through a server route so Airtable attachment URLs and the API token never appear in page markup. Set all three Airtable values in the production host as well as local `.env.local`.

## Content management

- **Projects:** add approved title, unique slug, category, description, location and scope/results when verified. Upload company photographs; add gallery captions. Use matching before/after photographs of the same site. Choose `published` only after approval; `archived` hides content without deleting it.
- **Plants:** verify the species, common/botanical name, photograph, description and growing conditions. Add sizes/availability only when provided by the nursery. No prices or inventory counts are seeded. Publish after approval.
- **Services:** edit descriptions, images, benefit lists and FAQs. JSON field examples are shown in the editor.
- **Sections:** `hero` controls the company name over the homepage background photograph, introductory copy and image; `about` controls the introduction and company story. Retain these IDs. Choose the company photograph source only for approved genuine company images.
- **Testimonials:** require an attribution and explicit client approval before publishing. No testimonials are seeded.
- **Settings:** enter verified email, telephone, international WhatsApp digits, address, company profile PDF HTTPS URL, Instagram/LinkedIn links and site SEO description. Unconfigured contact buttons remain hidden. An address map is intentionally omitted until the office/nursery location is verified.
- **Inquiries:** filter by service/status, review private attachments, add internal notes, update New → Contacted → In Progress → Closed, and retry failed notifications.
- **Audit:** staff save attempts and completed edits are logged to the audit worksheet; recent activity is visible to administrators.

## Vercel deployment

1. Import this project’s GitHub repository into Vercel. If the repository contains multiple apps, select `ecoland` as the Root Directory.
2. Select the Next.js framework preset and a supported Node.js version (22 or newer). The build command is `npm run build`; Vercel manages the output directory. No custom `vercel.json` is required.
3. Set all provider environment variables from `.env.example` in Vercel’s project settings, including the Airtable token, base ID and table ID. Set `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` to your final HTTPS domain. Add the matching Google OAuth callback URI.
4. Initialize the Sheet using the local setup script before enabling submissions. Verify the Google account allowlists and Redis connection.
5. Set all required production environment variables, including the Resend API key, verified sender and recipient. Deploy, then test Google staff sign-in, content edits, public cache invalidation, Cloudinary upload/private attachments, a real inquiry and notification delivery. Keep client projects/plants in draft until their content is approved.
6. Configure your custom domain, Search Console verification and sitemap submission. Optional `NEXT_PUBLIC_GA_ID` enables analytics only after consent. Inquiry conversion events are sent only after a successful saved submission.

Preview deployments need their own OAuth callback configuration and environment scope. Never use public environment-variable prefixes for secrets. Public preview access does not grant staff access.

## Verification

```powershell
npm test
npm run typecheck
npm run build
npm audit
```

Automated tests cover invalid/spam inquiries, image signatures, origin checks, limits, safe seed content, corrupt Sheet rows, image URL restrictions, RAW writes, row updates, unique slugs and inquiry/email failure semantics using mocked provider transports. Live Google OAuth, real Sheet writes, actual Cloudinary uploads and Resend delivery need configured credentials; they have not been claimed as verified. See [QA report](docs/QA.md) for browser and HTTP checks.

## Pending client information

Approved company, project and nursery photographs; six detailed case studies with approved scopes/results; verified catalogue details for twenty plants; a confirmed WhatsApp number; exact office/nursery map coordinates; approved testimonials if available; final privacy notice/retention policy; provider credentials and production domain. The supplied profile provides the logo, history, mission, vision, head-office address, telephone, email and completed-work reference directory. See [profile source audit](docs/PROFILE_CONTENT.md). Named projects are displayed as profile references, with no invented case-study details or endorsements.

English content and structured records are separated from the components to make future Kinyarwanda localization possible. A language switcher and translated content are not implemented.

Official integration references: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Google Sheets values](https://developers.google.com/workspace/sheets/api/guides/values), [Cloudinary uploads](https://cloudinary.com/documentation/upload_images), [Auth.js Google](https://authjs.dev/getting-started/providers/google), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
