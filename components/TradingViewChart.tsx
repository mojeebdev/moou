'use client'

import { useEffect, useRef, useState } from 'react'

const WIDGET_CONTAINER_ID = 'moou-tradingview-chart'
const TV_SCRIPT_SRC = 'https://s3.tradingview.com/tv.js'

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => void
    }
  }
}

function getChartHeight() {
  if (typeof window === 'undefined') return 500
  return window.innerWidth <= 768 ? 300 : 500
}

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)
  const widgetReady = useRef(false)
  const [chartHeight, setChartHeight] = useState(500)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const updateHeight = () => setChartHeight(getChartHeight())
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  useEffect(() => {
    const el = gateRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '240px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return
    widgetReady.current = false
    if (containerRef.current) containerRef.current.innerHTML = ''

    const mountWidget = () => {
      if (widgetReady.current || !window.TradingView || !containerRef.current) return

      containerRef.current.innerHTML = ''
      widgetReady.current = true

      new window.TradingView.widget({
        symbol: 'BITGET:BTCUSDT',
        interval: '240',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#0C0C12',
        backgroundColor: '#050508',
        gridColor: 'rgba(44,44,58,0.5)',
        allow_symbol_change: true,
        save_image: false,
        hide_side_toolbar: false,
        withdateranges: true,
        details: true,
        hotlist: true,
        calendar: false,
        width: '100%',
        height: chartHeight,
        container_id: WIDGET_CONTAINER_ID,
      })
    }

    if (window.TradingView) {
      mountWidget()
      return () => {
        widgetReady.current = false
        if (containerRef.current) containerRef.current.innerHTML = ''
      }
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${TV_SCRIPT_SRC}"]`)

    if (!script) {
      script = document.createElement('script')
      script.src = TV_SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', mountWidget)
    if (window.TradingView) mountWidget()

    return () => {
      script?.removeEventListener('load', mountWidget)
      widgetReady.current = false
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [chartHeight, shouldLoad])

  return (
    <div ref={gateRef} style={{ width: '100%', margin: 0, marginBottom: '32px' }}>
      <p
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-tertiary)',
          textAlign: 'center',
          padding: '0 clamp(24px, 6vw, 80px)',
          marginBottom: '12px',
        }}
      >
        Live Chart · Search any Bitget asset
      </p>

      <div
        id={WIDGET_CONTAINER_ID}
        ref={containerRef}
        className="chart-container"
        style={{ width: '100%', height: `${chartHeight}px`, margin: 0, background: '#050508' }}
      >
        {!shouldLoad && (
          <div
            className="chart-loading"
            style={{
              width: '100%',
              height: '100%',
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
            Chart loads when in view
          </div>
        )}
      </div>
    </div>
  )
}