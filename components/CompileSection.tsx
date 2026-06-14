'use client'

import dynamic from 'next/dynamic'

const TradingViewChart = dynamic(() => import('@/components/TradingViewChart'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '500px',
        marginBottom: '32px',
        background: '#050508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-accent)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-tertiary)',
      }}
    >
      Loading chart…
    </div>
  ),
})

interface CompileSectionProps {
  userInput: string
  market: string
  timeframe: string
  regime: string
  isLoading: boolean
  loadingMessage: string
  error: string
  onUserInputChange: (v: string) => void
  onMarketChange: (v: string) => void
  onTimeframeChange: (v: string) => void
  onRegimeChange: (v: string) => void
  onCompile: () => void
}

export default function CompileSection({
  userInput,
  market,
  timeframe,
  regime,
  isLoading,
  loadingMessage,
  error,
  onUserInputChange,
  onMarketChange,
  onTimeframeChange,
  onRegimeChange,
  onCompile,
}: CompileSectionProps) {
  return (
    <section
      id="compile"
      className="py-[clamp(80px,10vw,140px)]"
      style={{
        backgroundColor: 'var(--void-01)',
        backgroundImage: 'radial-gradient(circle, var(--void-05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="max-w-[var(--content-max)] mx-auto px-[clamp(24px,6vw,80px)] mb-8">
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: 0 }}>
          <span
            className="block text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] mb-4"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Your Strategy
          </span>
          <h2
            className="leading-tight tracking-[-0.01em]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 64px)',
              maxWidth: '860px',
              margin: '0 auto 32px',
              padding: 0,
            }}
          >
            Describe your trade.
          </h2>

          <div
            className="compile-form-card w-full"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              background: 'var(--void-02)',
              border: '1px solid var(--void-05)',
              borderRadius: 0,
              padding: 'clamp(32px, 5vw, 48px)',
            }}
          >
          <div className="mb-6">
            <label
              htmlFor="strategy-input"
              className="block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)] mb-2"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Strategy Idea
            </label>
            <textarea
              id="strategy-input"
              value={userInput}
              onChange={(e) => onUserInputChange(e.target.value)}
              placeholder="e.g. Buy BTC when RSI drops below 30 on the 4H chart with funding rates negative for 3 consecutive hours. Exit when RSI hits 65 or stop loss at 2% below entry."
              className="w-full min-h-[160px] resize-y border border-[var(--void-05)] bg-[var(--void-03)] p-4 text-base text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
              style={{ fontFamily: 'var(--font-body)', borderRadius: 0 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="market-select"
                className="block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)] mb-2"
                style={{ fontFamily: 'var(--font-accent)' }}
              >
                Market
              </label>
              <select
                id="market-select"
                value={market}
                onChange={(e) => onMarketChange(e.target.value)}
                className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
                style={{ fontFamily: 'var(--font-accent)', borderRadius: 0 }}
              >
                <option>Crypto Futures</option>
                <option>Crypto Spot</option>
                <option>US Stocks (Tokenized)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="timeframe-select"
                className="block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)] mb-2"
                style={{ fontFamily: 'var(--font-accent)' }}
              >
                Timeframe
              </label>
              <select
                id="timeframe-select"
                value={timeframe}
                onChange={(e) => onTimeframeChange(e.target.value)}
                className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
                style={{ fontFamily: 'var(--font-accent)', borderRadius: 0 }}
              >
                <option>Scalp (1–15m)</option>
                <option>Swing (1H–4H)</option>
                <option>Position (Daily+)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="regime-select"
                className="block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)] mb-2"
                style={{ fontFamily: 'var(--font-accent)' }}
              >
                Conditions
              </label>
              <select
                id="regime-select"
                value={regime}
                onChange={(e) => onRegimeChange(e.target.value)}
                className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
                style={{ fontFamily: 'var(--font-accent)', borderRadius: 0 }}
              >
                <option>Trending Up</option>
                <option>Trending Down</option>
                <option>Ranging</option>
                <option>Unclear</option>
              </select>
            </div>
          </div>
          </div>
        </div>
      </div>

      <TradingViewChart />

      <div className="max-w-[var(--content-max)] mx-auto px-[clamp(24px,6vw,80px)]">
        <button
          onClick={onCompile}
          disabled={isLoading}
          className="w-full rounded-lg bg-[var(--accent)] text-black text-[13px] uppercase tracking-[0.1em] transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            fontFamily: 'var(--font-accent)',
            fontWeight: 500,
            height: '56px',
            marginTop: '40px',
          }}
        >
          {isLoading ? (
            <>
              <span className="animate-pulse-dot text-[var(--accent)] mr-2">●</span>
              {loadingMessage}
            </>
          ) : (
            'Compile Strategy →'
          )}
        </button>

        {error && (
          <p
            className="mt-4 text-center text-xs text-[var(--risk-extreme)]"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            {error}
          </p>
        )}
      </div>
    </section>
  )
}