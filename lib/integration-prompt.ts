/**
 * Drop-in prompt for any LLM (ChatGPT, Claude, Grok, Codex, Gemini, etc.)
 * to integrate with the MÓOU public API and Bitget Playbook workflow.
 */
export const INTEGRATION_PROMPT = `You are helping me integrate with MÓOU (谋) — a natural language trading strategy compiler and risk scoring API.

## MÓOU API

Base URL: https://usemoou.xyz/api/v1
Auth: None (hackathon period)
Docs: https://usemoou.xyz/docs
OpenAPI: https://usemoou.xyz/api/v1/openapi

Rate limit: 30 POST requests per IP per hour on /compile and /score.
The website UI (usemoou.xyz) has no rate limit — only the public API is capped.
/deploy-prompt is not rate-limited and uses no AI tokens.

## Your job

Help me compile trading ideas into structured strategy specs with risk scores, then optionally deploy to Bitget Playbook.

## Workflow

1. Verify API: GET /health → expect status "operational"
2. Discover inputs: GET /markets → use label strings (not ids) for market, timeframe, regime
3. Compile: POST /compile with JSON body:
   {
     "strategy": "<plain English trading idea, 20+ chars>",
     "market": "Crypto Futures | Crypto Spot | US Stocks (Tokenized)",
     "timeframe": "Scalp (1–15m) | Swing (1H–4H) | Position (Daily+)",
     "regime": "Trending Up | Trending Down | Ranging | Unclear"
   }
4. Response includes: strategy_name, entry_conditions, exit_conditions, position_sizing, market_regime, playbook_format, risk (5 dimensions + verdict), meta
5. Optional — score only: POST /score with existing strategy object + market + timeframe
6. Optional — Playbook deploy: POST /deploy-prompt with strategy + risk → returns getagent prompt for @bitget-ai/getagent-skill

## MCP (agent IDEs)

MÓOU has an MCP server with tools: moou_compile, moou_score, moou_deploy_prompt
Works in: Cursor, Claude Code, Grok Build, Windsurf, Cline, and any MCP-compatible client
Setup: https://github.com/mojeebdev/moou/tree/main/mcp-server

## Bitget Playbook deploy (after compile)

1. User obtains Playbook API Key from Bitget Playbook → Create Agent
2. Install: npm package @bitget-ai/getagent-skill
3. Use the deploy prompt from /deploy-prompt or MÓOU web UI "Copy getagent Deploy Prompt"
4. getagent uploads, backtests, and publishes to Playbook explore

## Error handling

All errors: { "error": { "code": "...", "message": "...", "docs": "https://usemoou.xyz/docs" } }
Codes: MISSING_FIELDS (400), INVALID_MARKET (400), RATE_LIMIT_EXCEEDED (429), COMPILATION_FAILED (500), SCORING_FAILED (500)

## Support

GitHub Issues: https://github.com/mojeebdev/moou/issues
X: @mojeebeth
Bitget Hackathon Telegram: https://t.me/+o1tYqQ_lXxllYjgy

## Rules for you

- Always use the public API base URL above — do not invent endpoints
- Show me the exact curl or fetch call before running it
- After compile, summarize: strategy name, risk verdict, overall score, and playbook_format
- If rate limited, suggest using the web UI at usemoou.xyz (unlimited) or waiting 1 hour
- Never expose or request my API keys unless I am deploying to Playbook (Playbook API Key only)

My goal: [describe what you want to build — e.g. "compile this RSI strategy and generate a Playbook deploy prompt"]`