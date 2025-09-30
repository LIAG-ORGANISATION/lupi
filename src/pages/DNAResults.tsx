import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, CheckCircle2, AlertCircle, Circle } from "lucide-react";

const DNAResults = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Résultats ADN</h1>
      </div>

      <Card className="p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-title">Analyse ADN - Buddy</h2>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-title">Composition de race</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Golden Retriever</span>
              <span className="text-sm font-semibold">50%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "50%" }} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Labrador</span>
              <span className="text-sm font-semibold">50%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary/70" style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Santé</h3>
        
        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-title">Dégénérescence myélopathie</h4>
              <p className="text-sm text-green-600">Clear - Aucun risque</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <Circle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-title">Effondrement induit par l'effort</h4>
              <p className="text-sm text-yellow-600">Carrier - Porteur sans symptômes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-title">Atrophie progressive de la rétine</h4>
              <p className="text-sm text-red-600">At risk - Surveillance recommandée</p>
              <p className="text-xs text-muted-foreground mt-1">
                Consultez un vétérinaire pour un suivi régulier
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Traits comportementaux</h3>
        <Card className="p-4 rounded-2xl">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-secondary text-title rounded-full text-sm font-medium">
              Joueur
            </span>
            <span className="px-3 py-1 bg-secondary text-title rounded-full text-sm font-medium">
              Confiant
            </span>
            <span className="px-3 py-1 bg-secondary text-title rounded-full text-sm font-medium">
              Sociable
            </span>
          </div>
        </Card>
      </div>

      <Button
        className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        size="lg"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Partager les résultats
      </Button>
    </div>
  );
};

export default DNAResults;
