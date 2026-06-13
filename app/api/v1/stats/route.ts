import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { API_VERSION } from '@/lib/api-constants'

export async function GET() {
  try {
    const total = (await kv.get<number>('moou_total_compilations')) ?? 0
    return NextResponse.json({
      total_compilations: total,
      status: 'operational',
      version: API_VERSION,
    })
  } catch {
    return NextResponse.json({
      total_compilations: 0,
      status: 'operational',
      version: API_VERSION,
    })
  }
}