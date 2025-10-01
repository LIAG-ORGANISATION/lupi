import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Activity, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";

const Recommendations = () => {
  const navigate = useNavigate();
  const recommendations = {
    training: [
      { title: "Apprenez à votre chien à s'asseoir", icon: Trophy },
      { title: "Enseignez le rappel", icon: Trophy },
    ],
    activities: [
      { title: "Faire une balade", icon: Activity },
      { title: "Jouer à rapporter", icon: Activity },
    ],
    partners: [
      { 
        title: "Kozoo - Assurance chien", 
        description: "Protégez votre compagnon avec une assurance adaptée",
        icon: ExternalLink,
        url: "https://www.kozoo.eu/assurance-chien/"
      },
      { 
        title: "PennyPet - Cashback", 
        description: "Gagnez du cashback sur vos achats pour animaux",
        icon: ExternalLink,
        url: "https://pennypet.io/cashback/"
      },
    ],
  };

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div>
        <h1 className="text-2xl font-bold text-title mb-2">Recommandations</h1>
        <p className="text-sm text-muted-foreground">
          Conseils personnalisés pour votre compagnon
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-title mb-3">Entraînement</h2>
          <div className="space-y-3">
            {recommendations.training.map((item, index) => (
              <Card key={index} className="p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full" 
                    size="sm"
                    onClick={() => navigate(`/recommendations/${index + 1}`)}
                  >
                    Voir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-title mb-3">Activités</h2>
          <div className="space-y-3">
            {recommendations.activities.map((item, index) => (
              <Card key={index} className="p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full" 
                    size="sm"
                    onClick={() => navigate(`/recommendations/${index + 1}`)}
                  >
                    Voir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-title mb-3">Partenaires</h2>
          <div className="space-y-3">
            {recommendations.partners.map((item, index) => (
              <Card key={index} className="p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full" 
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    Visiter
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default Recommendations;
