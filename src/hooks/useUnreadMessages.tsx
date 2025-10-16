import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        // Get all conversations for this user
        const { data: conversations } = await supabase
          .from("conversations")
          .select("id")
          .or(`owner_id.eq.${user.id},professional_id.eq.${user.id}`);

        if (!conversations || conversations.length === 0) {
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        const conversationIds = conversations.map((c) => c.id);

        // Count unread messages in all conversations (excluding own messages)
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", conversationIds)
          .eq("read", false)
          .neq("sender_id", user.id);

        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Subscribe to realtime updates for new messages
    const channel = supabase
      .channel("unread-messages-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { unreadCount, loading };
};
