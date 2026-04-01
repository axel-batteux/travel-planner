'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addChecklistItem(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  const category = formData.get('category') as string || 'Général'
  const assigned_to = formData.get('assigned_to') as string

  if (!title) return

  await supabase.from('checklists').insert([{
    title,
    category,
    assigned_to,
    is_completed: false,
    user_id: user.id
  }])

  revalidatePath('/checklists')
  revalidatePath('/')
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('checklists').update({ is_completed: !is_completed }).eq('id', id)
  revalidatePath('/checklists')
}

export async function deleteChecklistItem(id: string) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('checklists').delete().eq('id', id)
  revalidatePath('/checklists')
}
