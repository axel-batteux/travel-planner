'use client'

import React, { useState } from 'react'
import { MapPin, PlaneTakeoff, Train, Hotel, Activity, Trash2, Pencil, X, Check } from 'lucide-react'
import { deleteItineraryStage, updateItineraryStage } from '@/app/(authed)/itinerary/actions'

export default function ItineraryStageCard({ stage }: { stage: any }) {
  const [isEditing, setIsEditing] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Vol': return <PlaneTakeoff className="text-blue-500" size={20} />
      case 'Train': return <Train className="text-emerald-500" size={20} />
      case 'Logement': return <Hotel className="text-amber-500" size={20} />
      case 'Activité': return <Activity className="text-rose-500" size={20} />
      default: return <MapPin className="text-primary" size={20} />
    }
  }

  // Obtenir la date au format YYYY-MM-DD pour le champ type="date"
  const defaultDate = new Date(stage.start_date).toISOString().split('T')[0]

  if (isEditing) {
    return (
      <div className="bg-card border border-primary/50 ring-1 ring-primary/20 p-5 rounded-3xl shadow-md w-full relative animate-in fade-in zoom-in-95 duration-200">
        <form 
          action={async (formData) => {
             // on sauvegarde puis on ferme
             await updateItineraryStage(formData)
             setIsEditing(false)
          }} 
          className="space-y-4"
        >
          <input type="hidden" name="id" value={stage.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block ml-1">Date</label>
              <input type="date" name="start_date" defaultValue={defaultDate} required className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block ml-1">Type</label>
              <select name="type" defaultValue={stage.type} className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="Vol">✈️ Vol</option>
                <option value="Train">🚆 Train</option>
                <option value="Logement">🏨 Logement</option>
                <option value="Activité">🎟️ Activité</option>
                <option value="Etape">📍 Trajet</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block ml-1">Titre</label>
            <input name="title" defaultValue={stage.title} required className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Check size={16} />
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:bg-card hover:border-primary/40 transition-all relative group w-full">
      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-4 border-primary rounded-full hidden md:block -left-[54px] shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
      
      <div className="flex items-center gap-5 pr-20">
        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          {getTypeIcon(stage.type)}
        </div>
        <div className="min-w-0">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1.5 opacity-60">{stage.type}</p>
           <h3 className="text-xl font-bold leading-tight tracking-tight truncate">{stage.title}</h3>
        </div>
      </div>

      {/* Actions (always visible slightly, full on hover) */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)} 
          className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors"
          title="Modifier"
        >
          <Pencil size={16} />
        </button>

        <form action={async () => { await deleteItineraryStage(stage.id) }}>
          <button type="submit" className="text-muted-foreground hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Supprimer">
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
