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

  const handleBack = () => {
    if (selectedConversationId) {
      // Si une conversation est ouverte, revenir à la liste
      setSelectedConversationId(null);
    } else {
      // Sinon, retourner au dashboard
      navigate("/guardian/dashboard");
    }
  };

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen bg-background pb-24">
        {/* Hero Section with Gradient */}
        <div className="bg-gradient-to-br from-[#6B1C1C] to-[#4A0F0F] p-5 pb-12 rounded-b-[3rem] shadow-card">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
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
              <div className="h-[calc(100vh-250px)]">
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

export default GuardianMessages;
