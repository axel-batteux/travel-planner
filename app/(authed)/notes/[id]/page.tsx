import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Editor from './Editor'
import TitleInput from './TitleInput'
import { deleteNote } from '../actions'

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  if (!supabase) return null

  const resolvedParams = await params
  const { data: note } = await supabase.from('notes').select('*').eq('id', resolvedParams.id).single()

  if (!note) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <Link href="/notes" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft size={16} />
          </div>
          Retour aux carnets
        </Link>
        
        <form action={async () => { 'use server'; await deleteNote(note.id) }}>
          <button type="submit" className="flex items-center gap-2 text-sm font-bold text-red-500/50 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
            <Trash2 size={16} /> Supprimer le carnet
          </button>
        </form>
      </header>
      
      <main className="bg-card border border-border/50 rounded-[40px] p-8 md:p-12 shadow-sm min-h-[70vh]">
        <TitleInput id={note.id} initialTitle={note.title || ''} />
        
        <Editor id={note.id} initialContent={note.content || ''} />
      </main>
    </div>
  )
}
