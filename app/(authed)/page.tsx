import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Sparkles, Map, BookOpen, PlaneTakeoff, Train, Hotel, Activity, MapPin, Navigation } from 'lucide-react'

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
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2 font-medium">Prêts pour la prochaine aventure ?</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Le Programme du Jour (Hero Section) */}
        <div className="lg:col-span-8 bg-card border border-border/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Navigation size={150} /></div>
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Votre programme pour aujourd'hui</h2>
           
           {todayStages && todayStages.length > 0 ? (
             <div className="space-y-4">
               {todayStages.map((stage: any) => (
                 <div key={stage.id} className="bg-background border border-border/50 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-primary/50 transition-colors">
                   <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                     {getTypeIcon(stage.type)}
                   </div>
                   <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stage.type}</p>
                      <h3 className="text-lg font-bold">{stage.title}</h3>
                   </div>
                 </div>
               ))}
               <Link href="/itinerary" className="inline-block mt-4 text-sm font-bold text-primary hover:underline">
                 Voir tout l'itinéraire →
               </Link>
             </div>
           ) : (
             <div className="bg-background/50 border border-dashed border-border/50 rounded-2xl p-8 text-center text-muted-foreground">
               <p className="font-medium">Rien de prévu au programme aujourd'hui. Profitez-en pour vous détendre ou flâner ! ☀️</p>
             </div>
           )}
        </div>

        {/* Budget Dynamique */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between group hover:border-primary/50 transition-colors h-full">
            <div>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Dépensé</h2>
              <p className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{totalSpent.toFixed(2)} €</p>
            </div>
            <Link href="/budget" className="mt-4 text-xs font-bold text-primary group-hover:underline w-max">
              Gérer les comptes →
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

