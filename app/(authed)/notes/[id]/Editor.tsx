'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline } from '@tiptap/extension-underline'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextAlign } from '@tiptap/extension-text-align'
import { Extension } from '@tiptap/core'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, ImageIcon, Table as TableIcon,
  Palette, Baseline
} from 'lucide-react'

import { updateNote } from '../actions'

const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: '1.5',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultLineHeight) return {}
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }) => {
        return this.options.types.every((type: string) => commands.updateAttributes(type, { lineHeight }))
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every((type: string) => commands.resetAttributes(type, 'lineHeight'))
      },
    }
  },
})

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt("URL de l'image:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    editor.chain().focus().setColor(color).run()
  }, [editor])

  const isActiveClass = "bg-primary/20 text-primary border-primary/20"
  const inactiveClass = "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
  const btnBase = "p-2 rounded-xl transition-colors border"

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-card/60 backdrop-blur-sm shadow-sm rounded-2xl mb-6 border border-border/60 sticky top-4 z-20">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnBase} ${editor.isActive('bold') ? isActiveClass : inactiveClass}`}
        title="Gras"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnBase} ${editor.isActive('italic') ? isActiveClass : inactiveClass}`}
        title="Italique"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btnBase} ${editor.isActive('underline') ? isActiveClass : inactiveClass}`}
        title="Souligné"
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${btnBase} ${editor.isActive('strike') ? isActiveClass : inactiveClass}`}
        title="Barré"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-8 bg-border/50 my-auto mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${btnBase} font-bold ${editor.isActive('heading', { level: 1 }) ? isActiveClass : inactiveClass}`}
        title="Titre 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnBase} font-bold ${editor.isActive('heading', { level: 2 }) ? isActiveClass : inactiveClass}`}
        title="Titre 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btnBase} font-bold ${editor.isActive('heading', { level: 3 }) ? isActiveClass : inactiveClass}`}
        title="Titre 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-8 bg-border/50 my-auto mx-1" />

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`${btnBase} ${editor.isActive({ textAlign: 'left' }) ? isActiveClass : inactiveClass}`}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`${btnBase} ${editor.isActive({ textAlign: 'center' }) ? isActiveClass : inactiveClass}`}
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`${btnBase} ${editor.isActive({ textAlign: 'right' }) ? isActiveClass : inactiveClass}`}
      >
        <AlignRight size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`${btnBase} ${editor.isActive({ textAlign: 'justify' }) ? isActiveClass : inactiveClass}`}
      >
        <AlignJustify size={18} />
      </button>

      <div className="w-px h-8 bg-border/50 my-auto mx-1" />

      <div className={`${btnBase} ${inactiveClass} overflow-hidden p-0 relative w-9 h-9 flex items-center justify-center`} title="Couleur du texte">
        <Palette size={18} className="absolute pointer-events-none" />
        <input 
          type="color" 
          onChange={handleColorChange}
          className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
        />
      </div>

      <div className="relative group flex items-center justify-center">
        <button className={`${btnBase} ${inactiveClass} flex items-center gap-1`} title="Interligne">
          <Baseline size={18} />
        </button>
        <div className="absolute top-10 left-0 bg-popover text-popover-foreground border bg-background shadow-md rounded-xl py-2 hidden group-hover:block z-50 w-24">
          {['1.0', '1.15', '1.5', '2.0', '2.5'].map((lh) => (
            <button
              key={lh}
              onClick={() => editor.chain().focus().setLineHeight(lh).run()}
              className={`w-full text-left px-4 py-1.5 text-sm hover:bg-muted ${editor.isActive({ lineHeight: lh }) ? 'bg-primary/10 text-primary font-bold' : ''}`}
            >
              {lh}
            </button>
          ))}
        </div>
      </div>

      <button onClick={addImage} className={`${btnBase} ${inactiveClass} w-9 h-9 flex items-center justify-center p-0`} title="Insérer une image (URL)">
        <ImageIcon size={18} />
      </button>

      <button onClick={addTable} className={`${btnBase} ${inactiveClass}`} title="Insérer un tableau">
        <TableIcon size={18} />
      </button>
    </div>
  )
}

export default function Editor({ id, initialContent }: { id: string, initialContent: string }) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  // Prevent data loss: handle raw text from older version gracefully by adding HTML line breaks
  const formattedInitialContent = initialContent && !initialContent.includes('<') && !initialContent.includes('>') 
    ? initialContent.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line}</p>`).join('')
    : initialContent;
    
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LineHeight,
    ],
    content: formattedInitialContent,
    editorProps: {
      attributes: {
        class: 'w-full min-h-[400px] outline-none focus:ring-0 leading-relaxed font-serif cursor-text'
      }
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved')
    }
  })

  useEffect(() => {
    if (!editor || saveStatus !== 'unsaved') return
    
    const timer = setTimeout(async () => {
      setSaveStatus('saving')
      const html = editor.getHTML()
      await updateNote(id, html)
      setSaveStatus('saved')
    }, 1500)

    return () => clearTimeout(timer)
  }, [editor, saveStatus, id])

  return (
    <div className="relative w-full min-h-[400px]">
      <div className="absolute -top-[120px] right-2 md:-top-[132px] md:right-8 text-xs font-semibold text-muted-foreground z-10 px-3 py-1.5 rounded-full bg-background border border-border flex items-center gap-2 shadow-sm">
        {saveStatus === 'saved' && <><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Enregistré</>}
        {saveStatus === 'saving' && <><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Enregistrement...</>}
        {saveStatus === 'unsaved' && <><span className="w-2 h-2 rounded-full bg-amber-500"></span> Modification...</>}
      </div>
      
      <MenuBar editor={editor} />
      
      <div className="tiptap-wrapper text-foreground cursor-text">
        <EditorContent editor={editor} className="cursor-text tiptap-content" />
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-content {
          font-size: 1.125rem;
        }
        .tiptap-wrapper .ProseMirror:focus {
          outline: none;
        }
        .tiptap-wrapper .ProseMirror p {
          margin-bottom: 1em;
          min-height: 1em;
        }
        .tiptap-wrapper .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-top: 2em;
          margin-bottom: 1em;
          font-family: var(--font-sans);
        }
        .tiptap-wrapper .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-family: var(--font-sans);
        }
        .tiptap-wrapper .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
          font-family: var(--font-sans);
        }
        .tiptap-wrapper .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .tiptap-wrapper .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .tiptap-wrapper .ProseMirror blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: var(--muted-foreground);
        }
        .tiptap-wrapper .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5em 0;
          overflow: hidden;
        }
        .tiptap-wrapper .ProseMirror table td,
        .tiptap-wrapper .ProseMirror table th {
          min-width: 1em;
          border: 1px solid var(--border);
          padding: 0.5em;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          background: var(--background);
        }
        .tiptap-wrapper .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: var(--muted);
        }
        .tiptap-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5em 0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        /* Enhance cursor visibility / selection styling */
        .tiptap-wrapper .ProseMirror *::selection {
          background-color: var(--primary);
          color: white;
        }
        .tiptap-wrapper .ProseMirror {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='24'><path d='M8 3v18m-4-18h8m-8 18h8' stroke='white' stroke-width='4'/><path d='M8 3v18m-4-18h8m-8 18h8' stroke='black' stroke-width='1.5'/></svg>") 8 12, text;
          caret-color: inherit;
        }
      `}} />
    </div>
  )
}
