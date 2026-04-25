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
  KRW: { rate: 1475.00, label: "Won (KRW) - Corée du Sud" },
  THB: { rate: 39.50, label: "Baht (THB) - Thaïlande" },
  VND: { rate: 27500.00, label: "Dong (VND) - Vietnam" },
  LAK: { rate: 23000.00, label: "Kip (LAK) - Laos" },
  KHR: { rate: 4350.00, label: "Riel (KHR) - Cambodge" },
  IDR: { rate: 17500.00, label: "Roupie (IDR) - Indonésie" },
  PHP: { rate: 62.00, label: "Peso (PHP) - Philippines" },
  MYR: { rate: 5.10, label: "Ringgit (MYR) - Malaisie" }
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

      <div className="flex flex-col gap-4 relative z-10">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Montant local</label>
          <div className="flex bg-background border border-border/50 rounded-2xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-primary/20 transition-all h-14">
             <input 
               type="number" 
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               placeholder="Ex: 1500"
               className="flex-1 bg-transparent px-4 text-base outline-none font-bold"
             />
             <select 
               value={currency} 
               onChange={(e) => setCurrency(e.target.value)}
               className="bg-muted/30 border-l border-border/50 px-4 text-xs font-black outline-none cursor-pointer text-foreground min-w-[120px]"
             >
               {Object.entries(FALLBACK_RATES).map(([key, data]) => (
                 <option key={key} value={key} className="bg-background text-foreground">{data.label}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary rotate-90 md:rotate-0">
                <ArrowRight size={16} />
            </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Conversion en Euros</label>
          <div className="bg-primary border border-primary/20 rounded-2xl px-5 h-14 flex items-center justify-between shadow-lg shadow-primary/20">
             <span className="text-xl font-black text-primary-foreground">{result !== null ? result.toFixed(2) : '0.00'}</span>
             <span className="text-xs font-black bg-white/20 text-white px-2 py-1 rounded-lg">EUR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
