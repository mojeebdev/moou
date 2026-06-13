interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-lg border border-[var(--accent-border)] bg-[var(--void-03)] px-6 py-3.5 text-xs text-[var(--ink-primary)] transition-all duration-400 pointer-events-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ fontFamily: 'var(--font-accent)', transitionTimingFunction: 'var(--ease-out)' }}
    >
      {message}
    </div>
  )
}