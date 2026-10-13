# The Sign Guyz: website rebuild (project brief)

Context for Claude Code. This brief summarizes discovery and strategy work done so far. Treat facts marked (to confirm) as assumptions until the client questionnaire and Joist data come back.

## The client

- **Business:** The Sign Guyz, Whitby, Ontario. Owner: Andrew. Phone (905) 429-9860. Email Andrew@TheSignGuyz.ca.
- **Google listing:** 43 Inglewood Pl, Whitby (likely residential, so don't publish the address unless confirmed). Mon–Fri 9–5. 1 Google review.
- **Socials:** Instagram @thesignguyz_andrew. (facebook.com/theriggingguyz is NOT associated with the business; do not link it.)
- **Current site:** thesignguyz.ca is a one-page GoDaddy builder site with an empty gallery, no services, no address, 2019 footer, and the og:title set to an email address. Effectively invisible in search.
- **What he does:** sign fabrication and installation, with crane/boom work, repairs, removals and service. Experienced and well known in the trade, but almost invisible online.
- **Quoting tool:** Joist (estimates and invoices). Bookkeeping tool to confirm.

## How the business really works (critical)

- About **60% of revenue comes from SpeedPro Oshawa**, which resells his work as its own (white-label). Most of the rest comes from similar trade partners (other sign storefronts). Very little direct retail work.
- **The website must not compete with his partners.** He must never appear to be selling new storefront signs to their customers.
- **Concentration risk:** one partner at 60%. Growth goal 1 is more trade partners (target: no partner above 40% in about two years).
- **Growth goal 2:** a direct channel to **commercial property managers and plaza owners**, limited to service-type work.

## Positioning

The installation and service partner for sign companies and commercial properties in Durham Region.
Contractor-grade, professional, B2B in tone. Not a retail sign shop.

Two front doors:

1. **For sign companies (trade):** white-label installation, fabrication, crane and boom work, removals, repairs, LED retrofits, site surveys, permits.
   - The core promise, shown prominently: "We install under your brand. We never contact or sell to your customers."
2. **For property managers (direct):** repairs, lighting outages, emergency make-safe, tenant changeovers (remove old sign, patch the fascia, install the new one), pylon and directory panel updates, and annual maintenance plans.
   - When a property manager needs a new sign designed or made, Andrew refers them to a partner shop and installs it. The direct channel feeds partners rather than competing with them.

**Lines not to cross:**
- No "custom storefront signs, banners, decals, wraps" retail pitch.
- No naming partners' end customers without permission.
- Trade projects are shown anonymized, e.g. "Pylon install, Oshawa plaza".

## Site map (first version)

- **Home:** the positioning, the two paths, a trust strip (years in business, installs completed, equipment, insurance/WSIB), featured projects, and a call button.
- **For Sign Companies:** capabilities, the white-label promise, how a job runs (drawings in, site survey, scheduled install, photo report back to the partner), credentials (insurance certificates on request), service area and response times, and a "Send us a job" form with file upload.
- **For Property Managers:** services, maintenance plans (2–3 tiers, e.g. annual inspection / semi-annual with priority response / full coverage with emergency call-outs), emergency response, and a "Request a free sign condition check" form.
- **Services:** installation, repair and emergency service, crane and rigging, removals and tenant changeovers, LED retrofits and illuminated repair, pylon and monument signs.
- **Projects:** filterable by service and town. Each project has photos, a short problem/solution/result, location (town only) and service type.
- **About:** Andrew as the face of the business, history, equipment, safety.
- **Contact:** phone and form. Show the address only if confirmed.
- **Later:** a permits guide covering sign by-laws in Durham municipalities, and service-area pages only where real local projects exist.

## Design direction

- **Tone:** industrial and dependable. Think contractor and job site, not boutique agency. The photography carries the page: crane lifts, large pylons, night shots of illuminated signs.
- **Mobile first.** A sticky "Call" button on mobile. Forms are short, and photo upload works from a phone.
- **Avoid:** generic template looks, stock photos of smiling office workers, retail sign-shop clichés.

## Tech

- **Hosting:** Railway. **Data:** Supabase (leads, projects library, photo storage) when needed.
- **For mockups:** static pages or a lightweight framework (e.g. Astro or Next.js) are fine. Use placeholder photos clearly marked as placeholders.
- **SEO basics:** LocalBusiness schema, a unique title and meta description per page, fast loading, alt text on project photos.

## Local competitors (Google reviews, Oct 2026)

| Competitor | Location | Reviews |
|---|---|---|
| Unique Media Solutions | Whitby | 176 |
| SpeedPro | Oshawa (also his main partner) | 144 |
| FASTSIGNS | Ajax | 86 |
| FASTSIGNS | Oshawa | 71 |
| Signarama | Oshawa | 53 |
| Calibre Signs | Whitby | 49 |
| Kwik Signs | Oshawa | 24 |
| Pack Signs | Oshawa | 24 |
| YESCO / Brooklin Bulletin Signs | Whitby | — |

YESCO Whitby already pitches maintenance visits to property managers, which confirms demand.

## Open questions (awaiting questionnaire and Joist data)

- Years in business, team size, equipment, licences, insurance.
- Trade vs direct revenue mix, margins and job sizes.
- Whether he can staff after-hours emergency work.
- Whether the address can be shown.
- Brand assets: logo files, photo library, permission to name clients.

Discovery answers are collected in the Google Sheet "Sign Guyz Discovery Answers" (Answers tab).
