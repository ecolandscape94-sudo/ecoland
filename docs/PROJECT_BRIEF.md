# Corrected project brief

Build a premium corporate website for Eco Landscapes & Gardening Ltd in Rwanda.

## Visual direction

A crisp **white and green** identity: white primary backgrounds, forest green `#174B35`, deep green `#103526`, pale botanical green `#F4F7F2` and readable dark green text. Use elegant editorial headings, modern body typography, generous whitespace, restrained rounded corners, authentic photography and subtle accessible interactions. Keep the experience welcoming, polished and contemporary.

## Confirmed technology corrections

- Next.js App Router, strict TypeScript, Tailwind CSS and Lucide icons.
- **Cloudinary** for website photographs, gallery assets and secure inquiry attachments. Server-authorized uploads; responsive optimized delivery.
- **Google Sheets** as the content and inquiry database, accessed server-side through a private service account. Separate worksheets for projects, plants, services, inquiries, testimonials, homepage sections, settings and audit history. Do not publish the spreadsheet or expose credentials.
- Auth.js Google sign-in with approved administrator/editor emails and server-side role checks.
- Server-validated forms, persistent inquiries and configurable SMTP notifications. Preserve saved inquiries when email fails.
- Shared serverless rate limiting through Upstash; it stores temporary counters, while company records stay in Google Sheets.
- **Vercel** for deployment with environment secrets and Next.js hosting defaults.

These corrections replace the original PostgreSQL/Prisma requirements and ivory/beige/gold visual direction.

## Scope retained

Home, About, service overview and five service detail pages, Projects and project detail pages, searchable Nursery, Contact, Privacy, and protected administration. Support six case-study drafts and twenty plant drafts, media galleries, a matching-photo before/after comparison, contextual WhatsApp inquiries, content management, inquiry statuses/notes and SEO fundamentals.

## Content and launch rules

Use client-approved company details and photos. Label illustrative stock assets. Do not invent projects, client endorsements, metrics, inventory, prices, staff biographies or nursery addresses. Publish projects/plants only after approval. Keep missing-contact actions hidden and submissions honest when integrations are not configured. Test live integrations and Vercel deployment after credentials are supplied; do not claim untested features are verified.
