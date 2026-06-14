import { API_VERSION } from '@/lib/api-constants'

export function getOpenApiSpec(baseUrl = 'https://usemoou.xyz/api/v1') {
  return {
    openapi: '3.1.0',
    info: {
      title: 'MÓOU Public API',
      version: API_VERSION,
      description:
        'Compile plain-English trading ideas into structured strategy specs with multi-dimensional risk scoring. Bitget Playbook-ready output.',
      contact: { url: 'https://usemoou.xyz/docs' },
    },
    servers: [{ url: baseUrl }],
    paths: {
      '/health': {
        get: {
          summary: 'Liveness probe',
          responses: { '200': { description: 'Service operational' } },
        },
      },
      '/markets': {
        get: {
          summary: 'Supported markets, timeframes, regimes',
          responses: { '200': { description: 'Discovery metadata' } },
        },
      },
      '/stats': {
        get: {
          summary: 'Total compilation count',
          responses: { '200': { description: 'Usage statistics' } },
        },
      },
      '/compile': {
        post: {
          summary: 'Compile + score a strategy',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['strategy', 'market', 'timeframe', 'regime'],
                  properties: {
                    strategy: { type: 'string', minLength: 1 },
                    market: {
                      type: 'string',
                      enum: ['Crypto Futures', 'Crypto Spot', 'US Stocks (Tokenized)'],
                    },
                    timeframe: { type: 'string' },
                    regime: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Compiled strategy with risk score' },
            '400': { description: 'Validation error' },
            '429': { description: 'Rate limit exceeded' },
            '500': { description: 'Compilation failed' },
          },
        },
      },
      '/score': {
        post: {
          summary: 'Score an existing structured strategy',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['strategy', 'market', 'timeframe'],
                  properties: {
                    strategy: { $ref: '#/components/schemas/StrategyInput' },
                    market: { type: 'string' },
                    timeframe: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Risk assessment' },
            '400': { description: 'Validation error' },
            '429': { description: 'Rate limit exceeded' },
            '500': { description: 'Scoring failed' },
          },
        },
      },
      '/deploy-prompt': {
        post: {
          summary: 'Generate getagent Playbook deploy prompt',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['strategy'],
                  properties: {
                    strategy: { $ref: '#/components/schemas/StrategyFull' },
                    risk: { $ref: '#/components/schemas/Risk' },
                    playbook_key: {
                      type: 'string',
                      description: 'Your Bitget Playbook API key — embedded in prompt, never stored',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'getagent-ready deploy prompt' },
            '400': { description: 'Validation error' },
          },
        },
      },
    },
    components: {
      schemas: {
        StrategyInput: {
          type: 'object',
          required: [
            'strategy_name',
            'entry_conditions',
            'exit_conditions',
            'position_sizing',
          ],
          properties: {
            strategy_name: { type: 'string' },
            entry_conditions: { type: 'string' },
            exit_conditions: { type: 'string' },
            position_sizing: { type: 'string' },
            market_regime: { type: 'string' },
            regime_description: { type: 'string' },
            playbook_format: { type: 'string' },
          },
        },
        StrategyFull: {
          allOf: [
            { $ref: '#/components/schemas/StrategyInput' },
            {
              type: 'object',
              required: ['playbook_format'],
            },
          ],
        },
        Risk: {
          type: 'object',
          properties: {
            overall_score: { type: 'integer', minimum: 0, maximum: 100 },
            verdict: {
              type: 'string',
              enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'EXTREME'],
            },
            volatility_exposure: { type: 'integer' },
            volatility_note: { type: 'string' },
            drawdown_risk: { type: 'integer' },
            drawdown_note: { type: 'string' },
            leverage_sensitivity: { type: 'integer' },
            leverage_note: { type: 'string' },
            regime_dependency: { type: 'integer' },
            regime_note: { type: 'string' },
            execution_complexity: { type: 'integer' },
            execution_note: { type: 'string' },
          },
        },
      },
    },
  }
}