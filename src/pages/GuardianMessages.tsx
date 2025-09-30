import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const GuardianMessages = () => {
  const navigate = useNavigate();

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/guardian/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Messages</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucun message pour le moment</p>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuardianMessages;
