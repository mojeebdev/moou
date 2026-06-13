import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    markets: [
      { id: 'crypto_futures', label: 'Crypto Futures', exchange: 'Bitget' },
      { id: 'crypto_spot', label: 'Crypto Spot', exchange: 'Bitget' },
      { id: 'us_stocks', label: 'US Stocks (Tokenized)', exchange: 'Bitget' },
    ],
    timeframes: [
      { id: 'scalp', label: 'Scalp', range: '1–15m' },
      { id: 'swing', label: 'Swing', range: '1H–4H' },
      { id: 'position', label: 'Position', range: 'Daily+' },
    ],
    regimes: ['Trending Up', 'Trending Down', 'Ranging', 'Unclear'],
    docs: 'https://usemoou.xyz/docs',
    version: '1.0.0',
  })
}