# Verification report — 14 October 2026

## Company-profile redesign

The second design revision uses the supplied company profile, a full-width photographic welcome hero, original company branding, verified profile contact details, revised public pages and a source-based project directory. The production build, strict TypeScript and all 14 workflow tests passed again; all 27 local HTTP smoke checks passed again. The project reference filter was verified with 15 total references, 13 institutional, 1 commercial and 1 residential collective reference. The hero and navigation were reviewed at 1440px, 390px and 320px; no horizontal overflow or header overlap was observed. The nursery offering includes the profile's Paspalum turf grass information. See PROFILE_CONTENT.md for the source audit. Real photographs and live provider integration testing remain pending.

## Completed locally

- Production build: `npm run build`.
- Strict TypeScript: `npm run typecheck` (also part of production build).
- 14 automated workflow tests: `npm test`.
- 27 local HTTP smoke checks: `node scripts/smoke-test.mjs http://localhost:3100` with the dev server running. Covers all public pages, five service pages, metadata endpoints, anonymous staff access, private attachments, rejected origins, invalid inquiries and oversized submissions. This script submits no valid inquiries.
- Dependency audit: `npm audit`, zero known vulnerabilities after upgrading Auth.js and Nodemailer.
- Clean-install dependency resolution: `npm ci --dry-run --ignore-scripts` passed after a targeted optional peer override. This was a resolver check, not an actual delete/reinstall of node_modules.
- Desktop homepage reviewed at 1440 × 1000, including sample-photo loading and lack of horizontal overflow.
- Mobile homepage, service listing, service detail and contact layout reviewed; navigation menu opens and closes on route changes. Contact form reviewed at 390 × 844. No horizontal overflow observed in checked layouts.
- Service detail inquiry form carries the relevant service into its selector.
- Submitted a synthetic local inquiry without provider credentials. It returned HTTP 503 and displayed the missing-connection error; no false success state appeared and no inquiry/email was created.
- Nursery page displays its unpublished-catalogue empty state and contact CTA.

The unit tests use mocked Sheet transports and notification functions for critical persistence/failure behavior. They are not evidence of a live provider connection.

## Pending real accounts and approved content

Google OAuth sign-in and editor/admin role exercise; real Sheet initialization and CRUD; Cloudinary uploads and authenticated attachment downloads; SMTP delivery and retry; production Upstash counter operation; live Vercel deployment; verified WhatsApp/call/email links; populated nursery/portfolio filtering; gallery lightbox and before/after comparison with approved photographs; analytics consent/event delivery; Lighthouse/Core Web Vitals audit; full assistive-technology review.

Gallery and comparison components are implemented and compiled, but authentic project content has not been supplied for live acceptance testing. Project and plant drafts are hidden rather than misrepresented as completed work or current stock.

## Known constraints

Google Sheets has quotas and no transactions or concurrency conflict resolution. Public content is cached for one minute and invalidated after CMS writes. Avoid simultaneous edits/manual row operations. The Google private key, Cloudinary secrets and SMTP credentials are server-only configuration. Service-account sharing, OAuth allowlists and the final company privacy/retention policy must be reviewed before public launch.
