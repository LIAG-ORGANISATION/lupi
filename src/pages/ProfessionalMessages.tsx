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
            onClick={() => navigate("/professional/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Messages</h1>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {/* Conversations list - hidden when a conversation is selected */}
            <div className={`${selectedConversationId ? "hidden" : "block"}`}>
              <ConversationsList
                onSelectConversation={setSelectedConversationId}
                selectedConversationId={selectedConversationId}
              />
            </div>

            {/* Chat window - shown when a conversation is selected */}
            {selectedConversationId && (
              <div className="h-[calc(100vh-200px)]">
                <ChatWindow
                  conversationId={selectedConversationId}
                  onBack={() => setSelectedConversationId(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfessionalMessages;
