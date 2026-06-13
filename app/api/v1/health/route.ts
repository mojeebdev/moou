import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    model: 'qwen3.6-plus',
    endpoint: 'https://hackathon.bitgetops.com/v1',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    powered_by: 'MÓOU 谋 · usemoou.xyz',
  })
}