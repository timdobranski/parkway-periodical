import { createClient } from './supabase/client';

export default function logUserOut(router) {
  const supabase = createClient();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error logging out:', error.message)
    } else {
      router.push('/public/home');
    }
  };
  handleLogout();
}