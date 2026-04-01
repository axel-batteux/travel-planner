import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Sparkles, Map, BookOpen } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  if (!supabase) return null

  // Fetch Budget
  const { data: expenses } = await supabase.from('expenses').select('amount')
  const totalSpent = expenses ? expenses.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0

  // Fetch Itinerary count
  const { count: itineraryCount } = await supabase.from('itinerary').select('*', { count: 'exact', head: true })
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2 font-medium">Prêts pour la prochaine aventure ?</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Budget Dynamique */}
        <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-border flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Total Dépensé</h2>
            <p className="text-5xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{totalSpent.toFixed(2)} €</p>
          </div>
          <Link href="/budget" className="mt-8 text-sm font-bold text-primary group-hover:underline w-max">
            Gérer les comptes →
          </Link>
        </div>

        {/* Shortcuts */}
        <div className="space-y-4">
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

