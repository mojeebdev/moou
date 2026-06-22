import type { Risk, Strategy } from '@/lib/types'

export const QWEN_URL = 'https://hackathon.bitgetops.com/v1/chat/completions'
export const QWEN_MODEL = process.env.QWEN_MODEL ?? 'qwen3.6-flash'
const QWEN_TIMEOUT_MS = 90_000

const STRATEGY_KEYS = [
  'strategy_name',
  'entry_conditions',
  'exit_conditions',
  'position_sizing',
  'market_regime',
  'regime_description',
  'playbook_format',
] as const

const RISK_KEYS = [
  'overall_score',
  'verdict',
  'volatility_exposure',
  'volatility_note',
  'drawdown_risk',
  'drawdown_note',
  'leverage_sensitivity',
  'leverage_note',
  'regime_dependency',
  'regime_note',
  'execution_complexity',
  'execution_note',
] as const

function isStrategy(value: unknown): value is Strategy {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return STRATEGY_KEYS.every(
    (key) => typeof record[key] === 'string' && (record[key] as string).trim().length > 0
  )
}

const RISK_SCORE_KEYS = [
  'overall_score',
  'volatility_exposure',
  'drawdown_risk',
  'leverage_sensitivity',
  'regime_dependency',
  'execution_complexity',
] as const

const RISK_NOTE_KEYS = [
  'verdict',
  'volatility_note',
  'drawdown_note',
  'leverage_note',
  'regime_note',
  'execution_note',
] as const

const QUALITATIVE_SCORES: [string, number][] = [
  ['very high', 90],
  ['moderate-high', 65],
  ['moderate high', 65],
  ['moderate-low', 40],
  ['moderate low', 40],
  ['minimal', 15],
  ['extreme', 95],
  ['moderate', 50],
  ['medium', 50],
  ['high', 75],
  ['low', 25],
]

function coerceScore(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(Math.max(0, Math.min(100, value)))
  }
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const direct = Number(trimmed)
  if (!Number.isNaN(direct)) {
    return Math.round(Math.max(0, Math.min(100, direct)))
  }

  const label = trimmed.toLowerCase()
  for (const [token, score] of QUALITATIVE_SCORES) {
    if (label === token || label.includes(token)) return score
  }

  return null
}

function normalizeRisk(value: unknown): Risk | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const normalized: Record<string, unknown> = {}

  for (const key of RISK_SCORE_KEYS) {
    const score = coerceScore(record[key])
    if (score === null) return null
    normalized[key] = score
  }

  for (const key of RISK_NOTE_KEYS) {
    const note = record[key]
    if (typeof note !== 'string' || !note.trim()) return null
    normalized[key] = key === 'verdict' ? note.trim().toUpperCase() : note.trim()
  }

  return normalized as unknown as Risk
}

function splitCombined(value: Record<string, unknown>): { strategy: Strategy; risk: Risk } | null {
  const strategy = Object.fromEntries(STRATEGY_KEYS.map((key) => [key, value[key]]))
  const risk = normalizeRisk(Object.fromEntries(RISK_KEYS.map((key) => [key, value[key]])))
  if (!isStrategy(strategy) || !risk) return null
  return { strategy, risk }
}

async function requestQwen(
  messages: { role: string; content: string }[],
  maxTokens: number,
  jsonMode: boolean
): Promise<Record<string, unknown> | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), QWEN_TIMEOUT_MS)

  try {
    const payload: Record<string, unknown> = {
      model: QWEN_MODEL,
      max_tokens: maxTokens,
      temperature: 0.2,
      messages,
    }
    if (jsonMode) payload.response_format = { type: 'json_object' }

    const response = await fetch(QWEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.QWEN_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) return null

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return null

    const clean = content.replace(/```json|```/g, '').trim()
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    const jsonText = start >= 0 && end > start ? clean.slice(start, end + 1) : clean

    try {
      const parsed = JSON.parse(jsonText)
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
    } catch {
      return null
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function callQwen(
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<Record<string, unknown> | null> {
  if (!process.env.QWEN_KEY) return null

  const jsonResult = await requestQwen(messages, maxTokens, true)
  if (jsonResult) return jsonResult
  return requestQwen(messages, maxTokens, false)
}

export async function compileAndScore(
  idea: string,
  market: string,
  timeframe: string,
  regime: string
): Promise<{ strategy: Strategy; risk: Risk } | null> {
  const parsed = await callQwen(
    [
      {
        role: 'system',
        content:
          'You are MÓOU (谋), a trading strategy compiler and risk scorer. Output one JSON object only. Be concise. Score honestly: most strategies 40-75 overall. No markdown.',
      },
      {
        role: 'user',
        content: `Compile and score this strategy idea.

Market: ${market}
Timeframe: ${timeframe}
Conditions: ${regime}
Idea: "${idea}"

Return JSON with exactly these keys:
strategy_name, entry_conditions, exit_conditions, position_sizing, market_regime, regime_description, playbook_format,
overall_score, verdict, volatility_exposure, volatility_note, drawdown_risk, drawdown_note, leverage_sensitivity, leverage_note, regime_dependency, regime_note, execution_complexity, execution_note

All score fields must be integers from 0 to 100.
verdict must be CONSERVATIVE, MODERATE, AGGRESSIVE, or EXTREME.`,
      },
    ],
    1100
  )

  if (!parsed) return null
  return splitCombined(parsed)
}

export async function compileStrategy(
  strategy: string,
  market: string,
  timeframe: string,
  regime: string
): Promise<Strategy | null> {
  const result = await compileAndScore(strategy, market, timeframe, regime)
  return result?.strategy ?? null
}

export async function scoreStrategy(
  strategy: Strategy,
  market: string,
  timeframe: string
): Promise<Risk | null> {
  const parsed = await callQwen(
    [
      {
        role: 'system',
        content:
          'You are MÓOU risk scorer. Output JSON only. Be calibrated. No markdown.',
      },
      {
        role: 'user',
        content: `Score this strategy.

Name: ${strategy.strategy_name}
Entry: ${strategy.entry_conditions}
Exit: ${strategy.exit_conditions}
Sizing: ${strategy.position_sizing}
Market: ${market}
Timeframe: ${timeframe}

Return JSON: overall_score, verdict, volatility_exposure, volatility_note, drawdown_risk, drawdown_note, leverage_sensitivity, leverage_note, regime_dependency, regime_note, execution_complexity, execution_note. All score fields must be integers from 0 to 100.`,
      },
    ],
    550
  )

  if (!parsed) return null
  return normalizeRisk(parsed)
}