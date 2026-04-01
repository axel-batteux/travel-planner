import { createClient } from '@/utils/supabase/server'
import { WalletCards, Plus, ArrowRightLeft } from 'lucide-react'
import { addExpenseMock, addExpense } from './actions'

const MOCK_EXPENSES = [
  { id: '1', title: 'Billets Japon', amount: 1200, category: 'Vol', paid_by: 'Axel', date: '2026-01-10' },
  { id: '2', title: 'Hôtel Tokyo 4 nuits', amount: 450, category: 'Hôtel', paid_by: 'Partenaire', date: '2026-02-15' },
  { id: '3', title: 'Pass JR', amount: 400, category: 'Transport', paid_by: 'Axel', date: '2026-03-01' },
]

export default async function BudgetPage() {
  const supabase = await createClient()
  let expenses = MOCK_EXPENSES
  const isMock = !supabase

  if (supabase) {
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (data && data.length > 0) expenses = data
  }

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0)
  const paidByAxel = expenses.filter(e => e.paid_by === 'Axel').reduce((acc, curr) => acc + curr.amount, 0)
  const paidByPartner = expenses.filter(e => e.paid_by !== 'Axel').reduce((acc, curr) => acc + curr.amount, 0)
  const balance = (paidByAxel - paidByPartner) / 2

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Budget de Voyage</h1>
        <p className="text-muted-foreground mt-2">Suivez vos dépenses communes et équilibrez les comptes.</p>
      </header>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Dépensé</h2>
           <p className="text-4xl font-extrabold text-primary">{total} €</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm md:col-span-2">
           <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Équilibre des Comptes</h2>
           <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl overflow-x-auto gap-4">
              <div className="min-w-[120px]">
                 <p className="text-sm text-muted-foreground">Axel</p>
                 <p className="text-lg font-bold">{paidByAxel} €</p>
              </div>
              <div className="flex flex-col items-center flex-1 px-4 text-center">
                 <ArrowRightLeft className="text-muted-foreground mb-1" size={20} />
                 <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md max-w-[180px] break-words">
                   {balance > 0 ? "Le partenaire doit " + balance + " € à Axel" : balance < 0 ? "Axel doit " + Math.abs(balance) + " € au partenaire" : "Comptes à l'équilibre"}
                 </span>
              </div>
              <div className="text-right min-w-[120px]">
                 <p className="text-sm text-muted-foreground">Partenaire</p>
                 <p className="text-lg font-bold">{paidByPartner} €</p>
              </div>
           </div>
        </div>
      </div>

      {/* Formulaire & Liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulaire */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Plus size={20}/> Nouvelle Dépense</h2>
          <form className="space-y-4" action={isMock ? addExpenseMock : addExpense}>
            <div>
              <label className="text-sm font-medium mb-1 block">Titre</label>
              <input name="title" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm" placeholder="Ex: Restaurant..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Montant (€)</label>
                <input name="amount" type="number" step="0.01" required className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Payé par</label>
                <select name="paid_by" className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm">
                  <option value="Axel">Axel</option>
                  <option value="Partenaire">Partenaire</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catégorie</label>
              <select name="category" className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm">
                <option value="Vol">Vol</option>
                <option value="Hôtel">Hôtel</option>
                <option value="Nourriture">Nourriture</option>
                <option value="Activité">Activité</option>
                <option value="Transport">Transport</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <button className="w-full bg-primary text-primary-foreground font-medium rounded-lg py-2 mt-2 transition-colors hover:bg-primary/90">
              Ajouter
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-sm lg:col-span-2">
           <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-muted text-muted-foreground font-medium">
                 <tr>
                    <th className="px-6 py-4">Titre</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4 text-center">Payé par</th>
                    <th className="px-6 py-4 text-right">Montant</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {expenses.map((exp) => (
                   <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{exp.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{exp.category}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-muted px-2 py-1 rounded-md text-xs font-semibold">{exp.paid_by}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">{exp.amount} €</td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
