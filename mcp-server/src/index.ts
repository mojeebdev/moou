#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const API_BASE = (process.env.MOOU_API_URL ?? 'https://usemoou.xyz/api/v1').replace(/\/$/, '')

const MARKETS = ['Crypto Futures', 'Crypto Spot', 'US Stocks (Tokenized)'] as const

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) {
    const msg = data?.error?.message ?? `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data as T
}

const server = new McpServer({
  name: 'moou',
  version: '1.0.0',
})

server.tool(
  'moou_compile',
  'Compile a plain-English trading idea into a structured strategy spec with risk score and Bitget Playbook output.',
  {
    strategy: z.string().min(20).describe('Trading idea in plain English'),
    market: z.enum(MARKETS).describe('Target market'),
    timeframe: z
      .string()
      .describe('e.g. Swing (1H–4H), Scalp (1–15m), Position (Daily+)'),
    regime: z
      .string()
      .describe('e.g. Trending Up, Trending Down, Ranging, Unclear'),
  },
  async ({ strategy, market, timeframe, regime }) => {
    const result = await apiPost('/compile', {
      strategy,
      market,
      timeframe,
      regime,
    })

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    }
  }
)

server.tool(
  'moou_score',
  'Score risk for an existing structured strategy across 5 dimensions.',
  {
    strategy_name: z.string(),
    entry_conditions: z.string(),
    exit_conditions: z.string(),
    position_sizing: z.string(),
    market: z.enum(MARKETS),
    timeframe: z.string(),
    market_regime: z.string().optional(),
    regime_description: z.string().optional(),
    playbook_format: z.string().optional(),
  },
  async (args) => {
    const { market, timeframe, ...strategyFields } = args
    const result = await apiPost('/score', {
      strategy: strategyFields,
      market,
      timeframe,
    })

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    }
  }
)

server.tool(
  'moou_deploy_prompt',
  'Generate getagent and GetAgent Studio prompts to deploy a MÓOU-compiled strategy to Bitget Playbook.',
  {
    strategy_name: z.string(),
    entry_conditions: z.string(),
    exit_conditions: z.string(),
    position_sizing: z.string(),
    playbook_format: z.string(),
    market_regime: z.string().optional(),
    regime_description: z.string().optional(),
    overall_score: z.number().optional(),
    verdict: z.string().optional(),
    volatility_exposure: z.number().optional(),
    volatility_note: z.string().optional(),
    drawdown_risk: z.number().optional(),
    drawdown_note: z.string().optional(),
    leverage_sensitivity: z.number().optional(),
    leverage_note: z.string().optional(),
    regime_dependency: z.number().optional(),
    regime_note: z.string().optional(),
    execution_complexity: z.number().optional(),
    execution_note: z.string().optional(),
    playbook_key: z.string().optional(),
  },
  async (args) => {
    const { playbook_key, ...fields } = args
    const strategy = {
      strategy_name: fields.strategy_name,
      entry_conditions: fields.entry_conditions,
      exit_conditions: fields.exit_conditions,
      position_sizing: fields.position_sizing,
      playbook_format: fields.playbook_format,
      market_regime: fields.market_regime ?? '',
      regime_description: fields.regime_description ?? '',
    }

    const riskEntries = [
      ['overall_score', fields.overall_score],
      ['verdict', fields.verdict],
      ['volatility_exposure', fields.volatility_exposure],
      ['volatility_note', fields.volatility_note],
      ['drawdown_risk', fields.drawdown_risk],
      ['drawdown_note', fields.drawdown_note],
      ['leverage_sensitivity', fields.leverage_sensitivity],
      ['leverage_note', fields.leverage_note],
      ['regime_dependency', fields.regime_dependency],
      ['regime_note', fields.regime_note],
      ['execution_complexity', fields.execution_complexity],
      ['execution_note', fields.execution_note],
    ] as const

    const risk = Object.fromEntries(
      riskEntries.filter(([, value]) => value !== undefined)
    )

    const riskPayload = Object.keys(risk).length > 0 ? risk : undefined

    const result = await apiPost<{
      prompt: string
      studio_prompt: string
      getagent_skill: string
      getagent_studio: string
      playbook_explore: string
    }>('/deploy-prompt', {
      strategy,
      risk: riskPayload,
      playbook_key,
    })

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})