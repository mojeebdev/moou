import { NextRequest, NextResponse } from 'next/server'
import { DOCS_URL, VALID_MARKETS } from '@/lib/api-constants'

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

export function jsonResponse(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

export function errorResponse(code: string, message: string, status: number) {
  return jsonResponse(
    {
      error: {
        code,
        message,
        docs: DOCS_URL,
      },
    },
    status
  )
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export function isValidMarket(market: string): boolean {
  return (VALID_MARKETS as readonly string[]).includes(market)
}

export function corsOptions() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}