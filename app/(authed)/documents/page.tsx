import { createClient } from '@/utils/supabase/server'
import { FolderOpen, FileText, Download } from 'lucide-react'

const MOCK_DOCS = [
  { id: '1', title: 'Passeport Axel', category: 'Passeports', file_url: '#' },
  { id: '2', title: 'Passeport Enola', category: 'Passeports', file_url: '#' },
  { id: '3', title: 'Assurance CB MasterCard', category: 'Assurances', file_url: '#' },
  { id: '4', title: 'E-Visa Corée du Sud', category: 'Visas', file_url: '#' },
  { id: '5', title: 'Certificats de Vaccination', category: 'Santé', file_url: '#' },
]

export default async function DocumentsPage() {
  const supabase = await createClient()
  let docs = MOCK_DOCS

  if (supabase) {
    const { data } = await supabase.from('documents').select('*')
    if (data && data.length > 0) docs = data
  }

  // Grouper par catégorie
  const groupedDocs = docs.reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] || []
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<string, typeof MOCK_DOCS>)

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Documents Sécurisés</h1>
        <p className="text-muted-foreground mt-2">Dossier virtuel centralisant tous vos fichiers importants de voyage.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {Object.entries(groupedDocs).map(([category, items]) => (
          <div key={category} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen className="text-primary" size={24} />
                </div>
                <h2 className="text-lg font-bold">{category}</h2>
             </div>
             <ul className="space-y-3">
               {items.map(doc => (
                 <li key={doc.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium text-sm">{doc.title}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-primary transition-colors p-2 md:p-1">
                      <Download size={18} />
                    </button>
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
