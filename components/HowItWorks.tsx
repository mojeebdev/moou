import Link from 'next/link'

const STEPS = [
  {
    num: '01',
    icon: '谋',
    title: 'Describe your idea',
    body: 'Write your trade thesis in plain English. No indicators. No code. Just your thinking.',
  },
  {
    num: '02',
    icon: '◈',
    title: 'MÓOU structures it',
    body: 'Qwen3.6-plus reads your idea and outputs a complete strategy spec — entry, exit, sizing, and regime fit.',
  },
  {
    num: '03',
    icon: '→',
    title: 'Deploy to Bitget',
    body: (
      <>
        Copy for Playbook, use the getagent deploy prompt, or paper-trade on{' '}
        <a href="https://getagent.studio/" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
          GetAgent Studio
        </a>
        . See the{' '}
        <Link href="/guide" style={{ color: 'var(--accent)' }}>
          User Guide
        </Link>
        .
      </>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--void-02)] border-t border-b border-[var(--void-05)]"
      style={{ paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="section-inner">
        <span
          className="block text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]"
          style={{ fontFamily: 'var(--font-accent)', marginBottom: '16px' }}
        >
          The Process
        </span>
        <h2
          className="leading-tight italic text-left"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 56px)',
            marginBottom: '64px',
          }}
        >
          Strategy before signal.
        </h2>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto"
          style={{ maxWidth: '1200px' }}
        >
          {STEPS.map((step) => (
            <article
              key={step.num}
              className="rounded-2xl border border-[var(--void-05)] bg-[var(--void-03)] text-center"
              style={{ padding: '40px 32px' }}
            >
              <span
                className="block uppercase"
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: '10px',
                  color: 'var(--ink-tertiary)',
                  marginBottom: '24px',
                  letterSpacing: '0.12em',
                }}
              >
                {step.num}
              </span>
              <span
                className="block text-[var(--accent)]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '48px',
                  marginBottom: '16px',
                  lineHeight: 1,
                }}
              >
                {step.icon}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: 'var(--ink-primary)',
                  marginBottom: '12px',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'var(--ink-secondary)',
                  maxWidth: '240px',
                  margin: '0 auto',
                }}
              >
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}