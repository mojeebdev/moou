import { NextRequest } from 'next/server'
import type { Risk, Strategy } from '@/lib/types'
import { API_VERSION, DOCS_URL } from '@/lib/api-constants'
import { corsOptions, errorResponse, jsonResponse } from '@/lib/api-helpers'
import {
  GETAGENT_SKILL_URL,
  GETAGENT_STUDIO_URL,
  PLAYBOOK_EXPLORE_URL,
  buildGetagentDeployPrompt,
  buildStudioPaperTradePrompt,
} from '@/lib/getagent'

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(req: NextRequest) {
  let body: {
    strategy?: Partial<Strategy>
    risk?: Risk
    /** Caller's own Bitget Playbook API key — embedded in prompt, never stored */
    playbook_key?: string
  }

  try {
    body = await req.json()
  } catch {
    return errorResponse('MISSING_FIELDS', 'strategy object is required', 400)
  }

  const { strategy, risk, playbook_key } = body

  if (
    !strategy?.strategy_name ||
    !strategy.entry_conditions ||
    !strategy.exit_conditions ||
    !strategy.position_sizing ||
    !strategy.playbook_format
  ) {
    return errorResponse(
      'MISSING_FIELDS',
      'strategy (strategy_name, entry_conditions, exit_conditions, position_sizing, playbook_format) is required',
      400
    )
  }

  const prompt = buildGetagentDeployPrompt(strategy as Strategy, risk, {
    playbookKey: playbook_key?.trim() || undefined,
  })

  return jsonResponse(
    {
      prompt,
      studio_prompt: buildStudioPaperTradePrompt(strategy as Strategy, risk),
      getagent_skill: GETAGENT_SKILL_URL,
      getagent_studio: GETAGENT_STUDIO_URL,
      playbook_explore: PLAYBOOK_EXPLORE_URL,
      meta: {
        generated_at: new Date().toISOString(),
        version: API_VERSION,
        powered_by: 'MÓOU 谋',
        docs: DOCS_URL,
      },
    },
    200
  )
}