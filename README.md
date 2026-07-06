# wearnobodyknows.com

Next.js storefront for **Nobody Knows** — Printful fulfillment, Stripe checkout, and cart persistence.

The previous static Drive Sure legal site files are preserved in `drive-sure-legal-backup/`.

## Environment

Copy `.env.example` to `.env.local` and set:

- `PRINTFUL_API_KEY` — Printful store API token
- `STRIPE_SECRET_KEY` — Stripe secret key for live checkout
- `NEXT_PUBLIC_SITE_URL` — `https://wearnobodyknows.com`

## Development

```bash
npm install
npm run dev
```

Without Printful credentials, the app falls back to mock catalog data for local development and builds.

## Deploy

Connect this repository to the Vercel project for `wearnobodyknows.com`, add the environment variables above, and deploy.

## Fixes included

- Normalizes Printful variant prices so cart/checkout never receive malformed string prices like `"$18"`.
- Validates checkout shipping amounts before creating Stripe sessions.
- Restores a full shop catalog flow with men/women filters, product pages, and checkout.
