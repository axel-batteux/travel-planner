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

export async function convertBucketToItinerary(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const bucket_id = formData.get('bucket_id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const maps_url = formData.get('maps_url') as string
  const start_date = formData.get('start_date') as string

  if (!bucket_id || !title || !start_date) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const formattedDate = new Date(`${start_date}T12:00:00.000Z`).toISOString()

  // 1. Ajouter à la table Itinerary
  const { error: insertError } = await supabase.from('itinerary').insert([{
    title,
    type: category === 'Restaurant' ? 'Activité' : category, // default mappings
    start_date: formattedDate,
    maps_url: maps_url || null,
    user_id: user.id
  }])

  // 2. Marquer l'item de bucketlist comme visité
  if (!insertError) {
    await supabase.from('bucketlist').update({ is_visited: true }).eq('id', bucket_id)
  }

  revalidatePath('/bucketlist')
  revalidatePath('/itinerary')
}
