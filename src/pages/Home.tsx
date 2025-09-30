import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TestTube2, ClipboardList, Stethoscope, Lightbulb, LogIn } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import heroImage from "@/assets/hero-dog-dna.jpg";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isProfessional, isGuardian } = useAuth();

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <Card className="bg-secondary p-6 rounded-3xl shadow-lg overflow-hidden relative">
        <div className="relative z-10 space-y-4">
          <h1 className="text-2xl font-bold text-title">
            Découvrez l'ADN de votre chien
          </h1>
          <p className="text-sm text-foreground/80">
            Analyse complète des races, prédispositions santé et profil comportemental
          </p>
          <img 
            src={heroImage} 
            alt="Chien avec ADN" 
            className="w-full h-48 object-cover rounded-2xl my-4"
          />
          <div className="space-y-2">
            {!isAuthenticated ? (
              <>
                <Button 
                  onClick={() => navigate("/choose-account-type")} 
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  size="lg"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter / S'inscrire
                </Button>
              </>
            ) : (
              <>
                {isGuardian && (
                  <>
                    <Button 
                      onClick={() => navigate("/guardian/dashboard")} 
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      size="lg"
                    >
                      Mon tableau de bord
                    </Button>
                    <Button 
                      onClick={() => navigate("/dna-kit")} 
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
                      size="lg"
                    >
                      Commander un kit ADN
                    </Button>
                  </>
                )}
                {isProfessional && (
                  <Button 
                    onClick={() => navigate("/professional/dashboard")} 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    size="lg"
                  >
                    Mon tableau de bord Pro
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-bold text-title mb-4">Accès rapide</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard
            icon={TestTube2}
            label="Tests ADN"
            onClick={() => navigate("/dogs")}
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Questionnaire"
            onClick={() => navigate("/questionnaire")}
          />
          <QuickActionCard
            icon={Stethoscope}
            label="Pros & RDV"
            onClick={() => navigate("/professionals")}
          />
          <QuickActionCard
            icon={Lightbulb}
            label="Recommandations"
            onClick={() => navigate("/recommendations")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
