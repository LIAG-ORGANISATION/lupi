import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

const PrivacySettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Confidentialité</h1>
      </div>

      <div className="space-y-4">
        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Données personnelles</h2>
          <p className="text-sm text-foreground">
            Vos données sont protégées et utilisées uniquement pour améliorer votre expérience LupiApp.
          </p>
          
          <Button
            variant="outline"
            className="w-full rounded-full justify-between"
            onClick={() => window.open('/privacy-policy', '_blank')}
          >
            <span>Politique de confidentialité</span>
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full justify-between"
            onClick={() => window.open('/terms', '_blank')}
          >
            <span>Conditions d'utilisation</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Données ADN</h2>
          <p className="text-sm text-foreground">
            Les données génétiques de votre chien sont stockées de manière sécurisée et ne sont jamais partagées sans votre consentement.
          </p>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Gestion des données</h2>
          
          <Button
            variant="outline"
            className="w-full rounded-full"
          >
            Télécharger mes données
          </Button>

          <Button
            variant="destructive"
            className="w-full rounded-full"
          >
            Supprimer mon compte
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Cette action est irréversible
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySettings;
