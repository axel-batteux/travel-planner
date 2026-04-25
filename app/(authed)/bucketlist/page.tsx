import { createClient } from '@/utils/supabase/server'
import { Sparkles, MapPin, Plus, Trash2, CheckCircle2, Navigation } from 'lucide-react'
import { addBucketItem, toggleVisited, deleteBucketItem, convertBucketToItinerary } from './actions'

export default async function BucketlistPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: list } = await supabase.from('bucketlist').select('*').order('is_visited', { ascending: true })
  
  const items = list || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Sparkles className="text-amber-500" size={32} />
          La Bucketlist 🌟
        </h1>
        <p className="text-muted-foreground mt-2">Toutes nos envies, restos, spots photos, et expériences à ne pas manquer.</p>
      </header>

      {/* Ajout Rapide */}
      <div className="bg-card/40 backdrop-blur-3xl border border-border/50 rounded-3xl p-6 shadow-sm">
        <form className="space-y-4" action={addBucketItem}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">L'idée</label>
              <input name="title" required className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 shadow-inner" placeholder="Ex: Manger au Jiro Sushi..." />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">Lien Maps (Optionnel)</label>
              <input name="maps_url" type="url" className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 shadow-inner" placeholder="https://maps.google.com/..." />
            </div>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">Catégorie</label>
              <select name="category" className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer shadow-inner">
                <option value="Restaurant">🍜 Restaurant</option>
                <option value="Point de vue">📸 Point de vue</option>
                <option value="Activité">🎭 Activité</option>
                <option value="Spot Secret">🤫 Spot Secret</option>
                <option value="Envie">💭 Envie</option>
              </select>
            </div>
            <button type="submit" className="bg-amber-500 text-white font-bold h-[54px] px-8 flex items-center justify-center rounded-2xl transition-all hover:bg-amber-600 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20">
              <Plus size={24} /> Ajouter
            </button>
          </div>
        </form>
      </div>

      {/* Mur de Post-its */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {items.map(item => (
          <div key={item.id} className={`group relative flex flex-col p-6 rounded-3xl transition-all transform hover:-translate-y-2 hover:shadow-xl hover:rotate-1 ${item.is_visited ? 'bg-muted/30 border border-dashed border-border/50 opacity-60' : 'bg-gradient-to-br from-[#fff9c4] to-[#fff59d] dark:from-[#3e2723] dark:to-[#4e342e] text-black dark:text-orange-50 shadow-md border hover:border-amber-300'}`}>
            
            {/* Delete button (hidden by default) */}
            <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <form action={async () => { 'use server'; await deleteBucketItem(item.id) }}>
                <button className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black uppercase tracking-widest opacity-60 mix-blend-multiply dark:mix-blend-screen">{item.category}</span>
              <form action={async () => { 'use server'; await toggleVisited(item.id, item.is_visited) }}>
                <button type="submit" className="opacity-40 hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={24} className={item.is_visited ? "text-green-600 dark:text-green-400 opacity-100" : ""} />
                </button>
              </form>
            </div>
            
            <h3 className={`text-xl font-bold font-serif mb-2 leading-tight ${item.is_visited ? 'line-through opacity-50' : ''}`}>{item.title}</h3>
            
            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {item.maps_url && (
                <a href={item.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/10 dark:bg-white/10 px-3 py-1.5 rounded-full hover:bg-black/20 transition-colors">
                  <MapPin size={14} /> Voir sur la carte
                </a>
              )}
              
              {!item.is_visited && (
                <details className="group/details relative">
                  <summary className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-500/30 transition-colors cursor-pointer list-none">
                    <Navigation size={14} /> Ajouter à l'itinéraire
                  </summary>
                  <div className="absolute bottom-full mb-2 left-0 min-w-[200px] p-3 bg-card border border-border shadow-xl rounded-xl z-20 animate-in fade-in zoom-in-95">
                    <form action={convertBucketToItinerary} className="space-y-3">
                      <input type="hidden" name="bucket_id" value={item.id} />
                      <input type="hidden" name="title" value={item.title} />
                      <input type="hidden" name="category" value={item.category} />
                      <input type="hidden" name="maps_url" value={item.maps_url || ''} />
                      <div>
                        <label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Pour quelle date ?</label>
                        <input type="date" name="start_date" required className="w-full text-sm p-2 rounded-lg bg-background border border-border/50 outline-none text-foreground" />
                      </div>
                      <button type="submit" className="w-full bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        Créer l'étape
                      </button>
                    </form>
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-3xl">
            <Sparkles className="mx-auto text-amber-500/50 mb-4" size={48} />
            <p className="text-muted-foreground font-medium">Le carnet d'envies est vide ! Ajoutez votre première pépite.</p>
          </div>
        )}
      </div>
    </div>
  )
}
