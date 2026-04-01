'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createNote(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  if (!title) return

  const { data } = await supabase.from('notes').insert([{
    title,
    content: '',
    user_id: user.id
  }]).select().single()

  revalidatePath('/notes')
  if (data?.id) {
    redirect(`/notes/${data.id}`)
  }
}

export async function updateNote(id: string, content: string) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('notes').update({ content }).eq('id', id)
  // No revalidate immediately for text areas unless necessary, or fast-refresh handles it
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('notes').delete().eq('id', id)
  revalidatePath('/notes')
  redirect('/notes')
}
