'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CompileSection from '@/components/CompileSection'
import Toast from '@/components/Toast'

const OutputSection = dynamic(() => import('@/components/OutputSection'))
const VaultSection = dynamic(() => import('@/components/VaultSection'))
const HowItWorks = dynamic(() => import('@/components/HowItWorks'))
const Footer = dynamic(() => import('@/components/Footer'))
import type { Risk, Strategy, VaultEntry, VaultMeta } from '@/lib/types'
import { loadFromVault, loadVault, saveToVault } from '@/lib/vault'

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [market, setMarket] = useState('Crypto Futures')
  const [timeframe, setTimeframe] = useState('Swing (1H–4H)')
  const [regime, setRegime] = useState('Ranging')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [risk, setRisk] = useState<Risk | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [vault, setVault] = useState<VaultEntry[]>(() => loadVault())
  const [meta, setMeta] = useState<VaultMeta | null>(null)
  const [toast, setToast] = useState('')

  const handleCompile = async () => {
    const trimmed = userInput.trim()
    setError('')

    if (!trimmed || trimmed.length < 20) {
      setError('Describe your strategy in more detail.')
      return
    }

    const currentMeta: VaultMeta = { market, timeframe, regime, userInput: trimmed }
    setMeta(currentMeta)
    setIsLoading(true)
    setLoadingMessage('谋 · Compiling strategy...')

    try {
      const compileRes = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: trimmed, market, timeframe, regime }),
      })

      if (!compileRes.ok) throw new Error('Compile failed')
      const data = await compileRes.json()
      const { risk: riskData, ...strategyData } = data

      setStrategy(strategyData as Strategy)
      setRisk(riskData as Risk)
      setShowOutput(true)

      requestAnimationFrame(() => {
        document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (err) {
      setError('谋 · Signal lost. Check your connection and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  const handleSaveToVault = () => {
    if (!strategy || !risk || !meta) return
    const updated = saveToVault(strategy, risk, meta)
    setVault(updated)
    setToast('Saved to vault ✓')
    setTimeout(() => setToast(''), 2500)
  }

  const handleLoadFromVault = (id: number) => {
    const entry = loadFromVault(id)
    if (!entry) return
    setStrategy(entry.strategy)
    setRisk(entry.risk)
    setMeta(entry.meta)
    setShowOutput(true)
    requestAnimationFrame(() => {
      document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <CompileSection
        userInput={userInput}
        market={market}
        timeframe={timeframe}
        regime={regime}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        error={error}
        onUserInputChange={setUserInput}
        onMarketChange={setMarket}
        onTimeframeChange={setTimeframe}
        onRegimeChange={setRegime}
        onCompile={handleCompile}
      />
      <OutputSection
        strategy={strategy}
        risk={risk}
        isVisible={showOutput}
        onSaveToVault={handleSaveToVault}
      />
      <VaultSection vault={vault} onLoad={handleLoadFromVault} />
      <HowItWorks />
      <Footer />
      <Toast message={toast} visible={!!toast} />
    </main>
  )
}