import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const GuardianMessages = () => {
  const navigate = useNavigate();

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

        <div className="max-w-4xl mx-auto px-4 -mt-6 animate-fade-in">
          <Card className="lupi-card p-8 text-center">
            <p className="text-muted-foreground">Aucun message pour le moment</p>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuardianMessages;
