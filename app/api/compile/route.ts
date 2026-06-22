import { NextRequest, NextResponse } from 'next/server'
import { incrementCompilationCount } from '@/lib/firebase-admin'
import { compileAndScore } from '@/lib/moou-engine'

export async function POST(req: NextRequest) {
  let body: { userInput?: string; market?: string; timeframe?: string; regime?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { userInput, market, timeframe, regime } = body
  const trimmed = userInput?.trim() ?? ''

  if (!trimmed || trimmed.length < 20 || !market || !timeframe || !regime) {
    return NextResponse.json(
      { error: 'userInput (20+ chars), market, timeframe, and regime are required' },
      { status: 400 }
    )
  }

  const result = await compileAndScore(trimmed, market, timeframe, regime)
  if (!result) {
    return NextResponse.json({ error: 'Compilation failed' }, { status: 500 })
  }

  void incrementCompilationCount()

  return NextResponse.json({
    ...result.strategy,
    risk: result.risk,
  })
}