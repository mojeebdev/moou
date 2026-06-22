import { NextRequest, NextResponse } from 'next/server'
import type { Strategy } from '@/lib/types'
import { incrementCompilationCount } from '@/lib/firebase-admin'
import { scoreStrategy } from '@/lib/moou-engine'

export async function POST(req: NextRequest) {
  let body: { strategy?: Strategy; market?: string; timeframe?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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
    return NextResponse.json(
      { error: 'strategy (name, entry, exit, sizing), market, and timeframe are required' },
      { status: 400 }
    )
  }

  const risk = await scoreStrategy(strategy, market, timeframe)
  if (!risk) {
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  }

  void incrementCompilationCount()
  return NextResponse.json(risk)
}