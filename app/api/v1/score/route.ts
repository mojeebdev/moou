import { NextRequest } from 'next/server'
import type { Strategy } from '@/lib/types'
import { API_VERSION, DOCS_URL, rateLimitMessage } from '@/lib/api-constants'
import { corsOptions, errorResponse, getClientIp, isValidMarket, jsonResponse } from '@/lib/api-helpers'
import { checkRateLimit, hashClientIp, incrementCompilationCount } from '@/lib/firebase-admin'
import { scoreStrategy } from '@/lib/moou-engine'

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const ip = getClientIp(req)
  const hashedIp = hashClientIp(ip)

  const allowed = await checkRateLimit(hashedIp)
  if (!allowed) {
    return errorResponse(
      'RATE_LIMIT_EXCEEDED',
      rateLimitMessage(),
      429
    )
  }

  let body: {
    strategy?: Partial<Strategy>
    market?: string
    timeframe?: string
  }

  try {
    body = await req.json()
  } catch {
    return errorResponse(
      'MISSING_FIELDS',
      'strategy object, market, and timeframe are required',
      400
    )
  }

  const { strategy, market, timeframe } = body

  if (
    !strategy?.strategy_name ||
    !strategy.entry_conditions ||
    !strategy.exit_conditions ||
    !strategy.position_sizing ||
    !market ||
    !timeframe
  ) {
    return errorResponse(
      'MISSING_FIELDS',
      'strategy (strategy_name, entry_conditions, exit_conditions, position_sizing), market, and timeframe are required',
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

  const risk = await scoreStrategy(strategy as Strategy, market, timeframe)
  if (!risk) {
    return errorResponse('SCORING_FAILED', 'Risk scoring failed. Please try again.', 500)
  }

  await incrementCompilationCount()

  return jsonResponse(
    {
      risk,
      meta: {
        scored_at: new Date().toISOString(),
        model: 'qwen3.6-plus',
        version: API_VERSION,
        processing_ms: Date.now() - startTime,
        powered_by: 'MÓOU 谋',
        docs: DOCS_URL,
      },
    },
    200
  )
}