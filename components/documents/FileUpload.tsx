'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, X, Loader2, FolderTree } from 'lucide-react'
import { uploadDocument } from '@/app/(authed)/documents/actions'

export default function FileUpload({ categories }: { categories: string[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categoryType, setCategoryType] = useState<'select' | 'new'>('select')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      await uploadDocument(formData)
      setIsOpen(false)
      formRef.current?.reset()
    } catch (err) {
      alert("Erreur lors de l'envoi. Vérifie que le bucket 'travel-documents' existe bien en mode public sur Supabase.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary text-primary-foreground font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        Ajouter un document
      </button>
    )
  }

  return (
    <div className="bg-card border border-primary/30 rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black flex items-center gap-2 italic">
          <Upload size={20} className="text-primary" /> Nouveau Fichier
        </h2>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Fichier (PDF, Image...)</label>
          <input 
            type="file" 
            name="file" 
            required 
            accept="image/*,application/pdf"
            className="w-full bg-background border border-border/50 rounded-2xl p-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nom du document</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Ex: Passeport Axel, Billet Vol..." 
            required 
            className="w-full bg-background border border-border/50 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between ml-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</label>
            <button 
              type="button" 
              onClick={() => setCategoryType(categoryType === 'select' ? 'new' : 'select')}
              className="text-[10px] font-black uppercase text-primary hover:underline"
            >
              {categoryType === 'select' ? "+ Créer une catégorie" : "Choisir existante"}
            </button>
          </div>

          {categoryType === 'select' && categories.length > 0 ? (
            <select name="category" className="w-full bg-background border border-border/50 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer">
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Général">Général</option>
            </select>
          ) : (
            <div className="relative">
              <FolderTree size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                name="new_category" 
                placeholder="Ex: Assurances, Visas, Santé..." 
                className="w-full bg-background border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full bg-primary text-primary-foreground font-black py-5 rounded-[2rem] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-4"
        >
          {isUploading ? <><Loader2 size={20} className="animate-spin" /> Envoi en cours...</> : "Lancer l'upload"}
        </button>
      </form>
    </div>
  )
}
