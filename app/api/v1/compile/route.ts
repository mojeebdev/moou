// SETUP: Firebase Firestore for rate limiting (ratelimits) and stats (stats/global).
// Env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, IP_SALT
// If Firebase is not configured, rate limit fails open and counter is skipped.

import { NextRequest, NextResponse } from 'next/server'
import type { Risk, Strategy } from '@/lib/types'
import { API_VERSION, DOCS_URL, VALID_MARKETS } from '@/lib/api-constants'
import { checkRateLimit, hashClientIp, incrementCompilationCount } from '@/lib/firebase-admin'

const QWEN_URL = 'https://hackathon.bitgetops.com/v1/chat/completions'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

function jsonResponse(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

function errorResponse(code: string, message: string, status: number) {
  return jsonResponse(
    {
      error: {
        code,
        message,
        docs: DOCS_URL,
      },
    },
    status
  )
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isValidMarket(market: string): boolean {
  return (VALID_MARKETS as readonly string[]).includes(market)
}

async function callQwen(messages: { role: string; content: string }[], maxTokens: number) {
  const response = await fetch(QWEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.QWEN_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen3.6-plus',
      max_tokens: maxTokens,
      messages,
    }),
  })

  if (!response.ok) return null

  const data = await response.json()
  const text = data.choices[0].message.content as string
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    return null
  }
}

async function compileStrategy(
  strategy: string,
  market: string,
  timeframe: string,
  regime: string
): Promise<Strategy | null> {
  return callQwen(
    [
      {
        role: 'system',
        content: `You are MÓOU (谋), an elite trading strategy compiler. Your name comes from the Chinese concept of deep strategic foresight — the calculated thinking that precedes every successful trade. Transform plain-language trading ideas into precise structured strategy specs. You understand crypto futures, spot markets, and tokenized US stocks. Be clinical, precise, never vague. Output ONLY valid JSON. No markdown. No preamble. No text outside the JSON.`,
      },
      {
        role: 'user',
        content: `Compile this trading strategy:

Market: ${market}
Timeframe: ${timeframe}
Current market conditions: ${regime}
Strategy idea: "${strategy}"

Output ONLY this exact JSON:
{
  "strategy_name": "memorable 2-4 word name",
  "entry_conditions": "precise entry logic in 2-3 sentences",
  "exit_conditions": "exit logic with stop loss and take profit in 2-3 sentences",
  "position_sizing": "sizing methodology in 1-2 sentences",
  "market_regime": "trending | ranging | neutral",
  "regime_description": "one sentence on when this strategy performs best",
  "playbook_format": "full strategy as Bitget Playbook instruction covering philosophy, entry, exit, risk management in 3-4 sentences"
}`,
      },
    ],
    1000
  )
}

async function scoreStrategy(
  strategy: Strategy,
  market: string,
  timeframe: string
): Promise<Risk | null> {
  return callQwen(
    [
      {
        role: 'system',
        content: `You are MÓOU's risk assessment engine. Score trading strategies honestly across 5 dimensions. Be calibrated — most retail strategies score 40–75 overall. Never give perfect scores. Strategies without stop losses score higher on drawdown risk. Scalp strategies score higher on execution complexity. Output ONLY valid JSON. No markdown. No preamble.`,
      },
      {
        role: 'user',
        content: `Score the risk of this strategy:

Name: ${strategy.strategy_name}
Entry: ${strategy.entry_conditions}
Exit: ${strategy.exit_conditions}
Position Sizing: ${strategy.position_sizing}
Market: ${market}
Timeframe: ${timeframe}

Output ONLY this exact JSON:
{
  "overall_score": <0-100>,
  "verdict": "CONSERVATIVE | MODERATE | AGGRESSIVE | EXTREME",
  "volatility_exposure": <0-100>,
  "volatility_note": "one plain English sentence",
  "drawdown_risk": <0-100>,
  "drawdown_note": "one plain English sentence",
  "leverage_sensitivity": <0-100>,
  "leverage_note": "one plain English sentence",
  "regime_dependency": <0-100>,
  "regime_note": "one plain English sentence",
  "execution_complexity": <0-100>,
  "execution_note": "one plain English sentence"
}`,
      },
    ],
    800
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIp(req)
  const hashedIp = hashClientIp(ip)

  const allowed = await checkRateLimit(hashedIp)
  if (!allowed) {
    return errorResponse(
      'RATE_LIMIT_EXCEEDED',
      '10 requests per hour per IP. Try again later.',
      429
    )
  }

  let body: { strategy?: string; market?: string; timeframe?: string; regime?: string }

  try {
    body = await req.json()
  } catch {
    return errorResponse(
      'MISSING_FIELDS',
      'strategy, market, timeframe and regime are required',
      400
    )
  }

  const { strategy, market, timeframe, regime } = body

  if (!strategy?.trim() || !market || !timeframe || !regime) {
    return errorResponse(
      'MISSING_FIELDS',
      'strategy, market, timeframe and regime are required',
      400
    )
  }

  if (!isValidMarket(market)) {
    return errorResponse(
      'INVALID_MARKET',
      'market must be one of: Crypto Futures, Crypto Spot, US Stocks (Tokenized)',
      400
    )
  }

  const compiled = await compileStrategy(strategy.trim(), market, timeframe, regime)
  if (!compiled) {
    return errorResponse(
      'COMPILATION_FAILED',
      'Strategy compilation failed. Please try again.',
      500
    )
  }

  const risk = await scoreStrategy(compiled, market, timeframe)
  if (!risk) {
    return errorResponse(
      'COMPILATION_FAILED',
      'Strategy compilation failed. Please try again.',
      500
    )
  }

  const processingMs = Date.now() - startTime

  const responseBody = {
    strategy_name: compiled.strategy_name,
    entry_conditions: compiled.entry_conditions,
    exit_conditions: compiled.exit_conditions,
    position_sizing: compiled.position_sizing,
    market_regime: compiled.market_regime,
    regime_description: compiled.regime_description,
    playbook_format: compiled.playbook_format,
    risk,
    meta: {
      compiled_at: new Date().toISOString(),
      model: 'qwen3.6-plus',
      version: API_VERSION,
      processing_ms: processingMs,
      powered_by: 'MÓOU 谋',
      docs: DOCS_URL,
    },
  }

  await incrementCompilationCount()

  return jsonResponse(responseBody, 200)
}