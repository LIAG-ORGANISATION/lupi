import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ConversationsList from "@/components/ConversationsList";
import ChatWindow from "@/components/ChatWindow";

const GuardianMessages = () => {
  const navigate = useNavigate();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen bg-background pb-24">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-br from-[#6B1C1C] to-[#4A0F0F] p-5 pb-12 rounded-b-[3rem] shadow-card">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full mb-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Messages</h1>
              <p className="text-white/80 text-sm">Échangez avec les professionnels</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-6 animate-fade-in">
          <div className="grid md:grid-cols-[350px,1fr] gap-4">
            {/* Conversations list - hidden on mobile when a conversation is selected */}
            <div className={`${selectedConversationId ? "hidden md:block" : "block"}`}>
              <ConversationsList
                onSelectConversation={setSelectedConversationId}
                selectedConversationId={selectedConversationId}
              />
            </div>

            {/* Chat window */}
            <div className={`${selectedConversationId ? "block" : "hidden md:block"}`}>
              {selectedConversationId ? (
                <ChatWindow
                  conversationId={selectedConversationId}
                  onBack={() => setSelectedConversationId(null)}
                />
              ) : (
                <div className="hidden md:flex h-[calc(100vh-200px)] items-center justify-center bg-muted/30 rounded-3xl">
                  <p className="text-muted-foreground">Sélectionnez une conversation pour commencer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuardianMessages;
