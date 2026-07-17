# ScamShield AI+

A complete Singapore-focused scam-risk assessment portfolio application built with Next.js App Router, React, TypeScript, Tailwind CSS, Recharts, Zod, OpenAI, Supabase, Tesseract OCR and browser QR detection.

The application provides an automated, explainable risk assessment. It does **not** guarantee that something is safe or fraudulent and is not affiliated with the Singapore Government or official ScamShield service.

## Features

- Guest scam checker for text, screenshots, URLs and QR images
- OCR via Tesseract.js; images are processed temporarily and not uploaded by default
- QR destination extraction without navigation (uses the browser `BarcodeDetector` API)
- Hybrid rule scoring with structured, Zod-validated OpenAI enhancement
- Automatic masking for common OTP, PIN, password and card-number patterns
- Dedicated investment checker and explainable results dashboard
- PDF/copy/print incident summary, clearly marked as user-generated
- Demo Recharts trends dashboard and seven educational guides with quiz
- Rate-limited analysis endpoint and demo fallback when no OpenAI key is present
- Supabase tables, seed data and Row Level Security policies

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No keys are required for demo mode.

## Environment

Set `OPENAI_API_KEY` to enable AI-assisted explanations. `OPENAI_MODEL` defaults to `gpt-4o-mini`. Add the public Supabase URL and anon key when connecting authentication and persisted saved analyses. Never expose the service-role key to browser code.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Optionally run `supabase/seed.sql`.
4. Add the Supabase values from `.env.example` to `.env.local`.

The current guest flow deliberately keeps results in `sessionStorage`. The schema and RLS policies support optional authenticated persistence without exposing one user's records to another.

## Safety design

- Submitted links are parsed as strings and are never fetched, opened or executed.
- QR destinations are shown and assessed, never followed automatically.
- JPG, PNG and WEBP uploads are limited to 8 MB.
- Screenshots remain local for OCR unless a future signed-in user explicitly consents to storage.
- API requests are validated and limited to 15 checks per IP per minute (in-memory demo limiter; use Redis in multi-instance production).
- AI output is parsed as JSON and rejected unless it matches the Zod schema.

## Production notes

For production, move rate limits to a shared store, configure CSP/security headers, add malware-safe server-side OCR if broader browser compatibility is required, add CAPTCHA/abuse monitoring, connect Supabase Auth, and conduct privacy/security reviews before accepting real incident content.
