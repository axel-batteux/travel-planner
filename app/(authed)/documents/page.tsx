import { createClient } from '@/utils/supabase/server'
import { FolderOpen, FileText, Download, Trash2, ShieldCheck, FileSearch } from 'lucide-react'
import FileUpload from '@/components/documents/FileUpload'
import { deleteDocument } from './actions'

interface DocumentItem {
  id: string
  title: string
  category: string
  file_url: string
  file_path: string
}

export default async function DocumentsPage() {
  const supabase = await createClient()
  if (!supabase) return null

  const { data: docsData } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
  const docs = docsData || []

  const categories = Array.from(new Set(docs.map(d => d.category))) as string[]

  // Grouper par catégorie
  const groupedDocs = docs.reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] || []
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<string, DocumentItem[]>)

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em] mb-3">
             <ShieldCheck size={16} /> Espace Sécurisé
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">Documents<span className="text-primary not-italic">.</span></h1>
          <p className="text-muted-foreground mt-2 font-medium">Vos originaux, partout avec vous.</p>
        </div>
      </header>

      {/* Upload Zone */}
      <div className="max-w-xl">
        <FileUpload categories={categories} />
      </div>

      {docs.length === 0 ? (
        <div className="bg-card/30 border-2 border-dashed border-border rounded-[3rem] p-20 text-center">
            <FileSearch size={60} className="mx-auto text-muted-foreground/20 mb-6" />
            <p className="text-xl font-bold text-muted-foreground">Aucun document pour le moment</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Commencez par uploader vos pièces d'identité ou visas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedDocs).map(([category, items]) => (
            <div key={category} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <FolderOpen size={24} />
                  </div>
                  <h2 className="text-xl font-black tracking-tight underline decoration-primary/30 underline-offset-8">{category}</h2>
               </div>
               
               <ul className="space-y-1 flex-1">
                 {items.map(doc => (
                   <li key={doc.id} className="flex items-center justify-between p-4 bg-background/40 hover:bg-background rounded-2xl transition-all group border border-transparent hover:border-border/50">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                            <FileText size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-bold text-sm truncate">{doc.title}</span>
                      </a>
                      
                      <div className="flex items-center gap-1">
                        <a href={doc.file_url} download={doc.title} className="text-muted-foreground hover:text-primary p-2 transition-colors">
                          <Download size={18} />
                        </a>
                        <form action={deleteDocument.bind(null, doc.id, doc.file_path)}>
                          <button type="submit" className="text-muted-foreground hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                   </li>
                 ))}
               </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
