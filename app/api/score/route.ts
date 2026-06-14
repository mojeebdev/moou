import { NextRequest, NextResponse } from 'next/server'
import type { Strategy } from '@/lib/types'
import { incrementCompilationCount } from '@/lib/firebase-admin'
import { scoreStrategy } from '@/lib/moou-engine'

export async function POST(req: NextRequest) {
  const { strategy, market, timeframe } = await req.json()

  const risk = await scoreStrategy(strategy as Strategy, market, timeframe)
  if (!risk) {
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  }

  await incrementCompilationCount()
  return NextResponse.json(risk)
}