import { NextResponse } from 'next/server'
import { API_VERSION } from '@/lib/api-constants'
import { getCompilationCount } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const total = await getCompilationCount()
    return NextResponse.json(
      {
        total_compilations: total,
        status: 'operational',
        version: API_VERSION,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch {
    return NextResponse.json({
      total_compilations: 0,
      status: 'operational',
      version: API_VERSION,
    })
  }
}