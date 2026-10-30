# The Sign Guyz website

Branded Hi-Vis site, prepared for Vercel. The existing Sites review URL remains independent and unchanged:
https://signguyz-design-review.basicraven256.chatgpt.site/?skin=branded

## Vercel setup

Import Jninni/signguyz. Set Root Directory to `website`, Framework Preset to Other, and select the branch containing this directory. Configuration in vercel.json builds with `npm run build` and publishes `dist`.

No runtime packages, storage account or database are required. Enquiry email requires a Resend account and server environment variables. Node 22 or newer is supported. Run `node build.mjs`, `node check.mjs`, then `node serve.mjs` for local preview.

Set SITE_URL to the final canonical origin (currently defaults to https://thesignguyz.ca). SITE_INDEXABLE defaults to false. Keep false during review; set true only for the production environment after the domain is connected and launch checks are complete. Vercel preview builds remain noindex regardless of that setting. Rebuild after environment changes.

Keep GoDaddy domain registration and email records. Add the domain in Vercel, then apply only the website DNS records Vercel specifies. Do not change mail records. Domain connection and Vercel deployment have not been performed by this preparation task.

## Images and branding

The `/gallery/` page shows approved project photos from the Signguyz Drive Photos folder. `gallery-photos.json` controls order and descriptive alt text; `gallery-sources.json` records original Drive file IDs and filenames for future updates. `assets/gallery/` contains metadata-free WebP thumbnails and enlarged versions. Originals stay in Drive. This is a published snapshot, so new Drive photos need to be prepared and committed before appearing on the site. The promotional graphic and duplicate airport image are omitted. Gallery images open in a keyboard-accessible viewer, with direct image links when JavaScript is unavailable.

`assets/` contains only prepared website images and shared browser files. `assets/image-manifest.json` records dimensions, source filenames, sizes and approval context. Original photos remain in Google Drive; do not commit raw photo libraries, client documents or full branding boards.

The Balanced Z in `assets/logo-balanced.svg` is a standalone SVG viewport containing compressed raster artwork from the approved identity board. It is NOT a traced vector or transparent print master. The favicon uses the same approved symbol. Obtain a proper vector master before print or large-format use. No letter shapes have been redesigned for the website.

For photo updates: select an approved original in Drive, export an appropriately sized WebP (typically no more than 1600px wide for current placements), strip camera metadata, record the asset in the manifest, and update references/alt text in content.mjs, enhancements.mjs, seo.mjs or build.mjs. Run build and checks, review desktop/mobile, then open a pull request. The build copies assets into dist. Git tracks prepared assets; dist is generated and ignored.

## Launch checklist

- Approve final content, logo and photos.
- Connect and test enquiry delivery. The Resend integration is implemented; configure it and verify receipt at both destinations before launch. See RESEND-SETUP.md.
- Confirm final domain, canonical URLs, redirects from old URLs, and live sitemap.
- Enable production indexing and submit sitemap in Google Search Console and Bing Webmaster Tools.
- Configure analytics/advertising only when account details and consent requirements are agreed.
- At final launch, decide how to noindex or retire the separate review site without breaking stakeholder access.

When Resend is configured, form details and attachments are emailed to contact@thesignguyz.ca and andrew@thesignguyz.ca. WSIB and weekend/holiday response coverage remain unconfirmed.

## Current brief

The website follows the later owner-approved direction: business owners/tenants are an audience; new signs and end-to-end fabrication/installation are offered; owned bucket-truck fleet, $5M insurance, 20+ years and owner presence/sign-off are confirmed. The older root CLAUDE.md is historical where it conflicts with this direction. Vercel replaces the earlier Railway hosting plan. No live Supabase integration is needed.
