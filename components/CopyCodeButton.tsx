'use client'

import { useState } from 'react'

interface CopyCodeButtonProps {
  text: string
  label?: string
}

export default function CopyCodeButton({ text, label = 'Copy' }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center px-7 py-4 border border-[var(--void-05)] text-[var(--ink-secondary)] text-xs uppercase tracking-[0.08em] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--ink-primary)]"
      style={{
        fontFamily: 'var(--font-accent)',
        borderRadius: 0,
        cursor: 'pointer',
        background: 'transparent',
        marginTop: '16px',
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}