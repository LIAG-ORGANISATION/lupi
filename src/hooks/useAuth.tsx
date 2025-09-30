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
    console.log('[useAuth] 🚀 START fetchUserRole for:', userId);
    
    // Timeout de sécurité
    const timeout = setTimeout(() => {
      console.error('[useAuth] ⚠️ TIMEOUT - Forçage du rôle guardian');
      setUserRole('guardian');
      setLoading(false);
    }, 3000);
    
    try {
      console.log('[useAuth] 1️⃣ About to query owners table...');
      
      // Check if user is an owner FIRST (plus probable)
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('[useAuth] 2️⃣ Owner query result:', { ownerData, ownerError });

      if (ownerError) {
        console.error('[useAuth] ❌ Error querying owners:', ownerError);
      }

      if (ownerData) {
        console.log('[useAuth] ✅ User is GUARDIAN');
        clearTimeout(timeout);
        setUserRole('guardian');
        setLoading(false);
        return;
      }

      console.log('[useAuth] 3️⃣ About to query professionals table...');
      
      // Check if user is a professional
      const { data: professionalData, error: profError } = await supabase
        .from('professionals')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('[useAuth] 4️⃣ Professional query result:', { professionalData, profError });

      if (profError) {
        console.error('[useAuth] ❌ Error querying professionals:', profError);
      }

      if (professionalData) {
        console.log('[useAuth] ✅ User is PROFESSIONAL');
        clearTimeout(timeout);
        setUserRole('professional');
        setLoading(false);
        return;
      }

      console.log('[useAuth] ⚠️ No role found');
      clearTimeout(timeout);
      setUserRole(null);
    } catch (error) {
      console.error('[useAuth] 💥 Exception in fetchUserRole:', error);
      clearTimeout(timeout);
      setUserRole(null);
    } finally {
      console.log('[useAuth] 🏁 FINISHED fetchUserRole');
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
