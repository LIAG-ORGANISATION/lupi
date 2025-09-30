import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";

const RecommendationDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/recommendations")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Apprenez le assis</h1>
      </div>

      <div className="space-y-6">
        <div className="relative aspect-video bg-secondary rounded-3xl overflow-hidden flex items-center justify-center">
          <Button size="icon" className="w-16 h-16 rounded-full">
            <Play className="h-8 w-8" />
          </Button>
        </div>

        <Card className="p-6 rounded-3xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-title mb-2">Description</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Apprendre à votre chien à s'asseoir est l'une des commandes de base les plus importantes. Cette compétence améliore la communication et renforce votre relation avec votre compagnon.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-title mb-2">Durée</h3>
            <p className="text-sm text-foreground">5-10 minutes par session</p>
          </div>

          <div>
            <h3 className="font-semibold text-title mb-2">Niveau</h3>
            <p className="text-sm text-foreground">Débutant</p>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Étapes</h2>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-title mb-1">Attirer l'attention</h3>
                <p className="text-sm text-foreground">
                  Tenez une friandise près du nez de votre chien pour attirer son attention.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-title mb-1">Mouvement vers le haut</h3>
                <p className="text-sm text-foreground">
                  Déplacez lentement votre main vers le haut et vers l'arrière de sa tête. Naturellement, son arrière-train touchera le sol.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-title mb-1">Commande verbale</h3>
                <p className="text-sm text-foreground">
                  Dès qu'il s'assoit, dites "Assis" et donnez-lui la friandise avec des félicitations.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-title mb-1">Répétition</h3>
                <p className="text-sm text-foreground">
                  Répétez plusieurs fois par jour, en réduisant progressivement les friandises.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl bg-secondary space-y-2">
          <h3 className="font-semibold text-title">💡 Conseil</h3>
          <p className="text-sm text-foreground">
            Soyez patient et cohérent. Chaque chien apprend à son propre rythme. Des sessions courtes et fréquentes sont plus efficaces qu'une longue session.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationDetail;
