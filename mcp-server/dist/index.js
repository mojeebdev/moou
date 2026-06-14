#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const API_BASE = (process.env.MOOU_API_URL ?? 'https://usemoou.xyz/api/v1').replace(/\/$/, '');
const MARKETS = ['Crypto Futures', 'Crypto Spot', 'US Stocks (Tokenized)'];
async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
        const msg = data?.error?.message ?? `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}
const server = new McpServer({
    name: 'moou',
    version: '1.0.0',
});
server.tool('moou_compile', 'Compile a plain-English trading idea into a structured strategy spec with risk score and Bitget Playbook output.', {
    strategy: z.string().min(20).describe('Trading idea in plain English'),
    market: z.enum(MARKETS).describe('Target market'),
    timeframe: z.string().describe('e.g. Swing (1H-4H), Scalp (<15M), Position (1D+)'),
    regime: z.string().describe('e.g. Trending, Ranging, Neutral'),
}, async ({ strategy, market, timeframe, regime }) => {
    const result = await apiPost('/compile', {
        strategy,
        market,
        timeframe,
        regime,
    });
    return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
});
server.tool('moou_score', 'Score risk for an existing structured strategy across 5 dimensions.', {
    strategy_name: z.string(),
    entry_conditions: z.string(),
    exit_conditions: z.string(),
    position_sizing: z.string(),
    market: z.enum(MARKETS),
    timeframe: z.string(),
    market_regime: z.string().optional(),
    regime_description: z.string().optional(),
    playbook_format: z.string().optional(),
}, async (args) => {
    const { market, timeframe, ...strategyFields } = args;
    const result = await apiPost('/score', {
        strategy: strategyFields,
        market,
        timeframe,
    });
    return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
});
server.tool('moou_deploy_prompt', 'Generate a getagent-ready prompt to upload, backtest, and publish a MÓOU-compiled strategy to Bitget Playbook.', {
    strategy_name: z.string(),
    entry_conditions: z.string(),
    exit_conditions: z.string(),
    position_sizing: z.string(),
    playbook_format: z.string(),
    market_regime: z.string().optional(),
    regime_description: z.string().optional(),
    overall_score: z.number().optional(),
    verdict: z.string().optional(),
}, async (args) => {
    const { overall_score, verdict, ...strategy } = args;
    const risk = overall_score !== undefined && verdict
        ? { overall_score, verdict }
        : undefined;
    const result = await apiPost('/deploy-prompt', {
        strategy,
        risk,
    });
    return {
        content: [{ type: 'text', text: result.prompt }],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
