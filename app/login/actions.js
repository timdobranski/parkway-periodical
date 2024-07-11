'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  }
  // console.log('FORM DATA: ', JSON.stringify(data))
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Error logging in:', error)
    // redirect('/error')
  }

  revalidatePath('/admin/home', 'layout')
  redirect('/admin/home')
}

// export async function signup(formData) {
//   const supabase = createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email'),
//     password: formData.get('password')
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }