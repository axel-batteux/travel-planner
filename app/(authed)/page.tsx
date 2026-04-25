import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Sparkles, Map, BookOpen, PlaneTakeoff, Train, Hotel, Activity, MapPin, Navigation, ArrowRight, WalletCards } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  if (!supabase) return null

  // Fetch Budget
  const { data: expenses } = await supabase.from('expenses').select('amount')
  const totalSpent = expenses ? expenses.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0

  // Fetch Itinerary count
  const { count: itineraryCount } = await supabase.from('itinerary').select('*', { count: 'exact', head: true })
  
  // Dashboard Intelligent: Programme du jour
  const todayStr = new Date().toISOString().split('T')[0]
  const { data: todayStages } = await supabase.from('itinerary').select('*').like('start_date', `${todayStr}%`).order('start_date', { ascending: true })

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2 font-medium">Prêts pour la prochaine aventure ?</p>
        </div>
        <div className="flex items-center gap-2 bg-card/40 border border-border/50 px-4 py-2 rounded-2xl w-fit">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">En direct</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Le Programme du Jour (Hero Section) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-card to-card/30 border border-border/50 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[300px]">
           <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] rotate-12"><Navigation size={300} /></div>
           <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Programme du jour
           </h2>
           
           {todayStages && todayStages.length > 0 ? (
             <div className="grid gap-4 max-w-2xl">
               {todayStages.map((stage: any) => (
                 <div key={stage.id} className="bg-background/60 backdrop-blur-sm border border-border/40 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 hover:border-primary/50 hover:bg-background/80 transition-all hover:-translate-y-1 group">
                   <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                     {getTypeIcon(stage.type)}
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{stage.type}</p>
                      <h3 className="text-xl font-bold truncate tracking-tight">{stage.title}</h3>
                   </div>
                 </div>
               ))}
               <Link href="/itinerary" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary hover:gap-3 transition-all underline-offset-4 hover:underline">
                 Tout l'itinéraire <ArrowRight size={16} />
               </Link>
             </div>
           ) : (
             <div className="bg-background/20 border border-dashed border-border/50 rounded-[2rem] p-12 text-center text-muted-foreground backdrop-blur-sm">
               <p className="font-semibold text-lg">Journée libre 🌴</p>
               <p className="text-sm opacity-60">Aucune étape n'est enregistrée pour aujourd'hui.</p>
             </div>
           )}
        </div>

        {/* Budget Dynamique */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-border flex flex-col justify-between group hover:border-primary/50 transition-colors relative overflow-hidden h-full">
            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:scale-110 transition-transform"><WalletCards size={150} /></div>
            <div>
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Dépenses totales</h2>
              <p className="text-5xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tabular-nums">{totalSpent.toFixed(2)} €</p>
            </div>
            <Link href="/budget" className="mt-8 inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
              Détails du budget <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/itinerary" className="flex items-center gap-4 bg-card border border-border/50 p-6 rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group">
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <Map size={24} />
             </div>
             <div>
               <h3 className="font-bold">L'Itinéraire</h3>
               <p className="text-xs text-muted-foreground">{itineraryCount || 0} étapes de prévues</p>
             </div>
          </Link>
          
          <Link href="/bucketlist" className="flex items-center gap-4 bg-card border border-border/50 p-6 rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group">
             <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
               <Sparkles size={24} />
             </div>
             <div>
               <h3 className="font-bold">Bucketlist</h3>
               <p className="text-xs text-muted-foreground">Où allez-vous manger ce soir ?</p>
             </div>
          </Link>

          <Link href="/notes" className="flex items-center gap-4 bg-card border border-border/50 p-6 rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
               <BookOpen size={24} />
             </div>
             <div>
               <h3 className="font-bold">Le Carnet</h3>
               <p className="text-xs text-muted-foreground">Toutes vos notes libres et conseils</p>
             </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

