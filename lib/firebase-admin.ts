import { createHash } from 'crypto'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { FieldValue, getFirestore, type Firestore } from 'firebase-admin/firestore'
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/lib/api-constants'

let firestore: Firestore | null = null

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  )
}

export function getDb(): Firestore {
  if (firestore) return firestore

  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials are not configured')
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
  }

  firestore = getFirestore()
  return firestore
}

export function hashClientIp(ip: string): string {
  const salt = process.env.IP_SALT ?? ''
  return createHash('sha256')
    .update(`${ip}${salt}`)
    .digest('base64url')
    .slice(0, 16)
}

/**
 * Returns true if the request is allowed, false if rate limited.
 * Fails open (allows request) if Firestore is unavailable.
 */
export async function checkRateLimit(hashedIp: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return true

  try {
    const db = getDb()
    const ref = db.collection('ratelimits').doc(hashedIp)
    const now = Date.now()

    return db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref)
      const data = snapshot.data() as { count?: number; windowStartMs?: number } | undefined

      if (!data || !data.windowStartMs || now - data.windowStartMs >= RATE_LIMIT_WINDOW_MS) {
        transaction.set(ref, { count: 1, windowStartMs: now, updatedAt: now })
        return true
      }

      const count = data.count ?? 0
      if (count >= RATE_LIMIT_MAX) return false

      transaction.set(
        ref,
        { count: count + 1, windowStartMs: data.windowStartMs, updatedAt: now },
        { merge: true }
      )
      return true
    })
  } catch {
    return true
  }
}

export async function incrementCompilationCount(): Promise<void> {
  if (!isFirebaseConfigured()) return

  try {
    const db = getDb()
    await db
      .collection('stats')
      .doc('global')
      .set({ total_compilations: FieldValue.increment(1) }, { merge: true })
  } catch {
    // silently fail — don't break the main response
  }
}

export async function getCompilationCount(): Promise<number> {
  if (!isFirebaseConfigured()) return 0

  try {
    const db = getDb()
    const snapshot = await db.collection('stats').doc('global').get()
    if (!snapshot.exists) return 0
    const value = snapshot.data()?.total_compilations
    return typeof value === 'number' ? value : 0
  } catch {
    return 0
  }
}