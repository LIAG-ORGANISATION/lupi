import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dog, Briefcase } from "lucide-react";

const ChooseAccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-title">Bienvenue sur Lupi</h1>
          <p className="text-foreground">Choisissez votre type de compte</p>
        </div>

        <div className="space-y-4">
          <Card 
            className="p-6 rounded-3xl cursor-pointer hover:border-primary transition-all"
            onClick={() => navigate('/auth?type=guardian')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Dog className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-title text-lg">Gardien</h3>
                <p className="text-sm text-muted-foreground">
                  Je veux gérer mes chiens et trouver des professionnels
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 rounded-3xl cursor-pointer hover:border-primary transition-all"
            onClick={() => navigate('/professional/auth')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-title text-lg">Professionnel</h3>
                <p className="text-sm text-muted-foreground">
                  Je suis vétérinaire, éducateur ou autre professionnel canin
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseAccountType;
