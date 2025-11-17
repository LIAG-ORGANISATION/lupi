import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ConversationsList from "@/components/ConversationsList";
import ChatWindow from "@/components/ChatWindow";
import { isProDirectoryAndMessagingEnabled } from "@/lib/featureFlags";

const GuardianMessages = () => {
  const navigate = useNavigate();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const showProDirectoryAndMessaging = isProDirectoryAndMessagingEnabled();

  const handleBack = () => {
    if (selectedConversationId) {
      // Si une conversation est ouverte, revenir à la liste
      setSelectedConversationId(null);
    } else {
      // Sinon, retourner à l'accueil
      navigate("/");
    }
  };

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen bg-background pb-24">
        {/* Header N26 Simple */}
        <div className="bg-gradient-n26 p-6 mb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                style={{ borderRadius: '16px' }}
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              {!selectedConversationId && showProDirectoryAndMessaging && (
                <Button
                  size="icon"
                  onClick={() => navigate('/professionals')}
                  style={{ borderRadius: '16px', backgroundColor: '#5B9D8C', color: '#FFFFFF' }}
                >
                  <Plus className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              )}
            </div>
            <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'hsl(240 6% 11%)' }}>Messages</h1>
              <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Échangez avec les professionnels</p>
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
