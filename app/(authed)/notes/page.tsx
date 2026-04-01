import { createClient } from '@/utils/supabase/server'
import { BookOpen, Plus, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { createNote } from './actions'

export default async function NotesPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: notesList } = await supabase.from('notes').select('id, title, updated_at').order('updated_at', { ascending: false })
  const notes = notesList || []

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <BookOpen className="text-primary" size={32} />
          Carnet de Voyage
        </h1>
        <p className="text-muted-foreground mt-2">Votre espace libre pour toutes vos notes, recommandations et journaux de bord.</p>
      </header>

      {/* Créer un carnet */}
      <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-sm">
        <form className="flex flex-col sm:flex-row gap-3" action={createNote}>
          <input name="title" required className="flex-1 bg-background/50 border border-border/50 rounded-xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="✒️ Titre du nouveau carnet (ex: Adresses Kyoto, Mémos vols...)" />
          <button type="submit" className="bg-primary text-primary-foreground font-bold px-8 rounded-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md py-4 sm:py-0">
            Créer
          </button>
        </form>
      </div>

      {/* Liste des carnets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 ? (
           <div className="col-span-full text-center p-12 border-2 border-dashed rounded-3xl mt-4">
              <FileText className="mx-auto text-muted-foreground/30 mb-4" size={48} />
              <p className="text-muted-foreground font-medium">Aucun carnet. Créez votre première page Blanche !</p>
           </div>
        ) : (
          notes.map(note => (
            <Link key={note.id} href={`/notes/${note.id}`} className="group relative bg-card hover:bg-muted/30 border border-border/50 p-6 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 flex flex-col justify-between min-h-[160px]">
               <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <FileText size={20} />
               </div>
               <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{note.title}</h3>
               <div className="flex items-center justify-between mt-auto">
                 <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">Ouvrir <ChevronRight size={12}/></p>
                 <p className="text-xs text-muted-foreground opacity-50">{new Date(note.updated_at).toLocaleDateString('fr-FR')}</p>
               </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
