import supabaseAdmin from './supabaseAdmin';

export async function inviteNewUser(email) {
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: '/register',
  });

  if (error) {
    console.error('Error inviting user:', error);
    return null;
  }

  return data;
  console.log('inside utils/inviteNewUser')
}
