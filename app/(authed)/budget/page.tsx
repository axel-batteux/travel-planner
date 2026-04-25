import { createClient } from '@/utils/supabase/server'
import { Plus, ArrowRightLeft, User, SplitSquareHorizontal, Coins } from 'lucide-react'
import { addExpense } from './actions'
import CurrencyConverter from '@/components/CurrencyConverter'

export default async function BudgetPage() {
  const supabase = await createClient()
  if (!supabase) return null
  
  // 1. Fetch data
  const { data: expenses } = await supabase.from('expenses').select('*').order('date', { ascending: false })
  const { data: stagesData } = await supabase.from('itinerary').select('id, title').order('start_date', { ascending: true })
  const expenseList = expenses || []
  const stages = stagesData || []

  // 2. Calcul du Tricount
  // Axel > 0 veut dire que Enola doit de l'argent à Axel
  let balanceAxel = 0
  let totalSpent = 0
  let totalAxelPaid = 0
  let totalPartnerPaid = 0

  expenseList.forEach(e => {
    totalSpent += Number(e.amount)
    if (e.paid_by === 'Axel') {
      totalAxelPaid += Number(e.amount)
      if (e.split_type === 'equally') balanceAxel += Number(e.amount) / 2
      if (e.split_type === 'paid_by_other_only') balanceAxel += Number(e.amount)
    } else {
      totalPartnerPaid += Number(e.amount)
      if (e.split_type === 'equally') balanceAxel -= Number(e.amount) / 2
      if (e.split_type === 'paid_by_other_only') balanceAxel -= Number(e.amount)
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Le Tricount 💸</h1>
        <p className="text-muted-foreground mt-2">Finies les calculatrices en fin de séjour. Ajoutez, l'application équilibre.</p>
      </header>

      {/* Résumé Immersif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-5"><Coins size={80}/></div>
           <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Dépensé</h2>
           <p className="text-5xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{totalSpent.toFixed(2)} €</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm md:col-span-2">
           <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">L'Équilibre Global</h2>
           <div className="flex items-center justify-between bg-background/50 p-6 rounded-2xl overflow-x-auto gap-4 border border-border/50">
              <div className="text-center min-w-[100px]">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2"><User size={20}/></div>
                 <p className="text-sm font-medium">Axel a payé</p>
                 <p className="text-xl font-bold">{totalAxelPaid.toFixed(2)} €</p>
              </div>
              
              <div className="flex flex-col items-center flex-1 px-4 text-center">
                 <ArrowRightLeft className="text-muted-foreground mb-4 opacity-50" size={24} />
                 {balanceAxel > 0 ? (
                   <span className="text-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-xl ring-1 ring-green-500/20 shadow-sm transition-all hover:scale-105">
                     Enola doit {balanceAxel.toFixed(2)} €
                   </span>
                 ) : balanceAxel < 0 ? (
                   <span className="text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-500 px-4 py-2 rounded-xl ring-1 ring-amber-500/20 shadow-sm transition-all hover:scale-105">
                     Axel doit {Math.abs(balanceAxel).toFixed(2)} €
                   </span>
                 ) : (
                   <span className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl ring-1 ring-primary/20 shadow-sm">
                     Comptes à l'équilibre parfait ⚖️
                   </span>
                 )}
              </div>
              
              <div className="text-center min-w-[100px]">
                 <div className="w-12 h-12 bg-secondary/50 text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-2"><User size={20}/></div>
                 <p className="text-sm font-medium">Enola</p>
                 <p className="text-xl font-bold">{totalPartnerPaid.toFixed(2)} €</p>
              </div>
           </div>
        </div>
      </div>

      {/* Formulaire & Liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Colonne de gauche (Formulaire + Gadgets) */}
        <div className="lg:col-span-1 space-y-6 sticky top-8">
          
          <CurrencyConverter />

          {/* Formulaire Ajout Rapide */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-primary"/> Nouvelle Dépense</h2>
            <form className="space-y-5" action={addExpense}>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Titre de la dépense</label>
              <input name="title" required className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40" placeholder="Ex: Restaurant sushis, Uber..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Montant (€)</label>
                <input name="amount" type="number" step="0.01" required className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Payé par</label>
                <select name="paid_by" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                  <option value="Axel">Axel</option>
                  <option value="Enola">Enola</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
               <label className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2"><SplitSquareHorizontal size={14}/> Type de division</label>
               <select name="split_type" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer shadow-sm">
                 <option value="equally">Diviser 50/50 (Par défaut)</option>
                 <option value="paid_by_other_only">C'était entièrement pour l'autre 🎁</option>
                 <option value="paid_by_me_only">C'était 100% pour moi (Perso)</option>
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Catégorie</label>
                <select name="category" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
                  <option value="Nourriture">🍔 Nourriture</option>
                  <option value="Transport">🚕 Transport</option>
                  <option value="Vol">✈️ Vol</option>
                  <option value="Hôtel">🏨 Logement</option>
                  <option value="Activité">🎟️ Activité</option>
                  <option value="Autre">🛒 Autre</option>
                </select>
              </div>
              <div>
                 <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block text-primary">Lier à l'itinéraire</label>
                 <select name="itinerary_id" className="w-full bg-primary/5 border border-primary/20 text-primary rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all cursor-pointer">
                   <option value="">Aucun lien</option>
                   {stages.map(stage => (
                     <option key={stage.id} value={stage.id}>{stage.title}</option>
                   ))}
                 </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-4 mt-4 transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 active:scale-95">
              Enregistrer la dépense
            </button>
          </form>
          </div>
        </div>

        {/* Historique Moderne */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">Historique des transactions</h2>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">{expenseList.length} total</span>
           </div>
           
           {expenseList.length === 0 ? (
             <div className="bg-card/30 border border-dashed border-border rounded-3xl p-12 text-center">
               <Coins className="mx-auto text-muted-foreground/30 mb-4" size={48} />
               <p className="text-muted-foreground">Aucune dépense pour l'instant.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {expenseList.map((exp) => (
                 <div key={exp.id} className="group bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-card hover:border-primary/30 shadow-sm">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl shadow-inner border border-background shrink-0">
                          {exp.category === 'Nourriture' ? '🍔' : exp.category === 'Transport' ? '🚕' : exp.category === 'Vol' ? '✈️' : exp.category === 'Hôtel' ? '🏨' : exp.category === 'Activité' ? '🎟️' : '🛒'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground flex flex-wrap items-center gap-2 text-lg">
                            <span className="truncate">{exp.title}</span>
                            {exp.itinerary_id && stages.find(s => s.id === exp.itinerary_id) && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg uppercase tracking-wider font-black whitespace-nowrap">
                                📍 {stages.find(s => s.id === exp.itinerary_id)?.title}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                                <User size={12} className="text-primary" /> {exp.paid_by}
                            </span>
                            <span className="opacity-30">•</span>
                            <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">
                              {exp.split_type === 'equally' ? '50/50' : exp.split_type === 'paid_by_other_only' ? 'Cadeau 🎁' : 'Perso'}
                            </span>
                            <span className="opacity-30">•</span>
                            <span>{new Date(exp.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0 bg-background/40 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-border/20 sm:border-0">
                       <p className="text-2xl font-black tabular-nums">{Number(exp.amount).toFixed(2)} <span className="text-sm font-bold text-muted-foreground">€</span></p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
