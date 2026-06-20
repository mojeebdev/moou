# MÓOU 谋 — Trading Strategy Compiler

> "Before you trade, 谋."

Natural language → structured strategy + risk score + Bitget Playbook output.  
**Bitget AI Base Camp Hackathon S1 · Track 2: Trading Infra**

| | |
|---|---|
| **Live app** | [usemoou.xyz](https://usemoou.xyz) |
| **User guide** | [usemoou.xyz/guide](https://usemoou.xyz/guide) |
| **Developer docs** | [usemoou.xyz/docs](https://usemoou.xyz/docs) · [API.md](./API.md) |
| **Health** | [usemoou.xyz/api/v1/health](https://usemoou.xyz/api/v1/health) |

## What It Does

MÓOU takes any trading idea in plain English and outputs:

1. **Structured strategy spec** — entry, exit, position sizing, market regime
2. **Risk score (0–100)** — five dimensions with plain-English breakdown
3. **Bitget Playbook-ready output** — copy into Playbook, deploy via getagent, or paper-trade on GetAgent Studio

The web app includes a live TradingView chart (search any Bitget-listed asset), a local strategy vault (localStorage, max 10 entries), and dedicated pages for users ([Guide](https://usemoou.xyz/guide)), developers ([Docs](https://usemoou.xyz/docs)), and [About](https://usemoou.xyz/about).

## For Users (Traders & Bitget Agent)

No code required. Unlimited compiles on the website.

1. Go to [usemoou.xyz](https://usemoou.xyz) → **Compile** — describe your strategy, pick market/timeframe/regime
2. Review the structured spec and risk score
3. Deploy and validate:
   - **Path A** — *Copy for Bitget Playbook* (`playbook_format` text for manual paste)
   - **Path B** — *Copy getagent Deploy Prompt* (upload → backtest → publish with `@bitget-ai/getagent-skill`)
   - **Path C** — *GetAgent Studio* ([getagent.studio](https://getagent.studio/)) — paper trading and backtest

Full walkthrough: [User Guide](https://usemoou.xyz/guide)

## For Developers

Five minutes to your first API compile:

1. `curl -s https://usemoou.xyz/api/v1/health`
2. `GET /api/v1/markets` for valid `market`, `timeframe`, and `regime` values
3. `POST /api/v1/compile` with your strategy JSON (see example below)
4. Pick your integration path (all optional):
   - **REST API** — any language, any agent runtime
   - **Integration prompt** — paste into ChatGPT, Claude, Grok, Codex, Gemini, etc.
   - **MCP server** — Cursor, Claude Code, Grok Build, Windsurf, Cline
   - **OpenAPI** — [usemoou.xyz/api/v1/openapi](https://usemoou.xyz/api/v1/openapi)

Interactive reference: [Developer Docs](https://usemoou.xyz/docs) · [API.md](./API.md) · [MCP setup](./mcp-server/README.md) · [Integration Prompt](./INTEGRATION_PROMPT.md)

**Need help?** [support@usemoou.xyz](mailto:support@usemoou.xyz) · [GitHub Issues](https://github.com/mojeebdev/moou/issues) · [@tmojeeb](https://x.com/tmojeeb) · [Bitget Hackathon Telegram](https://t.me/+o1tYqQ_lXxllYjgy)

## Public API

MÓOU ships a versioned public REST API for developers and agents.

```
Base URL:  https://usemoou.xyz/api/v1
Version:   1.0.0
Auth:      None (hackathon period)
Rate cap:  30 POST requests per IP per hour (/compile and /score)
           Website UI is unlimited — rate limit applies to public API only
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Liveness, model, and version |
| `GET` | `/markets` | Supported markets, timeframes, regimes |
| `GET` | `/stats` | Total public API compilations |
| `GET` | `/openapi` | OpenAPI 3.1 machine-readable spec |
| `POST` | `/compile` | Compile + risk score (single call) |
| `POST` | `/score` | Risk score for existing strategy spec |
| `POST` | `/deploy-prompt` | getagent + GetAgent Studio deploy prompts (`prompt`, `studio_prompt`) |

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
| `FIREBASE_PROJECT_ID` | Optional | Firebase project for rate limits + stats |
| `FIREBASE_CLIENT_EMAIL` | Optional | Firebase Admin service account email |
| `FIREBASE_PRIVATE_KEY` | Optional | Firebase Admin private key (JSON escaped) |
| `IP_SALT` | Optional | Salt for hashing client IPs in Firestore |
| `RATE_LIMIT_MAX` | Optional | Public API requests per IP per hour (default: `30`) |

See [.env.example](./.env.example) for the full template.

## Agent & LLM Integration

| Method | Best for |
|--------|----------|
| **REST API** | Scripts, backends, custom bots — `POST /api/v1/compile` |
| **Integration prompt** | ChatGPT · Claude · Grok · Codex · Gemini · any chat LLM |
| **MCP server** | Cursor · Claude Code · Grok Build · Windsurf · Cline |

MCP tools: `moou_compile` · `moou_score` · `moou_deploy_prompt`

```bash
cd mcp-server && npm install && npm run build
```

Setup: [mcp-server/README.md](./mcp-server/README.md)

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2 (App Router) · React 19 · TypeScript 5 |
| AI | Qwen3.6-plus via `hackathon.bitgetops.com` (Bitget hackathon proxy) |
| Public API | Next.js Route Handlers — `/api/v1/*` + OpenAPI 3.1 |
| Agent bridge | MCP server (stdio) + copy-paste integration prompt |
| Chart | TradingView embedded widget (Bitget symbols) |
| Stats & rate limits | Firebase Firestore (optional) |
| Styling | Tailwind CSS v4 + CSS variables |
| Fonts | Playfair Display · Lora · DM Mono (`next/font`) |
| Analytics | Vercel Analytics |
| Deploy | Vercel |

## Project Structure

```
app/
  page.tsx                 # Main compile flow
  about/page.tsx           # About, FAQ, disclaimer
  guide/page.tsx           # User guide — Playbook deploy paths
  docs/page.tsx            # Interactive API docs
  api/
    compile/route.ts       # Internal — compile only
    score/route.ts         # Internal — score only
    v1/
      health/route.ts      # GET  — liveness probe
      markets/route.ts     # GET  — markets / timeframes / regimes
      stats/route.ts       # GET  — usage counter
      openapi/route.ts     # GET  — OpenAPI 3.1 spec
      compile/route.ts     # POST — public compile + score
      score/route.ts       # POST — risk score only
      deploy-prompt/route.ts # POST — getagent + Studio deploy prompts
components/                # UI sections
lib/                       # moou-engine, API helpers, OpenAPI, nav config
mcp-server/                # MCP tools for agent IDEs (Cursor, Grok Build, etc.)
API.md                     # Public API reference (this repo)
INTEGRATION_PROMPT.md      # LLM integration prompt (copy-paste)
```

## Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set `QWEN_KEY` and `NEXT_PUBLIC_SITE_URL`
4. Optional: set **Firebase Admin** env vars for `/stats` counter and API rate limiting
5. Deploy

## Judging — Track 2: Trading Infra

✅ Solves a real developer pain point (NL → structured strategy gap)  
✅ Public REST API with health, discovery, stats, and structured errors  
✅ Low-friction integration — no API key during hackathon  
✅ Runnable demo with verifiable usage  
✅ Bitget Playbook-compatible output + getagent deploy bridge  
✅ MCP server + integration prompt for Cursor, Grok Build, Codex, and other LLMs
✅ OpenAPI 3.1 spec at `/api/v1/openapi`  
✅ Qwen3.6-plus as AI engine (Alibaba strategic sponsor)

## Credits

**Built by:** Mojeeb Titilayo · [BlindspotLab](https://blindspotlab.xyz) · [@tmojeeb](https://x.com/tmojeeb)

**Powered by:** Qwen (Alibaba Cloud) · Bitget Agent Hub · Foresight Ventures · Bitget AI

**Visual Credits:**  
Hero — Stephan Schmitz · Middle — Bryan White (@travangelist) · Expanded via Gemini · Animated via Grok

## License

MIT — see [LICENSE](LICENSE).