import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import { capitalizeWords } from "@/lib/utils";
import avatarDefault from "@/assets/avatar-default.jpg";

interface Conversation {
  id: string;
  owner_id: string;
  professional_id: string;
  dog_id: string | null;
  last_message_at: string | null;
  owner_name: string;
  owner_avatar: string | null;
  professional_name: string;
  professional_avatar: string | null;
  dog_name: string | null;
  last_message: string | null;
  unread_count: number;
}

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string | null;
}

const ConversationsList = ({ onSelectConversation, selectedConversationId }: ConversationsListProps) => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data: convData, error } = await supabase
          .from("conversations")
          .select("*")
          .order("last_message_at", { ascending: false, nullsFirst: false });

        if (error) throw error;

        // Fetch details for each conversation
        const conversationsWithDetails = await Promise.all(
          (convData || []).map(async (conv: any) => {
            // Fetch owner details
            const { data: ownerData } = await supabase
              .from("owners")
              .select("full_name, avatar_url")
              .eq("user_id", conv.owner_id)
              .single();

            // Fetch professional details
            const { data: proData } = await supabase
              .from("professionals")
              .select("full_name, photo_url")
              .eq("user_id", conv.professional_id)
              .single();

            // Fetch dog details if dog_id exists
            let dogData = null;
            if (conv.dog_id) {
              const { data } = await supabase
                .from("dogs")
                .select("name")
                .eq("id", conv.dog_id)
                .single();
              dogData = data;
            }

            // Fetch last message
            const { data: lastMessage } = await supabase
              .from("messages")
              .select("content")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            // Count unread messages
            const { count: unreadCount } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .eq("read", false)
              .neq("sender_id", user.id);

            return {
              id: conv.id,
              owner_id: conv.owner_id,
              professional_id: conv.professional_id,
              dog_id: conv.dog_id,
              last_message_at: conv.last_message_at,
              owner_name: ownerData?.full_name || "Propriétaire",
              owner_avatar: ownerData?.avatar_url,
              professional_name: proData?.full_name || "Professionnel",
              professional_avatar: proData?.photo_url,
              dog_name: dogData?.name,
              last_message: lastMessage?.content || null,
              unread_count: unreadCount || 0,
            };
          })
        );

        setConversations(conversationsWithDetails);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Aucune conversation</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const isOwner = role === "owner";
        const displayName = isOwner ? conv.professional_name : conv.owner_name;
        const displayAvatar = isOwner ? conv.professional_avatar : conv.owner_avatar;
        const initials = displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <Card
            key={conv.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
              selectedConversationId === conv.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={displayAvatar || avatarDefault} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm truncate">{capitalizeWords(displayName)}</p>
                  {conv.last_message_at && (
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatDistanceToNow(new Date(conv.last_message_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  )}
                </div>
                {conv.dog_name && (
                  <p className="text-xs text-muted-foreground mb-1">Concernant: {capitalizeWords(conv.dog_name)}</p>
                )}
                {conv.last_message && (
                  <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                )}
                {conv.unread_count > 0 && (
                  <div className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full mt-1">
                    {conv.unread_count}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ConversationsList;