# MÓOU Public API Reference

**Version:** `1.0.0`  
**Base URL:** `https://usemoou.xyz/api/v1`  
**Interactive docs:** [usemoou.xyz/docs](https://usemoou.xyz/docs)  
**Health check:** [usemoou.xyz/api/v1/health](https://usemoou.xyz/api/v1/health)

MÓOU (谋) exposes a public REST API that compiles plain-English trading ideas into structured strategy specifications with multi-dimensional risk scoring. The API merges the internal compile and score pipelines into a single request — suitable for agents, dashboards, and trading infrastructure integrations.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Rate Limits](#rate-limits)
- [CORS](#cors)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [GET /health](#get-health)
  - [GET /markets](#get-markets)
  - [GET /stats](#get-stats)
  - [POST /compile](#post-compile)
- [Response Schemas](#response-schemas)
- [Examples](#examples)
- [Operational Notes](#operational-notes)
- [Disclaimer](#disclaimer)

---

## Overview

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Format | JSON |
| API version | `1.0.0` |
| AI model | `qwen3.6-plus` (Alibaba Cloud, via Bitget hackathon proxy) |
| Upstream | `https://hackathon.bitgetops.com/v1` |
| Powered by | MÓOU 谋 · [usemoou.xyz](https://usemoou.xyz) |

All timestamps are ISO 8601 UTC strings. All successful `/compile` responses include a `meta` object with processing metadata.

---

## Getting Started

### Step 1 — Try the web app (fastest)

Open [usemoou.xyz](https://usemoou.xyz), describe a strategy, and click **Compile Strategy**.  
No API key. **No rate limit** on the website — only the public `/api/v1/*` routes are capped.

### Step 2 — Verify the API is up

```bash
curl -s https://usemoou.xyz/api/v1/health | jq .
```

Expected: `"status": "operational"`

### Step 3 — Discover valid inputs

```bash
curl -s https://usemoou.xyz/api/v1/markets | jq .
```

Use the **label** strings (not `id` values) in compile requests.

### Step 4 — Your first compile

```bash
curl -X POST https://usemoou.xyz/api/v1/compile \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "Buy BTC when RSI drops below 30 on the 4H chart",
    "market": "Crypto Futures",
    "timeframe": "Swing (1H-4H)",
    "regime": "Ranging"
  }'
```

Response includes `strategy_name`, structured entry/exit/sizing, `risk` scores, and `playbook_format`.

### Step 5 — Integrate further

| Goal | Next step |
|------|-----------|
| Agent integration | [MCP server](./mcp-server/README.md) — `moou_compile`, `moou_score`, `moou_deploy_prompt` |
| Client codegen | `GET /api/v1/openapi` — OpenAPI 3.1 spec |
| Risk-only calls | `POST /api/v1/score` — when you already have a structured spec |
| Bitget Playbook / Studio | `POST /api/v1/deploy-prompt` or copy deploy prompts from the web UI (getagent + GetAgent Studio) |
| Any LLM assistant | Copy [INTEGRATION_PROMPT.md](./INTEGRATION_PROMPT.md) — ChatGPT, Claude, Grok, Codex, Gemini, etc. |

### LLM Integration Prompt

Don't want to read every endpoint? Copy the master prompt from [INTEGRATION_PROMPT.md](./INTEGRATION_PROMPT.md) or [usemoou.xyz/docs#integration-prompt](https://usemoou.xyz/docs#integration-prompt).

Paste it into any LLM, replace the last line with your goal (e.g. *"compile this funding-rate strategy and generate a Playbook deploy prompt"*), and the model will walk you through the API calls.

### Support

| Channel | Use for |
|---------|---------|
| [support@usemoou.xyz](mailto:support@usemoou.xyz) | Direct support, partnerships, general inquiries |
| [GitHub Issues](https://github.com/mojeebdev/moou/issues) | Bugs, API questions, integration help |
| [@rmojeeb on X](https://x.com/tmojeeb) | Quick questions, hackathon updates |
| [Bitget Hackathon Telegram](https://t.me/+o1tYqQ_lXxllYjgy) | Playbook keys, Qwen credits, hackathon support |
| [usemoou.xyz/docs](https://usemoou.xyz/docs) | Interactive endpoint reference |

---

## Authentication

No API key is required during the Bitget AI Base Camp hackathon period.

Requests are identified by client IP for rate limiting. No `Authorization` header is needed.

> **Post-hackathon:** Authentication and rate limits may change. Monitor `/health` and this document for updates.

---

## Rate Limits

| Limit | Value |
|-------|-------|
| Requests per IP | **30** (default; set `RATE_LIMIT_MAX` on server to adjust) |
| Window | **1 hour** (rolling) |
| Applies to | `POST /compile` and `POST /score` |
| Not limited | Website UI (`/api/compile`, `/api/score`), `GET` endpoints, `POST /deploy-prompt` |

When exceeded, the API returns **HTTP 429** with error code `RATE_LIMIT_EXCEEDED`.

`GET` endpoints (`/health`, `/markets`, `/stats`, `/openapi`) are not rate-limited.

### Why 30/hour?

Protects Qwen API credits from abuse while keeping the API usable for real integration work. Most developers test with 5–15 calls, not hundreds.

| Surface | Rate limited? |
|---------|---------------|
| Website (usemoou.xyz) | **No** — compile freely in the browser |
| Public API (`/api/v1/compile`, `/api/v1/score`) | **Yes** — 30/hour per IP |
| MCP tools (call public API) | **Yes** — same cap |

Increase `RATE_LIMIT_MAX` on Vercel as usage grows and credits allow.

### Estimated cost per compile

Each `POST /compile` runs **two** Qwen3.6-plus calls (compile + score):

| Call | Max output tokens |
|------|-------------------|
| Compile | 1,000 |
| Score | 800 |

Typical total: **~3,000–5,000 tokens** per full compile (input + output), depending on strategy length.

With **$30 hackathon Qwen credits**, expect roughly **1,000–3,000** full public API compiles before credits run low — varies by strategy verbosity and actual token usage. Monitor via your Qwen / hackathon dashboard.

`/score` alone uses one call (~800 max output tokens). `/deploy-prompt` uses **no** Qwen calls.

---

## CORS

Cross-origin requests are supported on `POST /compile`.

| Header | Value |
|--------|-------|
| `Access-Control-Allow-Origin` | `*` |
| `Access-Control-Allow-Methods` | `POST, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type` |

Preflight `OPTIONS` requests to `/compile` return **HTTP 200** with the headers above.

---

## Error Handling

All API errors use a consistent envelope:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "docs": "https://usemoou.xyz/docs"
  }
}
```

### Error codes

| Code | HTTP | Description |
|------|------|-------------|
| `MISSING_FIELDS` | 400 | One or more required fields are missing or the request body is invalid JSON |
| `INVALID_MARKET` | 400 | `market` is not a supported value |
| `RATE_LIMIT_EXCEEDED` | 429 | More than the hourly cap from this IP on `/compile` or `/score` |
| `COMPILATION_FAILED` | 500 | AI model failed to compile or score the strategy |
| `SCORING_FAILED` | 500 | AI model failed to score the strategy |

---

## Endpoints

### GET /health

Liveness and version probe. Use for uptime monitoring and service discovery.

**Request**

```http
GET /api/v1/health HTTP/1.1
Host: usemoou.xyz
```

**Response** `200 OK`

```json
{
  "status": "operational",
  "model": "qwen3.6-plus",
  "endpoint": "https://hackathon.bitgetops.com/v1",
  "version": "1.0.0",
  "timestamp": "2026-06-13T11:32:55.000Z",
  "powered_by": "MÓOU 谋 · usemoou.xyz"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service status (`operational`) |
| `model` | string | AI model identifier |
| `endpoint` | string | Upstream Qwen proxy base URL |
| `version` | string | API version |
| `timestamp` | string | Server time (ISO 8601) |
| `powered_by` | string | Attribution string |

---

### GET /markets

Returns supported markets, timeframes, and market regimes. Use to populate UI selectors or validate inputs before calling `/compile`.

**Request**

```http
GET /api/v1/markets HTTP/1.1
Host: usemoou.xyz
```

**Response** `200 OK`

```json
{
  "markets": [
    { "id": "crypto_futures", "label": "Crypto Futures", "exchange": "Bitget" },
    { "id": "crypto_spot", "label": "Crypto Spot", "exchange": "Bitget" },
    { "id": "us_stocks", "label": "US Stocks (Tokenized)", "exchange": "Bitget" }
  ],
  "timeframes": [
    { "id": "scalp", "label": "Scalp", "range": "1–15m" },
    { "id": "swing", "label": "Swing", "range": "1H–4H" },
    { "id": "position", "label": "Position", "range": "Daily+" }
  ],
  "regimes": [
    "Trending Up",
    "Trending Down",
    "Ranging",
    "Unclear"
  ],
  "docs": "https://usemoou.xyz/docs",
  "version": "1.0.0"
}
```

#### Accepted values for POST /compile

Pass the **label** strings (not `id` values) in compile requests:

| Field | Accepted values |
|-------|-----------------|
| `market` | `Crypto Futures` · `Crypto Spot` · `US Stocks (Tokenized)` |
| `timeframe` | `Scalp (1–15m)` · `Swing (1H–4H)` · `Position (Daily+)` |
| `regime` | `Trending Up` · `Trending Down` · `Ranging` · `Unclear` |

---

### GET /stats

Aggregate usage counter for public API compilations.

**Request**

```http
GET /api/v1/stats HTTP/1.1
Host: usemoou.xyz
```

**Response** `200 OK`

```json
{
  "total_compilations": 1247,
  "status": "operational",
  "version": "1.0.0"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total_compilations` | number | Cumulative successful `/compile` calls (Firestore `stats/global`). Returns `0` if unavailable |
| `status` | string | Service status |
| `version` | string | API version |

Always returns **HTTP 200**, even when the counter backend is unavailable.

---

### POST /compile

Compile a plain-English trading strategy and return a structured spec with risk scoring in a single call.

**Request**

```http
POST /api/v1/compile HTTP/1.1
Host: usemoou.xyz
Content-Type: application/json
```

**Body**

```json
{
  "strategy": "Buy BTC when RSI drops below 30 on the 4H chart with funding rates negative for 3 consecutive hours",
  "market": "Crypto Futures",
  "timeframe": "Swing (1H–4H)",
  "regime": "Ranging"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `strategy` | string | Yes | Trading idea in plain English (non-empty after trim) |
| `market` | string | Yes | One of the supported market labels |
| `timeframe` | string | Yes | One of the supported timeframe labels |
| `regime` | string | Yes | One of the supported regime values |

**Response** `200 OK`

```json
{
  "strategy_name": "Sixty-Two Range Reversal",
  "entry_conditions": "Place a limit buy order when RSI(14) on the 4H chart closes below 30 while funding rates have been negative for three consecutive hourly periods.",
  "exit_conditions": "Take profit when RSI reaches 65. Deploy a hard stop loss at 2% below entry price.",
  "position_sizing": "Allocate exactly 2% of total portfolio equity per trade. Never pyramid into losing positions.",
  "market_regime": "ranging",
  "regime_description": "Performs best when price oscillates within established support and resistance bands.",
  "playbook_format": "Exploit established range boundaries on BTC perpetual futures. Enter long on RSI oversold confluence with negative funding. Exit on RSI 65 or 2% stop. Risk 2% per trade.",
  "risk": {
    "overall_score": 55,
    "verdict": "MODERATE",
    "volatility_exposure": 75,
    "volatility_note": "RSI-based entries on 4H BTC carry significant volatility exposure during macro events.",
    "drawdown_risk": 40,
    "drawdown_note": "A defined 2% stop loss limits per-trade drawdown, though consecutive losses can compound.",
    "leverage_sensitivity": 65,
    "leverage_note": "Futures execution with funding rate filters increases sensitivity to leverage and margin calls.",
    "regime_dependency": 75,
    "regime_note": "Strategy is explicitly tuned for ranging conditions and may underperform in strong trends.",
    "execution_complexity": 50,
    "execution_note": "Requires monitoring RSI, funding rates, and 4H candle closes — moderate operational overhead."
  },
  "meta": {
    "compiled_at": "2026-06-13T11:32:55.000Z",
    "model": "qwen3.6-plus",
    "version": "1.0.0",
    "processing_ms": 1243,
    "powered_by": "MÓOU 谋",
    "docs": "https://usemoou.xyz/docs"
  }
}
```

**Typical latency:** 1–5 seconds (two sequential Qwen calls: compile + score).

---

### POST /score

Score risk for an existing structured strategy. Use when your agent already has a compiled spec and only needs the risk assessment primitive.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `strategy` | object | Yes — `strategy_name`, `entry_conditions`, `exit_conditions`, `position_sizing` |
| `market` | string | Yes |
| `timeframe` | string | Yes |

**Response** `200 OK`

```json
{
  "risk": { "overall_score": 55, "verdict": "MODERATE" },
  "meta": {
    "scored_at": "2026-06-14T08:00:00.000Z",
    "model": "qwen3.6-plus",
    "version": "1.0.0",
    "processing_ms": 890,
    "powered_by": "MÓOU 谋",
    "docs": "https://usemoou.xyz/docs"
  }
}
```

Rate-limited: same cap as `/compile` (default **30/hour** per IP).

---

### POST /deploy-prompt

Generate a getagent-ready prompt to upload, backtest, and publish a MÓOU-compiled strategy to Bitget Playbook.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `strategy` | object | Yes — full strategy including `playbook_format` |
| `risk` | object | No — include for richer deploy prompt |
| `playbook_key` | string | No — your Playbook API key, embedded in prompt, never stored |

**Response** `200 OK`

```json
{
  "prompt": "1. Install getagent using ...",
  "studio_prompt": "Paper-trade this MÓOU-compiled strategy on GetAgent Studio ...",
  "getagent_skill": "https://www.npmjs.com/package/@bitget-ai/getagent-skill",
  "getagent_studio": "https://getagent.studio/",
  "playbook_explore": "https://www.bitget.com/activity/ai-get-agent/playbook?tab=explore",
  "meta": { "generated_at": "...", "version": "1.0.0" }
}
```

| Field | Description |
|-------|-------------|
| `prompt` | getagent skill deploy prompt (Path B — coding agent) |
| `studio_prompt` | GetAgent Studio paper-trade prompt (Path C — free web UI) |
| `getagent_studio` | GetAgent Studio URL — free, sign in with Bitget account |

Not rate-limited.

---

### GET /openapi

Machine-readable OpenAPI 3.1 specification for client generation and agent discovery.

```http
GET /api/v1/openapi HTTP/1.1
Host: usemoou.xyz
```

---

## MCP Server

Agent IDEs with MCP support can call MÓOU natively — **Cursor**, **Claude Code**, **Grok Build**, **Windsurf**, **Cline**, and others. See [`mcp-server/README.md`](./mcp-server/README.md).

For **Codex**, **ChatGPT**, **Gemini**, and other chat LLMs without MCP, use the [Integration Prompt](./INTEGRATION_PROMPT.md) instead.

| Tool | Description |
|------|-------------|
| `moou_compile` | NL → structured strategy + risk |
| `moou_score` | Risk assessment for existing spec |
| `moou_deploy_prompt` | getagent + GetAgent Studio deploy prompts (`prompt`, `studio_prompt`) |

---

## Response Schemas

### Strategy fields

| Field | Type | Description |
|-------|------|-------------|
| `strategy_name` | string | Short memorable name (2–4 words) |
| `entry_conditions` | string | Entry logic |
| `exit_conditions` | string | Exit logic including stop loss and take profit |
| `position_sizing` | string | Sizing methodology |
| `market_regime` | string | `trending` · `ranging` · `neutral` |
| `regime_description` | string | When the strategy performs best |
| `playbook_format` | string | Bitget Playbook-ready instruction block |

### Risk object

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `overall_score` | number | 0–100 | Composite risk score |
| `verdict` | string | — | `CONSERVATIVE` · `MODERATE` · `AGGRESSIVE` · `EXTREME` |
| `volatility_exposure` | number | 0–100 | Sensitivity to price volatility |
| `volatility_note` | string | — | Plain-English explanation |
| `drawdown_risk` | number | 0–100 | Maximum loss potential |
| `drawdown_note` | string | — | Plain-English explanation |
| `leverage_sensitivity` | number | 0–100 | Impact of leverage on the strategy |
| `leverage_note` | string | — | Plain-English explanation |
| `regime_dependency` | number | 0–100 | Dependence on specific market conditions |
| `regime_note` | string | — | Plain-English explanation |
| `execution_complexity` | number | 0–100 | Operational difficulty to run live |
| `execution_note` | string | — | Plain-English explanation |

### Meta object

| Field | Type | Description |
|-------|------|-------------|
| `compiled_at` | string | ISO 8601 timestamp of completion |
| `model` | string | AI model used |
| `version` | string | API version |
| `processing_ms` | number | End-to-end processing time in milliseconds |
| `powered_by` | string | Service attribution |
| `docs` | string | Documentation URL |

---

## Examples

### cURL

```bash
curl -X POST https://usemoou.xyz/api/v1/compile \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "Buy BTC when RSI drops below 30 on the 4H chart",
    "market": "Crypto Futures",
    "timeframe": "Swing (1H-4H)",
    "regime": "Ranging"
  }'
```

### JavaScript (fetch)

```javascript
const response = await fetch('https://usemoou.xyz/api/v1/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    strategy: 'Buy BTC when RSI drops below 30 on the 4H chart',
    market: 'Crypto Futures',
    timeframe: 'Swing (1H-4H)',
    regime: 'Ranging',
  }),
})

const data = await response.json()

if (!response.ok) {
  console.error(data.error.code, data.error.message)
} else {
  console.log(data.strategy_name, data.risk.overall_score, data.risk.verdict)
}
```

### Python (requests)

```python
import requests

resp = requests.post(
    "https://usemoou.xyz/api/v1/compile",
    json={
        "strategy": "Buy BTC when RSI drops below 30 on the 4H chart",
        "market": "Crypto Futures",
        "timeframe": "Swing (1H-4H)",
        "regime": "Ranging",
    },
    timeout=30,
)

data = resp.json()
if resp.ok:
    print(data["strategy_name"], data["risk"]["verdict"])
else:
    print(data["error"]["code"], data["error"]["message"])
```

### Health check (monitoring)

```bash
curl -sf https://usemoou.xyz/api/v1/health | jq .status
# Expected: "operational"
```

---

## Operational Notes

### Compilation counter & rate limits (Firebase Firestore)

Successful `/compile` responses increment `stats/global.total_compilations` in Firestore. Rate limits are stored in the `ratelimits` collection using SHA-256 + base64url hashed IPs (salted with `IP_SALT`). If Firebase is not configured, the counter returns `0` and rate limiting fails open.

**Firestore collections:**

| Collection | Document | Fields |
|------------|----------|--------|
| `stats` | `global` | `total_compilations` (number) |
| `ratelimits` | `{hashedIp}` (16-char base64url) | `count`, `windowStartMs`, `updatedAt` |

**Setup:**

1. Create a Firebase project and enable Firestore
2. Generate a service account key (Firebase Console → Project Settings → Service Accounts)
3. Set environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `IP_SALT`
4. Redeploy

### Internal routes (web app only)

These routes power the MÓOU web UI and are **not** part of the public v1 API surface:

| Route | Purpose |
|-------|---------|
| `POST /api/compile` | Strategy compilation only |
| `POST /api/score` | Risk scoring only (requires prior compile output) |

They require server-side `QWEN_KEY` and do not include CORS headers or public rate-limit metadata.

### Recommended integration pattern

```
1. GET  /health   → confirm service is operational
2. GET  /markets  → populate or validate form fields
3. POST /compile   → compile + score in one call
4. GET  /stats    → optional usage display
```

---

## Disclaimer

Outputs from the MÓOU API are generated by an AI model for **educational, research, and planning purposes only**. They do not constitute financial advice, investment recommendations, or solicitation to trade any asset. Trading cryptocurrencies and financial instruments involves significant risk of loss. Always conduct your own research before making trading decisions.

---

## Links

| Resource | URL |
|----------|-----|
| Web app | [usemoou.xyz](https://usemoou.xyz) |
| Interactive docs | [usemoou.xyz/docs](https://usemoou.xyz/docs) |
| About & FAQ | [usemoou.xyz/about](https://usemoou.xyz/about) |
| GitHub | [github.com/mojeebdev/moou](https://github.com/mojeebdev/moou) |
| Health | [usemoou.xyz/api/v1/health](https://usemoou.xyz/api/v1/health) |

**Built by:** Mojeeb Titilayo · [BlindspotLab](https://blindspotlab.xyz) · [@tmojeeb](https://x.com/tmojeeb)

**Hackathon:** Bitget AI Base Camp S1 · Track 2: Trading Infra