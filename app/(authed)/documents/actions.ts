'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) throw new Error('Supabase client not initialized')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const categoryRaw = formData.get('category') as string
  const newCategory = formData.get('new_category') as string

  const category = newCategory || categoryRaw || 'Général'

  if (!file || file.size === 0) throw new Error('No file uploaded')

  // 1. Upload to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('travel-documents')
    .upload(filePath, file)

  if (storageError) {
    console.error('Storage Error:', storageError)
    throw new Error(`Failed to upload file: ${storageError.message}`)
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('travel-documents')
    .getPublicUrl(filePath)

  // 3. Save to DB
  const { error: dbError } = await supabase.from('documents').insert([{
    user_id: user.id,
    title,
    category,
    file_path: filePath,
    file_url: publicUrl,
    file_type: file.type
  }])

  if (dbError) {
    console.error('DB Error:', dbError)
    throw dbError
  }

  revalidatePath('/documents')
}

export async function deleteDocument(id: string, filePath: string) {
  const supabase = await createClient()
  if (!supabase) return

  // Delete from Storage
  await supabase.storage.from('travel-documents').remove([filePath])

  // Delete from DB
  await supabase.from('documents').delete().eq('id', id)

  revalidatePath('/documents')
}
