export interface Strategy {
  strategy_name: string
  entry_conditions: string
  exit_conditions: string
  position_sizing: string
  market_regime: string
  regime_description: string
  playbook_format: string
}

export interface Risk {
  overall_score: number
  verdict: string
  volatility_exposure: number
  volatility_note: string
  drawdown_risk: number
  drawdown_note: string
  leverage_sensitivity: number
  leverage_note: string
  regime_dependency: number
  regime_note: string
  execution_complexity: number
  execution_note: string
}

export interface VaultMeta {
  market: string
  timeframe: string
  regime: string
  userInput: string
}

export interface VaultEntry {
  id: number
  timestamp: string
  strategy: Strategy
  risk: Risk
  meta: VaultMeta
}