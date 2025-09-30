import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "owner" | "professional" | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Check if user is an owner
      const { data: ownerData, error: ownerError } = await supabase
        .from("owners")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!ownerError && ownerData) {
        setRole("owner");
        setLoading(false);
        return;
      }

      // Check if user is a professional
      const { data: proData, error: proError } = await supabase
        .from("professionals")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!proError && proData) {
        setRole("professional");
        setLoading(false);
        return;
      }

      // No role found
      setRole(null);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user role:", error);
      setRole(null);
      setLoading(false);
    }
  };

  return { role, loading, userId };
};
