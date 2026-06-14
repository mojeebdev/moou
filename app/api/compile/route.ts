import { NextRequest, NextResponse } from 'next/server'
import { compileStrategy } from '@/lib/moou-engine'

export async function POST(req: NextRequest) {
  const { userInput, market, timeframe, regime } = await req.json()

  const compiled = await compileStrategy(userInput, market, timeframe, regime)
  if (!compiled) {
    return NextResponse.json({ error: 'Compilation failed' }, { status: 500 })
  }

  return NextResponse.json(compiled)
}