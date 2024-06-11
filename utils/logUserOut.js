import supabase from './supabase';

export default function logUserOut(router) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    router.push('/');
  };
  handleLogout();
}