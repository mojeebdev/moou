import { NextRequest } from 'next/server'
import { API_VERSION, DOCS_URL, rateLimitMessage } from '@/lib/api-constants'
import { corsOptions, errorResponse, getClientIp, isValidMarket, jsonResponse } from '@/lib/api-helpers'
import { checkRateLimit, hashClientIp, incrementCompilationCount } from '@/lib/firebase-admin'
import { compileStrategy, scoreStrategy } from '@/lib/moou-engine'

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