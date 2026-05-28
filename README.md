# Scale Army AE Call Scorecard

AI-powered sales call quality review tool for Scale Army account executives.

## Setup

1. Clone this repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Anthropic API key
4. Run locally: `npm run dev`

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy

## How it works

Paste any call transcript and the tool will generate a structured scorecard covering:

- **Rapport & Needs Discovery** — 3-point checklist (rapport/context, hiring need/role probing, timeline)
- **Pitch** — 4-point checklist (model explained, sheet shown, deck shown, engagement terms)
- **Budget Acknowledgment** — pass/fail
- **Objection Handling** — pass/fail with per-objection breakdown
- **CTA & Timing** — pass/fail/N/A
- **SQL determination** — Yes/No with criteria checklist and disqualification reasons
- **Overall score** — out of 5 (partial credit available)
