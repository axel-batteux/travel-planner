'use client'

import { useState, useEffect } from 'react'
import { updateNote } from '../actions'

export default function Editor({ id, initialContent }: { id: string, initialContent: string }) {
  const [content, setContent] = useState(initialContent || '')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  // Auto-save logic (debounce)
  useEffect(() => {
    if (content === initialContent) return
    
    setSaveStatus('unsaved')
    const timer = setTimeout(async () => {
      setSaveStatus('saving')
      await updateNote(id, content)
      setSaveStatus('saved')
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, id, initialContent])

  return (
    <div className="relative w-full h-[60vh] min-h-[400px]">
      <div className="absolute -top-12 right-0 text-xs font-medium text-muted-foreground">
        {saveStatus === 'saved' && <span className="text-green-500">✓ Enregistré</span>}
        {saveStatus === 'saving' && <span className="animate-pulse">Enregistrement...</span>}
        {saveStatus === 'unsaved' && <span>Non enregistré</span>}
      </div>
      
      <textarea
        className="w-full h-full bg-transparent border-none resize-none outline-none focus:ring-0 text-lg leading-relaxed placeholder:text-muted-foreground/30 font-serif"
        placeholder="Commencez à écrire ici... (Sauvegarde automatique)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  )
}
