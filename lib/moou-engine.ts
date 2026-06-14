import type { Risk, Strategy } from '@/lib/types'

export const QWEN_URL = 'https://hackathon.bitgetops.com/v1/chat/completions'
export const QWEN_MODEL = 'qwen3.6-plus'

async function callQwen(messages: { role: string; content: string }[], maxTokens: number) {
  const response = await fetch(QWEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.QWEN_KEY}`,
    },
    body: JSON.stringify({
      model: QWEN_MODEL,
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

export async function compileStrategy(
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

export async function scoreStrategy(
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