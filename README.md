# MÓOU 谋 — Trading Strategy Compiler

> "Before you trade, 谋."

Natural language → structured strategy + risk score + Bitget Playbook output.  
**Bitget AI Base Camp Hackathon S1 · Track 2: Trading Infra**

| | |
|---|---|
| **Live app** | [usemoou.xyz](https://usemoou.xyz) |
| **API docs** | [usemoou.xyz/docs](https://usemoou.xyz/docs) · [API.md](./API.md) |
| **Health** | [usemoou.xyz/api/v1/health](https://usemoou.xyz/api/v1/health) |

## What It Does

MÓOU takes any trading idea in plain English and outputs:

1. Structured strategy spec (entry, exit, position sizing, market regime)
2. Risk score (0–100) across 5 dimensions with plain-English breakdown
3. Bitget Playbook-ready output — copy directly into Bitget's platform

The web app includes a live TradingView chart (search any Bitget-listed asset), a local strategy vault (localStorage, max 10 entries), and pages for About, FAQ, and API documentation.

## Public API

MÓOU ships a versioned public REST API for developers and agents.

```
Base URL:  https://usemoou.xyz/api/v1
Version:   1.0.0
Auth:      None (hackathon period)
Rate cap:  10 POST /compile requests per IP per hour
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Liveness, model, and version |
| `GET` | `/markets` | Supported markets, timeframes, regimes |
| `GET` | `/stats` | Total public API compilations |
| `POST` | `/compile` | Compile + risk score (single call) |

**Full reference:** [API.md](./API.md) (schemas, error codes, examples in cURL / JS / Python)  
**Interactive docs:** [usemoou.xyz/docs](https://usemoou.xyz/docs)

```bash
curl -s https://usemoou.xyz/api/v1/health | jq .status   # quick probe

curl -X POST https://usemoou.xyz/api/v1/compile \
  -H "Content-Type: application/json" \
  -d '{"strategy":"Buy BTC when RSI < 30 on 4H","market":"Crypto Futures","timeframe":"Swing (1H-4H)","regime":"Ranging"}'
```

## Quick Start (Local)

```bash
git clone https://github.com/mojeebdev/moou
cd moou
npm install
cp .env.example .env.local
# Set QWEN_KEY and NEXT_PUBLIC_SITE_URL in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `QWEN_KEY` | Yes | Qwen API key (Bitget hackathon Telegram community) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for OG / social previews |
| `KV_URL` | Optional | Vercel KV — public API compilation counter |
| `KV_REST_API_TOKEN` | Optional | Vercel KV REST token |

See [.env.example](./.env.example) for the full template.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 App Router (TypeScript) |
| AI | Qwen3.6-plus via Bitget hackathon proxy |
| Chart | TradingView widget (Bitget symbols) |
| Counter | Vercel KV (optional) |
| Styling | CSS variables + Tailwind CSS v4 |
| Fonts | Playfair Display · Lora · DM Mono |
| Deploy | Vercel |

## Project Structure

```
app/
  page.tsx                 # Main compile flow
  about/page.tsx           # About, FAQ, disclaimer
  docs/page.tsx            # Interactive API docs
  api/
    compile/route.ts       # Internal — compile only
    score/route.ts         # Internal — score only
    v1/
      health/route.ts      # GET  — liveness probe
      markets/route.ts     # GET  — markets / timeframes / regimes
      stats/route.ts       # GET  — usage counter
      compile/route.ts     # POST — public compile + score
components/                # UI sections
lib/                       # Types, vault, risk helpers, API constants
API.md                     # Public API reference (this repo)
```

## Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set `QWEN_KEY` and `NEXT_PUBLIC_SITE_URL`
4. Optional: enable **Vercel KV** for `/stats` counter (`KV_URL`, `KV_REST_API_TOKEN`)
5. Deploy

## Judging — Track 2: Trading Infra

✅ Solves a real developer pain point (NL → structured strategy gap)  
✅ Public REST API with health, discovery, stats, and structured errors  
✅ Low-friction integration — no API key during hackathon  
✅ Runnable demo with verifiable usage  
✅ Bitget Playbook-compatible output  
✅ Qwen3.6-plus as AI engine (Alibaba strategic sponsor)

## Credits

**Built by:** Mojeeb Titilayo · [BlindspotLab](https://blindspotlab.xyz) · [@mojeebeth](https://x.com/mojeebeth)

**Powered by:** Qwen (Alibaba Cloud) · Bitget Agent Hub · Foresight Ventures · Bitget AI

**Visual Credits:**  
Hero — Stephan Schmitz · Middle — Bryan White (@travangelist) · Expanded via Gemini · Animated via Grok

## License

MIT — see [LICENSE](LICENSE).