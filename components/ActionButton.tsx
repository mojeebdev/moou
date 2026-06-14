'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ActionButtonVariant = 'primary' | 'secondary' | 'ghost'

const VARIANT_CLASS: Record<ActionButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-[#0a0a0a] border border-[var(--accent)] hover:brightness-110',
  secondary:
    'bg-[var(--void-03)] text-[var(--ink-primary)] border border-[var(--accent-border)] hover:bg-[var(--void-04)] hover:border-[var(--accent)]',
  ghost:
    'bg-[var(--void-02)] text-[var(--ink-primary)] border border-[var(--void-05)] hover:border-[var(--accent-border)] hover:text-[var(--ink-primary)]',
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant
  children: ReactNode
}

export default function ActionButton({
  variant = 'ghost',
  children,
  className = '',
  style,
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center px-7 py-4 text-xs uppercase tracking-[0.08em] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${className}`}
      style={{
        fontFamily: 'var(--font-accent)',
        fontWeight: 600,
        borderRadius: 0,
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}