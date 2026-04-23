'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addItineraryStage(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Supabase client is null")

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error(`User auth failed: ${authError?.message || 'No user found'}`)

  const title = formData.get('title') as string
  const type = formData.get('type') as string || 'Etape'
  const start_date = formData.get('start_date') as string
  const location_name = formData.get('location_name') as string
  const maps_url = formData.get('maps_url') as string
  
  if (!title) throw new Error("Title is missing from form")
  if (!start_date) throw new Error("Start date is missing from form")

  // Utilisation directe de la date qui arrive au format YYYY-MM-DD
  // On force l'heure à 12:00:00 pour éviter tout glissement dû au fuseau horaire
  const formattedDate = new Date(`${start_date}T12:00:00.000Z`).toISOString()

  console.log("Adding itinerary with data:", { title, type, start_date, location_name, maps_url, formattedDate })

  const { error } = await supabase.from('itinerary').insert([{
    title,
    type,
    start_date: formattedDate,
    location_name,
    maps_url,
    user_id: user.id
  }])

  if (error) {
    console.error('Error inserting itinerary stage:', error)
    throw new Error(`DB Insert Error: ${error.message} - Code: ${error.code}`)
  }

  revalidatePath('/(authed)/itinerary', 'page')
  revalidatePath('/itinerary', 'page')
  revalidatePath('/(authed)/itinerary', 'layout')
}

export async function deleteItineraryStage(id: string) {
  const supabase = await createClient()
  if (!supabase) return

  await supabase.from('itinerary').delete().eq('id', id)
  revalidatePath('/itinerary')
}
