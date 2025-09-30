import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import heroImage from "@/assets/hero-dog-dna.jpg";

const DNAKit = () => {
  const navigate = useNavigate();

  const features = [
    "Identification des races avec précision",
    "Analyse de 200+ conditions de santé",
    "Profil comportemental détaillé",
    "Résultats en 2-3 semaines",
    "Certificat d'analyse inclus",
  ];

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Kit ADN Lupi</h1>
      </div>

      <Card className="bg-hero-gradient p-6 rounded-3xl text-center space-y-4 text-white">
        <Package className="h-16 w-16 mx-auto" />
        <h2 className="text-2xl font-bold">
          Débloquez le potentiel de votre chien
        </h2>
        <p className="text-sm opacity-90">
          Découvrez sa composition de race, ses prédispositions santé et son profil comportemental
        </p>
      </Card>

      <img
        src={heroImage}
        alt="Kit ADN"
        className="w-full h-48 object-cover rounded-3xl shadow-lg"
      />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Ce qui est inclus</h3>
        <Card className="p-6 rounded-3xl space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card className="p-6 rounded-3xl bg-secondary space-y-3">
        <h3 className="text-lg font-bold text-title">Comment ça marche ?</h3>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="font-bold text-primary">1.</span>
            <span>Commandez votre kit et recevez-le sous 3-5 jours</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">2.</span>
            <span>Prélevez un échantillon de salive de votre chien</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">3.</span>
            <span>Renvoyez l'échantillon dans l'enveloppe prépayée</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">4.</span>
            <span>Recevez vos résultats en 2-3 semaines</span>
          </li>
        </ol>
      </Card>

      <div className="sticky bottom-20 space-y-3 bg-background pt-4">
        <div className="flex items-baseline justify-between px-4">
          <span className="text-sm text-muted-foreground">Prix</span>
          <div className="text-right">
            <span className="text-3xl font-bold text-title">149€</span>
            <span className="text-sm text-muted-foreground ml-1">TTC</span>
          </div>
        </div>
        <Button
          onClick={() => navigate("/checkout")}
          className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
        >
          Commander maintenant
        </Button>
      </div>
    </div>
  );
};

export default DNAKit;
