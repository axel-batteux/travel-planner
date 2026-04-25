'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return // Securite

  const title = formData.get('title') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const paid_by = formData.get('paid_by') as string
  const split_type = formData.get('split_type') as string || 'equally'
  const itinerary_id = formData.get('itinerary_id') as string

  await supabase.from('expenses').insert([{ 
    title, 
    amount, 
    category, 
    paid_by, 
    split_type,
    itinerary_id: itinerary_id || null,
    user_id: user.id 
  }])
  
  revalidatePath('/budget')
  revalidatePath('/') // Dashboard update
}
