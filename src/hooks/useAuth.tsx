import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // Check if user is a professional
      const { data: professionalData } = await supabase
        .from('professionals' as any)
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (professionalData) {
        setUserRole('professional');
        setLoading(false);
        return;
      }

      // Check if user is an owner
      const { data: ownerData } = await supabase
        .from('owners' as any)
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (ownerData) {
        setUserRole('guardian');
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  return {
    user,
    userRole,
    loading,
    signOut,
    isAuthenticated: !!user,
    isProfessional: userRole === 'professional',
    isGuardian: userRole === 'guardian',
  };
}
