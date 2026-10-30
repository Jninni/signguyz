# Enable Resend enquiry delivery

Recipients are fixed on the server: contact@thesignguyz.ca and andrew@thesignguyz.ca. Ensure both are working mailboxes/aliases at your existing email provider. Resend does not create those inboxes.

1. In Resend add a sending-only subdomain, recommended `forms.thesignguyz.ca`. Add ONLY the DKIM and return-path/SPF records Resend provides to GoDaddy DNS. Do not replace the root domain's MX records, existing email SPF or Microsoft 365/GoDaddy settings. Do not enable Resend receiving for the root domain. Use exact account-provided record values, not examples from documentation.
2. Wait for Resend verification. Create a sending-only API key restricted to that domain.
3. In the Vercel signguyz project, add RESEND_API_KEY as a sensitive server environment variable. Set RESEND_FROM to `The Sign Guyz <enquiries@forms.thesignguyz.ca>` (or the actual verified sender). Set ENQUIRY_ALLOWED_ORIGINS to a comma-separated list of the actual public Vercel and custom-domain origins, with https and no trailing path. Never put the key in browser code, GitHub or chat.
4. Redeploy after configuration. The endpoint rejects other origins and returns a useful unavailable error if credentials are missing. For a preview test, configure its exact origin and use separate Preview variables.
5. Enable a Vercel Firewall rate-limit rule for POST /api/enquiry before launch. The built-in bounded per-instance throttle and honeypot reduce basic abuse but do not provide distributed bot protection. For sustained spam, add a verified challenge such as Turnstile.
6. Submit a clearly labelled test enquiry on the Vercel site. Check Resend delivery events AND receipt in both inboxes, including spam. Test Reply to customer and one small attachment. Provider acceptance is not proof of inbox delivery.

The frontend keeps fields on error, disables repeated clicks while sending, and retries the same payload with a stable provider idempotency key. The backend uses a verified sender and customer Reply-To for email requests; phone requests contain the number and still use the customer email for Reply-To. It sends plain text with validated JPG/PNG/WebP/PDF attachments (five maximum, 3 MiB combined) to stay beneath Vercel's 4.5 MB request limit after base64 encoding. A separate receipt is sent to the required customer email after the business notification is accepted. It includes the enquiry summary and copies of the same validated uploaded attachments sent to the team. Receipt failure does not turn a successful enquiry into a failed submission. No enquiry contents or keys are logged by application code.

The current Sites review version remains separate and retains its preview form. This integration is for the GitHub/Vercel website only.

Checks: `node --test tests/enquiry.test.mjs`, `node build.mjs`, `node check.mjs`. Unit tests mock Resend and send no mail. Complete live delivery testing after account configuration.
