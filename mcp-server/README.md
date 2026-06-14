# MÓOU MCP Server

MCP server that exposes MÓOU compile, score, and Playbook deploy tools to agent IDEs and any MCP-compatible client.

**Compatible with:** Cursor · Claude Code · Grok Build · Windsurf · Cline · other MCP clients

## Tools

| Tool | Description |
|------|-------------|
| `moou_compile` | NL idea → structured strategy + risk + Playbook format |
| `moou_score` | Risk assessment for an existing strategy spec |
| `moou_deploy_prompt` | getagent-ready prompt for Bitget Playbook upload/backtest/publish |

## Install

```bash
cd mcp-server
npm install
npm run build
```

## Cursor setup

Add to Cursor MCP settings (`~/.cursor/mcp.json` or project `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "moou": {
      "command": "node",
      "args": ["C:/path/to/moou/mcp-server/dist/index.js"],
      "env": {
        "MOOU_API_URL": "https://usemoou.xyz/api/v1"
      }
    }
  }
}
```

## Grok Build setup

In Grok Build MCP settings, add the same server block as Cursor — `command: node` pointing to `mcp-server/dist/index.js` with `MOOU_API_URL=https://usemoou.xyz/api/v1`.

## Claude Code setup

```bash
claude mcp add -s user \
  --env MOOU_API_URL=https://usemoou.xyz/api/v1 \
  moou -- node /path/to/moou/mcp-server/dist/index.js
```

## Windsurf / Cline / other MCP clients

Use the same `node` + `dist/index.js` command and `MOOU_API_URL` env var. Consult your client’s MCP docs — the config shape matches Cursor.

## Codex, ChatGPT, Gemini, and other chat LLMs

These do not need MCP. Copy [INTEGRATION_PROMPT.md](../INTEGRATION_PROMPT.md) into the chat so the model knows how to call the REST API with curl or fetch.

## Local dev

Set `MOOU_API_URL` to `http://localhost:3000/api/v1` when running `npm run dev` in the main app.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `MOOU_API_URL` | `https://usemoou.xyz/api/v1` | MÓOU public API base URL |

Rate limits apply to `moou_compile` and `moou_score` (30/hour per IP on the public API by default). `moou_deploy_prompt` is not rate-limited. The website UI has no rate limit.