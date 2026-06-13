export const API_VERSION = '1.0.0'
export const DOCS_URL = 'https://usemoou.xyz/docs'

export const VALID_MARKETS = [
  'Crypto Futures',
  'Crypto Spot',
  'US Stocks (Tokenized)',
] as const

export type ValidMarket = (typeof VALID_MARKETS)[number]