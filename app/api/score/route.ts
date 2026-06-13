import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { strategy, market, timeframe } = await req.json()

  const response = await fetch('https://hackathon.bitgetops.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.QWEN_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen3.6-plus',
      max_tokens: 800,
      messages: [
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
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  }

  const data = await response.json()
  const text = data.choices[0].message.content
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 })
  }
}