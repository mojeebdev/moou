'use client'

import { useState } from 'react'
import ActionButton, { type ActionButtonVariant } from '@/components/ActionButton'

interface CopyCodeButtonProps {
  text: string
  label?: string
  variant?: ActionButtonVariant
}

export default function CopyCodeButton({
  text,
  label = 'Copy',
  variant = 'primary',
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ActionButton variant={variant} onClick={handleCopy} style={{ marginTop: '16px' }}>
      {copied ? 'Copied ✓' : label}
    </ActionButton>
  )
}