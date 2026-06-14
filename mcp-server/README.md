# MÓOU MCP Server

MCP server that exposes MÓOU compile, score, and Playbook deploy tools to Cursor, Claude Code, and other MCP-compatible agents.

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

Add to Cursor MCP settings (`~/.cursor/mcp.json` or project config):

```json
{
  "mcpServers": {
    "moou": {
      "command": "node",
      "args": ["C:/path/to/MOOU/mcp-server/dist/index.js"],
      "env": {
        "MOOU_API_URL": "https://usemoou.xyz/api/v1"
      }
    }
  }
}
```

For local dev, set `MOOU_API_URL` to `http://localhost:3000/api/v1`.

## Claude Code setup

```bash
claude mcp add -s user \
  --env MOOU_API_URL=https://usemoou.xyz/api/v1 \
  moou -- node /path/to/MOOU/mcp-server/dist/index.js
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `MOOU_API_URL` | `https://usemoou.xyz/api/v1` | MÓOU public API base URL |

Rate limits apply to `moou_compile` and `moou_score` (30/hour per IP on the public API by default). `moou_deploy_prompt` is not rate-limited. The website UI has no rate limit.