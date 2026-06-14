import { NextResponse } from 'next/server'
import { API_VERSION } from '@/lib/api-constants'
import { getCompilationCount } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const total = await getCompilationCount()
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