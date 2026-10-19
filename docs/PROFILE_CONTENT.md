# Company profile content integration

Source: `C:\Users\user\Downloads\COMPANY PROFILE.pdf`, supplied by the user on 14 October 2026. All three pages were extracted and visually reviewed. The letterhead is a raster image, so the telephone, email and logo were verified from the rendered first page rather than text extraction alone.

## Added to the website

- Company name and motto: Eco Landscapes & Gardening Ltd, “Service with diligence”.
- Registered on 15 March 2021.
- Theophile Karasira, founder and managing director.
- Head office: Kagugu Cell, Kinyinya Sector, Gasabo District, Kigali, Rwanda.
- Telephone: 0788755016, displayed internationally as +250 788 755 016.
- Email: ecolandgarde@gmail.com.
- Founder’s more than five years of informal experience before registration, described as background rather than invented company-age metrics.
- Company mission and vision, copyedited without adding claims.
- Soft landscaping and gardening, greening and beautification, fruit seedlings, ornamental/indigenous tree seedlings, and garden maintenance.
- Own nursery with flowers, tree seedlings and shrubs; Paspalum turf grass plots on the outskirts of Kigali.
- Fourteen named completed-work references plus the collective reference to residential premises in Kigali and upcountry. Presented as company-profile references, with links to the original PDF pages. No invented dates, detailed scopes, results, testimonials, client logos or endorsements.
- Original profile PDF downloadable from `/documents/eco-landscapes-company-profile.pdf`.
- Original raster branding extracted to `/images/company-brand.jpg`. The site uses a CSS crop of the landscape emblem alongside a legible typed company name.

`lib/company.ts` contains the source-backed facts and reference directory. `lib/seed.ts` supplies revised CMS defaults. An already initialized Google Sheet is preserved by the setup script; edits to existing CMS records remain the company’s responsibility rather than being overwritten automatically. Blank contact settings fall back to the supplied profile. The project directory remains a source-based list until approved photographed case studies are published in the CMS.

## Still pending

Company/project/nursery photographs; precise project scopes and results; individual plant names/species, growing conditions and current quantities; a confirmed WhatsApp number; precise office/nursery map coordinates; approved testimonials; provider credentials and final privacy/retention approval. The PDF telephone has not automatically been designated as WhatsApp. Existing six project drafts and twenty plant drafts remain unpublished.

## Design revision

A full-width background photograph with “Welcome to” and the company name over it; stronger white/green typography; official branding and contact ribbon; varied editorial service layouts; a source-backed project directory; a nursery section tied to actual company operations; rebuilt About, Services, Projects, Nursery, Contact and footer. Stock photographs remain visibly labelled while client imagery is pending. CMS image-source fields distinguish illustrative and approved company photographs.

## Owner additions — 15 October 2026

The user explicitly confirmed garden decoration, snake lights/garden lighting, and crazy paving/pathways as additional services. These now have homepage entries, dedicated service pages and contextual inquiry options. These additions come from the user's instruction, not the PDF, and do not imply any particular listed project included them. The original downloadable profile is unchanged.

The user also requested actual Times New Roman, larger text and standard green instead of dark forest green. The site now uses the system `Times New Roman` font family (installed on the Windows host), with Times/serif fallbacks on devices without it, larger public typography, and standard green `#008000`. No Microsoft font files are redistributed. The illustrative hero photograph is now a bright garden lawn.

Project scope update — 15 October 2026: all 15 references now include the exact service combinations supplied by the owner, in the supplied order. The project directory presents these as botanical illustrated cards; artwork is decorative, not project photography. No dates or outcomes were inferred.

Owner photo update - 16 October 2026: 15 numbered photos supplied in public, confirmed as general examples of company work, not matched to the 15 named references. Added all 15 to a dedicated gallery, three to a homepage preview, and replaced removed stock assets throughout fallback content. Supporting nursery images are labelled as landscaping work.
