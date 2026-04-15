'use client'

import { useState, useEffect } from 'react'
import { updateNoteTitle } from '../actions'

export default function TitleInput({ id, initialTitle }: { id: string, initialTitle: string }) {
  const [title, setTitle] = useState(initialTitle)

  useEffect(() => {
    if (title === initialTitle) return
    const timer = setTimeout(async () => {
      await updateNoteTitle(id, title)
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, id, initialTitle])

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Titre de la note"
      className="w-full text-4xl md:text-5xl font-black mb-8 outline-none border-b border-border/30 bg-transparent placeholder:text-muted-foreground/30 tracking-tight pb-4 cursor-text"
    />
  )
}
