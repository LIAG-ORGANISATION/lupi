import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
const ProfessionalWelcome = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen p-4 flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-title">Bienvenue sur Lupi Pro</h1>
          <p className="text-foreground">
            Connectez-vous avec des gardiens et des professionnels qui partagent votre passion pour le soin des animaux.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate("/professional/ethical-charter")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
            Lire la Charte Éthique
          </Button>
          
          <Button onClick={() => navigate("/professional/edit-profile")} variant="outline" className="w-full rounded-full" size="lg">
            Passer pour l'instant
          </Button>
        </div>
      </div>
    </div>;
};
export default ProfessionalWelcome;