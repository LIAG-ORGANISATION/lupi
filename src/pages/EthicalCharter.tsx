import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EthicalCharter = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState({
    read: false,
    abide: false,
  });

  const canJoin = agreed.read && agreed.abide;

  const charter = [
    {
      title: "1. Respect et Professionnalisme",
      content: "Traitez tous les membres avec respect et professionnalisme. Évitez le langage offensant, le harcèlement ou la discrimination de toute nature.",
    },
    {
      title: "2. Confidentialité",
      content: "Respectez la confidentialité des informations partagées au sein du réseau. Ne divulguez pas d'informations sensibles ou propriétaires sans consentement explicite.",
    },
    {
      title: "3. Collaboration et Soutien",
      content: "Favorisez un environnement collaboratif et solidaire. Offrez assistance et conseils aux autres membres, et participez à des discussions constructives.",
    },
    {
      title: "4. Intégrité et Honnêteté",
      content: "Maintenez l'intégrité et l'honnêteté dans toutes les interactions. Fournissez des informations précises et évitez de dénaturer vos compétences ou votre expérience.",
    },
    {
      title: "5. Inclusivité et Diversité",
      content: "Embrassez la diversité et l'inclusivité. Valorisez les différentes perspectives et expériences, et créez un espace accueillant pour tous les membres.",
    },
    {
      title: "6. Retour Constructif",
      content: "Fournissez des retours constructifs lorsque nécessaire. Concentrez-vous sur l'amélioration de la collaboration et des résultats, et évitez les attaques personnelles ou la négativité.",
    },
    {
      title: "7. Résolution de Conflits",
      content: "Abordez les conflits de manière respectueuse et professionnelle. Recherchez la médiation ou l'aide des administrateurs du réseau si nécessaire.",
    },
    {
      title: "8. Propriété Intellectuelle",
      content: "Respectez les droits de propriété intellectuelle. Obtenez une autorisation appropriée avant d'utiliser ou de partager des matériaux protégés par des droits d'auteur.",
    },
    {
      title: "9. Confidentialité des Données",
      content: "Protégez la vie privée des données personnelles. Respectez les réglementations sur la protection des données et traitez les données personnelles de manière responsable.",
    },
    {
      title: "10. Réputation du Réseau",
      content: "Défendez la réputation du réseau. Évitez les actions qui pourraient nuire à l'image ou à la crédibilité du réseau.",
    },
    {
      title: "11. Conformité aux Lois",
      content: "Respectez toutes les lois et réglementations applicables. Ne vous engagez pas dans des activités illégales ou ne promouvez pas de comportements illicites.",
    },
    {
      title: "12. Signalement des Violations",
      content: "Signalez toute violation de cette charte aux administrateurs du réseau. Fournissez des informations précises et complètes lors du signalement de problèmes.",
    },
    {
      title: "13. Amendements",
      content: "Cette charte peut être modifiée de temps à autre. Les membres seront informés de tout changement, et la participation continue au réseau implique l'acceptation de la charte mise à jour.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professional/welcome")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-title">Charte Éthique</h1>
        </div>

        <div className="p-6 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-title">
              Charte Éthique de<br />Collaboration Lupi
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Bienvenue sur Lupi ! Avant de rejoindre notre réseau de professionnels, veuillez consulter et accepter notre Charte Éthique de Collaboration. Cette charte énonce les principes et les valeurs qui guident notre communauté, garantissant un environnement sûr, inclusif et productif pour tous les membres.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {charter.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-bold text-title">{item.title}</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-4 pt-8 border-t border-border">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="read"
                  checked={agreed.read}
                  onCheckedChange={(checked) =>
                    setAgreed({ ...agreed, read: checked as boolean })
                  }
                />
                <label
                  htmlFor="read"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'ai lu et compris la Charte Éthique de Collaboration de Lupi.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="abide"
                  checked={agreed.abide}
                  onCheckedChange={(checked) =>
                    setAgreed({ ...agreed, abide: checked as boolean })
                  }
                />
                <label
                  htmlFor="abide"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte de respecter les principes et les valeurs énoncés dans cette charte.
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => navigate("/professional/ethical-charter")}
                variant="outline"
                className="rounded-full"
                size="lg"
              >
                Relire la Charte
              </Button>
              
              <Button
                onClick={() => navigate("/professional/edit-profile")}
                disabled={!canJoin}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                size="lg"
              >
                Rejoindre le Réseau
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalCharter;
