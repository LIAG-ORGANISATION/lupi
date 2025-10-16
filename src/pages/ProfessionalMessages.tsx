import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ConversationsList from "@/components/ConversationsList";
import ChatWindow from "@/components/ChatWindow";

const ProfessionalMessages = () => {
  const navigate = useNavigate();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <AuthGuard requiredRole="professional">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background pb-24">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Messages</h1>
        </div>

        <div className="max-w-7xl mx-auto">
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

export default ProfessionalMessages;
