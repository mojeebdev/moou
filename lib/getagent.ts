import type { Risk, Strategy } from '@/lib/types'

export function buildGetagentDeployPrompt(
  strategy: Strategy,
  risk?: Risk,
  options?: { playbookKey?: string }
): string {
  const keyLine = options?.playbookKey
    ? `playbook key: ${options.playbookKey}`
    : 'playbook key: [your Playbook API Key from Bitget Playbook → Create Agent]'

  const riskBlock = risk
    ? `
Pre-compiled risk assessment (MÓOU):
- Overall score: ${risk.overall_score}/100 (${risk.verdict})
- Volatility: ${risk.volatility_exposure} — ${risk.volatility_note}
- Drawdown: ${risk.drawdown_risk} — ${risk.drawdown_note}
- Leverage sensitivity: ${risk.leverage_sensitivity} — ${risk.leverage_note}
- Regime dependency: ${risk.regime_dependency} — ${risk.regime_note}
- Execution complexity: ${risk.execution_complexity} — ${risk.execution_note}
`
    : ''

  return `1. Install getagent using https://www.npmjs.com/package/@bitget-ai/getagent-skill
2. Use getagent to create a strategy playbook from the MÓOU-compiled spec below, then upload, backtest, and publish it
3. Once backtest succeeds, show me the key metrics in a table

Strategy philosophy:
${strategy.playbook_format}

Structured spec (MÓOU):
- Name: ${strategy.strategy_name}
- Entry: ${strategy.entry_conditions}
- Exit: ${strategy.exit_conditions}
- Position sizing: ${strategy.position_sizing}
- Market regime: ${strategy.market_regime} — ${strategy.regime_description}
${riskBlock}
${keyLine}`
}