import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Send, ArrowLeft, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { capitalizeWords } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_type: string;
  created_at: string;
  read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
}

const ChatWindow = ({ conversationId, onBack }: ChatWindowProps) => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationDetails, setConversationDetails] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !conversationId) return;

    const fetchConversation = async () => {
      const { data: convData, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (error) {
        console.error("Error fetching conversation:", error);
        return;
      }

      // Fetch related data
      const { data: ownerData } = await supabase
        .from("owners")
        .select("full_name, avatar_url, phone")
        .eq("user_id", convData.owner_id)
        .single();

      const { data: proData } = await supabase
        .from("professionals")
        .select("full_name, photo_url, phone")
        .eq("user_id", convData.professional_id)
        .single();

      let dogData = null;
      if (convData.dog_id) {
        const { data } = await supabase
          .from("dogs")
          .select("name")
          .eq("id", convData.dog_id)
          .single();
        dogData = data;
      }

      setConversationDetails({
        ...convData,
        owners: ownerData,
        professionals: proData,
        dogs: dogData,
      });
    };

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        // Mark messages as read immediately
        const { error: updateError } = await supabase
          .from("messages")
          .update({ read: true })
          .eq("conversation_id", conversationId)
          .neq("sender_id", user.id)
          .eq("read", false);

        if (updateError) {
          console.error("Error marking messages as read:", updateError);
        } else {
          console.log("Messages marked as read successfully");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          scrollToBottom();

          // Mark as read if not sent by current user
          if (newMsg.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", newMsg.id)
              .then(({ error }) => {
                if (error) {
                  console.error("Error marking new message as read:", error);
                } else {
                  console.log("New message marked as read:", newMsg.id);
                }
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: role === "owner" ? "owner" : "professional",
        content: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading || !conversationDetails) {
    return (
      <Card className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const isOwner = role === "owner";
  const otherParty = isOwner ? conversationDetails.professionals : conversationDetails.owners;
  const otherPartyAvatar = isOwner
    ? conversationDetails.professionals?.photo_url
    : conversationDetails.owners?.avatar_url;
  const otherPartyName = otherParty?.full_name || "Utilisateur";
  const otherPartyPhone = otherParty?.phone;

  const handleCall = () => {
    if (otherPartyPhone) {
      window.location.href = `tel:${otherPartyPhone}`;
    } else {
      toast({
        title: "Numéro non disponible",
        description: "Ce professionnel n'a pas renseigné de numéro de téléphone",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 flex-shrink-0">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={otherPartyAvatar || undefined} />
          <AvatarFallback>
            {otherPartyName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{capitalizeWords(otherPartyName)}</p>
          {conversationDetails.dogs?.name && (
            <p className="text-xs text-muted-foreground truncate">Concernant: {capitalizeWords(conversationDetails.dogs.name)}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="flex-shrink-0 rounded-full gap-2"
          title="Appeler"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Aucun message pour le moment</p>
            <p className="text-sm mt-2">Envoyez un message pour commencer la conversation</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                    {format(new Date(message.created_at), "HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full"
            disabled={sending}
          />
          <Button type="submit" size="icon" className="rounded-full flex-shrink-0" disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChatWindow;