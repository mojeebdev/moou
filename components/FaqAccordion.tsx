'use client'

import { useState } from 'react'

const FAQ_ITEMS = [
  {
    question: 'What is MÓOU?',
    answer:
      'MÓOU (谋) is a natural language trading strategy compiler. Describe any trade idea in plain English — MÓOU outputs a structured strategy spec, risk score, and Bitget Playbook-ready format.',
  },
  {
    question: 'Is this financial advice?',
    answer:
      'No. MÓOU generates structured interpretations of trading ideas using AI. All outputs are for educational and planning purposes only. Always do your own research before trading.',
  },
  {
    question: 'What markets does it support?',
    answer: "Crypto Futures, Crypto Spot, and Tokenized US Stocks — all via Bitget's platform.",
  },
  {
    question: 'Which AI model powers MÓOU?',
    answer: 'Qwen3.6-plus by Alibaba Cloud, accessed via the Bitget hackathon API proxy endpoint.',
  },
  {
    question: 'Is my strategy data saved?',
    answer:
      'Strategies are saved locally in your browser via localStorage. No data is sent to any external database. Your strategies are yours.',
  },
  {
    question: 'Can I deploy the compiled strategy directly?',
    answer:
      "Yes. The Playbook Output section generates Bitget Playbook-ready text you can copy directly into Bitget's platform.",
  },
] as const

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" style={{ padding: '120px clamp(24px, 6vw, 80px)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: 'var(--ink-primary)',
            marginBottom: '48px',
          }}
        >
          Questions.
        </h2>

        <div>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.question} style={{ borderBottom: '1px solid var(--void-05)' }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left bg-transparent border-0 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: isOpen ? 'var(--accent)' : 'var(--ink-primary)',
                    padding: '20px 0',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.question}
                </button>
                {isOpen && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 400,
                      fontSize: '15px',
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.8,
                      paddingBottom: '20px',
                      margin: 0,
                    }}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}