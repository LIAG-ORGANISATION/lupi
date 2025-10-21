import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TestTube2, Heart, Eye, Dna } from "lucide-react";

const DNAKit = () => {
  const navigate = useNavigate();

  const included = [
    { icon: TestTube2, text: "1 Écouvillon (Stérile & Hygiénique)" },
    { icon: Heart, text: "Évaluation des Risques de Santé" },
    { icon: Eye, text: "Analyse d'Ascendance & de Traits" },
  ];

  const benefits = [
    { icon: Dna, text: "Identification personnalisée des races" },
    { icon: Heart, text: "Détection précoce des maladies héréditaires" },
    { icon: Eye, text: "Meilleure compréhension de votre chien" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 className="text-2xl font-bold text-title">Kit Test ADN Canin</h2>
          <p className="text-sm text-foreground leading-relaxed">
            Apprenez à mieux connaître votre chien ! Notre test ADN analyse plus de 350 races, types et variétés, identifie les risques de santé génétiques et révèle des traits de personnalité uniques pour vous aider à fournir les meilleurs soins possibles.
          </p>

          <Card className="lupi-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'hsl(0 0% 96%)' }}>
            <h3 className="text-lg font-bold text-title">Contenu du Kit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {included.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lupi-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 className="text-lg font-bold text-title">Avantages Clés</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ paddingTop: '8px' }}>
            <Button
              onClick={() => window.open('https://buy.stripe.com/4gM7sLgN23eHh055pX33W03', '_blank')}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
              style={{ minHeight: '44px' }}
            >
              Commander maintenant - 187,70€
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAKit;
