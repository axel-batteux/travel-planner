'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, ArrowRight, RefreshCw } from 'lucide-react'

// Simple static fallback rates (1 EUR = X Currency)
const FALLBACK_RATES: Record<string, { rate: number, label: string }> = {
  USD: { rate: 1.08, label: "Dollar (USD) - États-Unis" },
  GBP: { rate: 0.85, label: "Livre (GBP) - Royaume-Uni" },
  JPY: { rate: 161.50, label: "Yen (JPY) - Japon" },
  CHF: { rate: 0.98, label: "Franc (CHF) - Suisse" },
  CAD: { rate: 1.47, label: "Dollar (CAD) - Canada" },
  AUD: { rate: 1.65, label: "Dollar (AUD) - Australie" },
  KRW: { rate: 1475.00, label: "Won (KRW) - Corée du Sud" }
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('')
  const [currency, setCurrency] = useState('JPY')
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    if (!amount) {
      setResult(null)
      return
    }
    const num = parseFloat(amount)
    if (isNaN(num)) {
      setResult(null)
      return
    }
    
    // Taux : 1 EUR = rate CURRENCY => 1 CURRENCY = 1 / rate EUR
    const rateItem = FALLBACK_RATES[currency]
    const rate = rateItem ? rateItem.rate : 1
    setResult(num / rate)
  }, [amount, currency])

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <Calculator size={80} className="text-primary" />
      </div>
      
      <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-primary">
        <RefreshCw size={16} /> Convertisseur Hors-Ligne
      </h3>

      <div className="flex items-center gap-3 relative z-10">
        <div className="flex-1 bg-background border border-border/50 rounded-xl flex overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all">
           <input 
             type="number" 
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             placeholder="1500"
             className="w-full bg-transparent px-3 py-2 text-sm outline-none font-medium"
           />
           <select 
             value={currency} 
             onChange={(e) => setCurrency(e.target.value)}
             className="bg-muted/50 border-l border-border/50 px-3 py-2 text-xs font-bold outline-none cursor-pointer text-foreground max-w-[200px] truncate"
           >
             {Object.entries(FALLBACK_RATES).map(([key, data]) => (
               <option key={key} value={key}>{data.label}</option>
             ))}
           </select>
        </div>

        <ArrowRight size={16} className="text-muted-foreground shrink-0" />

        <div className="flex-1 bg-background border border-border/50 rounded-xl px-3 py-2 flex items-center justify-between shadow-sm">
           <span className="text-sm font-bold">{result !== null ? result.toFixed(2) : '0.00'}</span>
           <span className="text-xs font-bold text-muted-foreground">EUR</span>
        </div>
      </div>
    </div>
  )
}
