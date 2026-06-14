'use client'

import { useEffect, useRef, useState } from 'react'

const WIDGET_SCRIPT_SRC =
  'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'

const CHART_CONFIG = {
  autosize: true,
  symbol: 'BITGET:BTCUSDT',
  interval: '240',
  timezone: 'Etc/UTC',
  theme: 'dark',
  style: '1',
  locale: 'en',
  allow_symbol_change: true,
  backgroundColor: '#050508',
  gridColor: 'rgba(44,44,58,0.5)',
  hide_top_toolbar: false,
  hide_legend: false,
  hide_side_toolbar: false,
  save_image: false,
  support_host: 'https://www.tradingview.com',
}

function getChartHeight() {
  if (typeof window === 'undefined') return 500
  return window.innerWidth <= 768 ? 300 : 500
}

function preloadChartScript() {
  if (document.querySelector(`script[src="${WIDGET_SCRIPT_SRC}"]`)) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'script'
  link.href = WIDGET_SCRIPT_SRC
  document.head.appendChild(link)
}

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gateRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)
  const [chartHeight, setChartHeight] = useState(500)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    preloadChartScript()

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
      { rootMargin: '600px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad || !containerRef.current) return

    mountedRef.current = false
    setIsLoading(true)
    containerRef.current.innerHTML = ''

    const wrapper = document.createElement('div')
    wrapper.className = 'tradingview-widget-container'
    wrapper.style.cssText = 'width:100%;height:100%;margin:0;'

    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container__widget'
    widget.style.cssText = 'width:100%;height:100%;'

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = WIDGET_SCRIPT_SRC
    script.async = true
    script.textContent = JSON.stringify(CHART_CONFIG)

    const markLoaded = () => {
      if (!mountedRef.current) {
        mountedRef.current = true
        setIsLoading(false)
      }
    }

    const iframeObserver = new MutationObserver(() => {
      if (containerRef.current?.querySelector('iframe')) {
        markLoaded()
        iframeObserver.disconnect()
      }
    })

    iframeObserver.observe(containerRef.current, { childList: true, subtree: true })
    script.addEventListener('load', markLoaded)
    const fallbackTimer = window.setTimeout(markLoaded, 5000)

    wrapper.appendChild(widget)
    wrapper.appendChild(script)
    containerRef.current.appendChild(wrapper)

    return () => {
      iframeObserver.disconnect()
      script.removeEventListener('load', markLoaded)
      window.clearTimeout(fallbackTimer)
      mountedRef.current = false
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [shouldLoad])

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
        ref={containerRef}
        className="chart-container"
        style={{
          width: '100%',
          height: `${chartHeight}px`,
          margin: 0,
          background: '#050508',
          position: 'relative',
        }}
      >
        {(!shouldLoad || isLoading) && (
          <div
            className="chart-loading"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-tertiary)',
              background: '#050508',
              zIndex: 1,
            }}
          >
            <div className="chart-spinner" />
            {shouldLoad ? 'Loading chart…' : 'Chart loads when in view'}
          </div>
        )}
      </div>
    </div>
  )
}