'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return

  const title = formData.get('title') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const paid_by = formData.get('paid_by') as string

  await supabase.from('expenses').insert([{ title, amount, category, paid_by }])
  revalidatePath('/budget')
}

export async function addExpenseMock(formData: FormData) {
  console.log("Mock mode: insertion ignorée pour l'outil de budget", formData.get('title'))
  revalidatePath('/budget')
}
