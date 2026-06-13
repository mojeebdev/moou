import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userInput, market, timeframe, regime } = await req.json()

  const response = await fetch('https://hackathon.bitgetops.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.QWEN_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen3.6-plus',
      max_tokens: 1000,
      messages: [
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
Strategy idea: "${userInput}"

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
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Compilation failed' }, { status: 500 })
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