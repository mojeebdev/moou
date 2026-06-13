import type { Risk, Strategy, VaultEntry, VaultMeta } from './types'

export const VAULT_KEY = 'moou_vault'

export function loadVault(): VaultEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveToVault(strategy: Strategy, risk: Risk, meta: VaultMeta): VaultEntry[] {
  const vault = loadVault()
  const entry: VaultEntry = {
    id: Date.now(),
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    strategy,
    risk,
    meta,
  }
  vault.unshift(entry)
  if (vault.length > 10) vault.pop()
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault))
  return vault
}

export function loadFromVault(id: number): VaultEntry | undefined {
  return loadVault().find((e) => e.id === id)
}