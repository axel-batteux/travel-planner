import { createClient } from '@/utils/supabase/server'
import { CheckSquare, Plus, Trash2, Check } from 'lucide-react'
import { addChecklistItem, toggleChecklistItem, deleteChecklistItem } from './actions'

export default async function ChecklistsPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: lists } = await supabase.from('checklists').select('*').order('is_completed', { ascending: true }).order('title', { ascending: true })
  
  const items = lists || []
  
  // Categorize
  const documents = items.filter(i => i.category === 'Documents')
  const vetements = items.filter(i => i.category === 'Vêtements')
  const aFaire = items.filter(i => i.category === 'À Faire')
  const general = items.filter(i => !['Documents', 'Vêtements', 'À Faire'].includes(i.category))

  const progress = items.length === 0 ? 0 : Math.round((items.filter(i => i.is_completed).length / items.length) * 100)

  const CategorySection = ({ title, data }: { title: string, data: any[] }) => {
    if (data.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
        <div className="space-y-2">
          {data.map(item => (
            <div key={item.id} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${item.is_completed ? 'bg-muted/30 border-transparent opacity-60' : 'bg-card border-border/50 shadow-sm'}`}>
              
              <div className="flex items-center gap-4 flex-1">
                {/* Toggle Action Form */}
                <form action={async () => {
                  'use server'
                  await toggleChecklistItem(item.id, item.is_completed)
                }}>
                  <button type="submit" className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${item.is_completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary'}`}>
                    {item.is_completed && <Check size={14} strokeWidth={4} />}
                  </button>
                </form>
                
                <div>
                  <p className={`font-semibold text-sm ${item.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.title}</p>
                  {item.assigned_to && item.assigned_to !== 'Tous' && (
                    <p className="text-[10px] uppercase font-bold text-primary mt-0.5">{item.assigned_to}</p>
                  )}
                </div>
              </div>

              {/* Delete Action Form */}
              <form action={async () => {
                  'use server'
                  await deleteChecklistItem(item.id)
                }}>
                <button type="submit" className="text-muted-foreground/30 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <CheckSquare className="text-primary" size={32} />
            Préparatifs
          </h1>
          <p className="text-muted-foreground mt-2">Déléguez et synchronisez vos bagages et tâches en direct.</p>
        </div>
        
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs font-bold text-primary text-right">{progress}% Prêt</p>
      </header>

      {/* Ajout Rapide */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-5 shadow-sm sticky top-4 z-10">
        <form className="flex flex-col md:flex-row gap-3" action={addChecklistItem}>
          <input name="title" required className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="Ex: Crème solaire, Renouveler passeport..." />
          
          <div className="flex gap-2">
            <select name="category" className="bg-background/50 border border-border/50 rounded-xl px-3 py-3 text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
              <option value="À Faire">📋 À Faire</option>
              <option value="Vêtements">👕 Vêtements</option>
              <option value="Documents">🛂 Documents</option>
              <option value="Général">📦 Autre</option>
            </select>
            
            <select name="assigned_to" className="bg-background/50 border border-border/50 rounded-xl px-3 py-3 text-xs font-semibold text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
              <option value="Tous">Pour tous</option>
              <option value="Axel">Axel</option>
              <option value="Partenaire">Partenaire</option>
            </select>

            <button type="submit" className="bg-primary text-primary-foreground min-w-[48px] flex items-center justify-center rounded-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="pb-12">
        {items.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-3xl mt-8">
            <p className="text-muted-foreground">La checklist est vide. C'est le moment d'ajouter vos valises !</p>
          </div>
        ) : (
          <div className="space-y-6">
            <CategorySection title="Urgent / À Faire" data={aFaire} />
            <CategorySection title="Documents Officiels" data={documents} />
            <CategorySection title="Vêtements" data={vetements} />
            <CategorySection title="Général & Divers" data={general} />
          </div>
        )}
      </div>
    </div>
  )
}
