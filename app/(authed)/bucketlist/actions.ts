'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addBucketItem(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const title = formData.get('title') as string
  const category = formData.get('category') as string || 'Envie'
  const maps_url = formData.get('maps_url') as string
  const description = formData.get('description') as string

  if (!title) return

  await supabase.from('bucketlist').insert([{
    title,
    category,
    maps_url,
    description,
    is_visited: false,
    user_id: user.id
  }])

  revalidatePath('/bucketlist')
}

export async function toggleVisited(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('bucketlist').update({ is_visited: !currentStatus }).eq('id', id)
  revalidatePath('/bucketlist')
}

export async function deleteBucketItem(id: string) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('bucketlist').delete().eq('id', id)
  revalidatePath('/bucketlist')
}
