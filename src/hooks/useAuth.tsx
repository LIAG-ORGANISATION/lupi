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
      console.log('[useAuth] Fetching role for user:', userId);
      
      // Check if user is a professional
      const { data: professionalData, error: profError } = await supabase
        .from('professionals')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('[useAuth] Professional query result:', { professionalData, profError });

      if (profError) {
        console.error('[useAuth] Error querying professionals:', profError);
      }

      if (professionalData) {
        console.log('[useAuth] Setting role to: professional');
        setUserRole('professional');
        setLoading(false);
        return;
      }

      // Check if user is an owner
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('[useAuth] Owner query result:', { ownerData, ownerError });

      if (ownerError) {
        console.error('[useAuth] Error querying owners:', ownerError);
      }

      if (ownerData) {
        console.log('[useAuth] Setting role to: guardian');
        setUserRole('guardian');
      } else {
        console.log('[useAuth] No role found, setting to null');
        setUserRole(null);
      }
    } catch (error) {
      console.error('[useAuth] Exception in fetchUserRole:', error);
      setUserRole(null);
    } finally {
      console.log('[useAuth] Finished fetching role, setting loading to false');
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('[useAuth] Déconnexion forcée - réinitialisation immédiate');
    
    // Réinitialiser les états immédiatement
    setUser(null);
    setUserRole(null);
    setLoading(false);
    
    // Tenter la déconnexion Supabase en arrière-plan
    supabase.auth.signOut().catch((error) => {
      console.error('[useAuth] Erreur lors de la déconnexion Supabase (ignorée):', error);
    });
    
    console.log('[useAuth] Déconnexion locale effectuée');
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
