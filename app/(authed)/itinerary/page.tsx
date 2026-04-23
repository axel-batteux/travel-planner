import { createClient } from '@/utils/supabase/server'
import { Map, MapPin, CalendarDays, Plus, Trash2, PlaneTakeoff, Train, Hotel, Activity } from 'lucide-react'
import { addItineraryStage, deleteItineraryStage } from './actions'
import dynamic from 'next/dynamic'

const ItineraryMap = dynamic(() => import('@/components/map/ItineraryMap'), { ssr: false })

export default async function ItineraryPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: stagesData } = await supabase.from('itinerary').select('*').order('start_date', { ascending: true })
  const stages = stagesData || []

  // Group by date (pure string YYYY-MM-DD)
  const groupedStages = stages.reduce((acc, stage) => {
    // start_date vient comme un timestamp
    const dateObj = new Date(stage.start_date)
    const dateKey = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(stage)
    return acc
  }, {} as Record<string, any[]>)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Vol': return <PlaneTakeoff className="text-blue-500" size={20} />
      case 'Train': return <Train className="text-emerald-500" size={20} />
      case 'Logement': return <Hotel className="text-amber-500" size={20} />
      case 'Activité': return <Activity className="text-rose-500" size={20} />
      default: return <MapPin className="text-primary" size={20} />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Map className="text-primary" size={32} />
          Plan de Route
        </h1>
        <p className="text-muted-foreground mt-2">La chronologie de votre aventure pas à pas.</p>
      </header>

      {/* Ajout Rapide Etape */}
      <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20} className="text-primary" /> Nouvelle étape</h2>
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end" action={addItineraryStage}>
          <div className="md:col-span-3">
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block ml-1">Date</label>
            <input type="date" name="start_date" required className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block ml-1">Type</label>
            <select name="type" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
              <option value="Vol">✈️ Vol</option>
              <option value="Train">🚆 Train</option>
              <option value="Logement">🏨 Logement</option>
              <option value="Activité">🎟️ Activité</option>
              <option value="Etape">📍 Trajet</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block ml-1">Titre de l'étape</label>
            <input name="title" required className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="Ex: Vol AF409, Hôtel Shibuya..." />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold h-[46px] rounded-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md shadow-primary/20 cursor-pointer">
              Ajouter
            </button>
          </div>
        </form>
      </div>

      {stages.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-3xl mt-8 flex flex-col items-center">
          <Map className="mx-auto text-muted-foreground/30 mb-4" size={48} />
          <p className="text-muted-foreground font-medium mb-8">Votre itinéraire est vierge. Où allez-vous ?</p>
          <div className="w-full h-80 max-w-2xl mx-auto rounded-3xl overflow-hidden border border-border/50 opacity-50 grayscale pointer-events-none">
             <ItineraryMap stages={[]} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Planisphère sticky */}
          <div className="hidden lg:block h-[calc(100vh-140px)] sticky top-6">
            <ItineraryMap stages={stagesData || []} />
          </div>

          <div className="relative pl-4 md:pl-0">
            <div className="hidden md:block absolute left-[28px] top-4 bottom-0 w-1 bg-border/50 rounded-full" />
            
            <div className="space-y-12">
              {/* Carte mobile - affichée au centre en haut si mobile */}
              <div className="lg:hidden h-[300px] mb-8 w-full rounded-2xl overflow-hidden">
                <ItineraryMap stages={stagesData || []} />
              </div>

              {Object.entries(groupedStages).map(([date, dayStages], dayIndex) => (
                <div key={date} className="relative">
                  {/* Date Badge */}
                  <div className="sticky top-4 z-10 flex mb-6 ml-6 md:ml-0">
                    <div className="bg-background/80 backdrop-blur-xl border shadow-sm px-6 py-2 rounded-full flex items-center gap-2">
                      <CalendarDays size={16} className="text-primary" />
                      <span className="font-bold text-sm capitalize">{date}</span>
                    </div>
                  </div>

                  {/* Stages for this day */}
                  <div className="space-y-6">
                    {(dayStages as any[]).map((stage: any, i: number) => (
                      <div key={stage.id} className="relative flex items-center group w-full pl-6 md:pl-16">
                        <div className="w-full">
                          <div className="bg-card border border-border/50 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative">
                            {/* Point Timeline */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-4 border-primary rounded-full hidden md:block -left-[54px]" />
                            
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                {getTypeIcon(stage.type)}
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{stage.type}</p>
                                 <h3 className="text-lg font-bold leading-tight">{stage.title}</h3>
                              </div>
                            </div>

                            <form action={async () => { 'use server'; await deleteItineraryStage(stage.id) }} className="absolute top-4 right-4">
                              <button type="submit" className="text-muted-foreground/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-muted cursor-pointer">
                                <Trash2 size={16} />
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
