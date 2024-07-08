import supabase from './supabase';

export default function logUserOut(router) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error logging out:', error.message)
    } else {
      router.push('/');
    }
  };
  handleLogout();
}