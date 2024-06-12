// import supabaseAdmin from './supabaseAdmin';

// const siteURL = process.env.NEXT_SITE_URL;
// console.log('site url env: ', siteURL)

// export async function inviteNewUser(email) {
//   const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
//     redirectTo: `${siteURL}/register`,
//   });

//   if (error) {
//     console.error('Error inviting user:', error);
//     return error
//   }

//   return data;
//   console.log('inside utils/inviteNewUser')
// }
