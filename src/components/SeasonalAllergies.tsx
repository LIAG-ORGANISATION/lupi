import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Leaf, Sun, Cloud, Snowflake, ChevronDown, ChevronUp } from "lucide-react";

interface SeasonData {
  name: string;
  icon: React.ReactNode;
  color: string;
  allergens: string[];
  symptoms: string[];
  tips: string[];
  funFact: string;
}

const getSeasonData = (): SeasonData => {
  const month = new Date().getMonth();
  
  // Printemps (Mars à Mai)
  if (month >= 2 && month <= 4) {
    return {
      name: "Printemps",
      icon: <Leaf className="h-6 w-6" />,
      color: "bg-gradient-to-br from-primary/10 to-primary/5",
      allergens: ["Pollens (arbres : bouleau, chêne, platane, aulne)", "Herbes en floraison", "Acariens", "Poussières accumulées"],
      symptoms: ["Démangeaisons, léchage excessif des pattes", "Otites récidivantes", "Yeux rouges et larmoyants", "Éruptions cutanées sur le ventre"],
      tips: [
        "Rincer ou essuyer les pattes après chaque balade",
        "Brosser régulièrement le pelage",
        "Nettoyer la literie 1x/semaine",
        "Aérer tôt le matin (pollens plus faibles)",
        "Ajouter des oméga-3 dans l'alimentation"
      ],
      funFact: "Comme nous, les chiens peuvent éternuer au printemps ! Découvrez comment limiter le pollen dans leur pelage."
    };
  }
  
  // Été (Juin à Août)
  if (month >= 5 && month <= 7) {
    return {
      name: "Été",
      icon: <Sun className="h-6 w-6" />,
      color: "bg-gradient-to-br from-primary/10 to-primary/5",
      allergens: ["Piqûres de puces, tiques, moustiques", "Pollens d'herbes hautes (graminées)", "Moisissures dues à la chaleur", "Produits chimiques (eau chlorée)"],
      symptoms: ["Grattage intensif, rougeurs", "Perte de poils localisée", "Allergies de contact (pattes irritées)", "Dermatite estivale, eczéma humide"],
      tips: [
        "Traitement antiparasitaire régulier",
        "Rincer après baignade (mer ou piscine)",
        "Séchage complet du pelage",
        "Surveiller les zones humides (entre doigts, oreilles)",
        "Hydratation accrue"
      ],
      funFact: "Les moustiques ne piquent pas que vous ! Préparez votre trousse d'été anti-allergies pour chien."
    };
  }
  
  // Automne (Septembre à Novembre)
  if (month >= 8 && month <= 10) {
    return {
      name: "Automne",
      icon: <Cloud className="h-6 w-6" />,
      color: "bg-gradient-to-br from-primary/10 to-primary/5",
      allergens: ["Moisissures (feuilles humides)", "Acariens en forte activité", "Pollens tardifs (ambroisie)", "Débris organiques en décomposition"],
      symptoms: ["Démangeaisons au ventre ou aux oreilles", "Rougeurs autour des yeux", "Léchage excessif des pattes", "Écoulements nasaux légers"],
      tips: [
        "Nettoyer les coussinets après promenades boueuses",
        "Laver les couvertures régulièrement",
        "Éviter les zones de feuilles en décomposition",
        "Contrôler les oreilles chaque semaine",
        "Maintenir un environnement sec et ventilé"
      ],
      funFact: "L'automne, c'est beau… sauf pour les allergies ! Découvrez comment les feuilles mortes peuvent irriter votre chien."
    };
  }
  
  // Hiver (Décembre à Février)
  return {
    name: "Hiver",
    icon: <Snowflake className="h-6 w-6" />,
    color: "bg-gradient-to-br from-primary/10 to-primary/5",
    allergens: ["Acariens (espaces chauffés)", "Produits chimiques (sels de déneigement)", "Moisissures intérieures", "Poussières et poils accumulés"],
    symptoms: ["Peau sèche, pellicules, grattage", "Irritation des coussinets (froid, sel)", "Toux ou éternuements légers", "Rougeurs entre les doigts"],
    tips: [
      "Nettoyer les pattes après la neige ou trottoirs salés",
      "Utiliser une crème protectrice pour coussinets",
      "Humidifier légèrement l'air ambiant",
      "Aérer la maison 10 min/jour",
      "Donner des compléments en acides gras"
    ],
    funFact: "Même en hiver, les acariens ne dorment jamais ! Découvrez comment garder un air sain pour votre chien."
  };
};

export const SeasonalAllergies = () => {
  const seasonData = getSeasonData();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-title">Allergies de saison</h2>
      </div>
      
      <Card className="lupi-card overflow-hidden">
        {/* Header with season */}
        <div className={`${seasonData.color} p-4 flex items-center gap-3`}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {seasonData.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-title">{seasonData.name}</h3>
            <p className="text-sm text-muted-foreground">Conseils pour protéger votre chien</p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Allergènes fréquents */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Allergènes fréquents</h4>
            <ul className="space-y-1">
              {seasonData.allergens.map((allergen, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{allergen}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contenu déployable */}
          {isExpanded && (
            <div className="space-y-4 animate-fade-in">
              {/* Symptômes */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Symptômes à surveiller</h4>
                <ul className="space-y-1">
                  {seasonData.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Conseils préventifs */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Conseils préventifs</h4>
                <ul className="space-y-1">
                  {seasonData.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Fun Fact */}
              <div className="bg-secondary/50 p-3 rounded-xl">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Le saviez-vous ?</span> {seasonData.funFact}
                </p>
              </div>
            </div>
          )}
          
          {/* Bouton Voir plus/moins */}
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-primary hover:text-primary/90"
          >
            {isExpanded ? (
              <>
                Voir moins <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Voir plus <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
