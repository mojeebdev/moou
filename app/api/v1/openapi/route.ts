import { NextResponse } from 'next/server'
import { getOpenApiSpec } from '@/lib/openapi'

export async function GET() {
  const spec = getOpenApiSpec(
    process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1`
      : 'https://usemoou.xyz/api/v1'
  )

  return NextResponse.json(spec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}