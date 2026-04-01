'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()
  if (!supabase) return redirect('/')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Identifiants incorrects')
  }

  return redirect('/')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()
  if (!supabase) return redirect('/')

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?message=Compte créé avec succès ! Connectez-vous.')
}

export async function loginMock(formData: FormData) {
   return redirect('/')
}
