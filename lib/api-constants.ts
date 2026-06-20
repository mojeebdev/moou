export const API_VERSION = '1.0.0'
export const DOCS_URL = 'https://usemoou.xyz/docs'

/** Public API rate cap per IP per hour. Override with RATE_LIMIT_MAX env on Vercel. */
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 30)

export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

export function rateLimitMessage(): string {
  return `${RATE_LIMIT_MAX} requests per hour per IP. Try again later.`
}

export const SUPPORT = {
  github: 'https://github.com/mojeebdev/moou/issues',
  x: 'https://x.com/tmojeeb',
  telegram: 'https://t.me/+o1tYqQ_lXxllYjgy',
  email: 'support@usemoou.xyz',
} as const

export const SUPPORT_MAILTO = `mailto:${SUPPORT.email}`

export const VALID_MARKETS = [
  'Crypto Futures',
  'Crypto Spot',
  'US Stocks (Tokenized)',
] as const

export type ValidMarket = (typeof VALID_MARKETS)[number]