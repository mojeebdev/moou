import { NextResponse } from 'next/server'
import { QWEN_MODEL } from '@/lib/moou-engine'

export async function GET() {
  return NextResponse.json(
    {
      status: 'operational',
      model: QWEN_MODEL,
      endpoint: 'https://hackathon.bitgetops.com/v1',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      powered_by: 'MÓOU 谋 · usemoou.xyz',
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    }
  )
}