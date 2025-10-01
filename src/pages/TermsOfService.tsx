import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-24">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Conditions Générales d'Utilisation</h1>
      </div>

      <Card className="p-6 rounded-3xl space-y-6">
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">Dernière mise à jour : octobre 2025</p>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">1. Objet</h2>
            <p>
              Les présentes CGU encadrent l'utilisation de LupiApp, application mobile et web 
              destinée aux propriétaires de chiens et aux professionnels du secteur animalier.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">2. Accès au service</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>L'accès à LupiApp nécessite la création d'un compte.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les propriétaires peuvent créer et gérer plusieurs profils chiens.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les professionnels disposent d'un compte distinct pour gérer leur profil et accéder aux patients partagés.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">3. Partage de données</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les propriétaires sont seuls responsables des informations qu'ils partagent.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les professionnels ne peuvent accéder qu'aux profils chiens partagés par les propriétaires.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">4. Responsabilités</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>LupiApp s'efforce de fournir un service fiable, mais ne garantit pas l'absence totale de bugs ou interruptions.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>LupiApp n'est pas responsable des décisions médicales, comportementales ou nutritionnelles prises par les utilisateurs ou les professionnels via l'application.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">5. Utilisation interdite</h2>
            <p>Il est interdit d'utiliser LupiApp pour :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Diffuser des informations fausses ou frauduleuses</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Porter atteinte à la vie privée d'autrui</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Détourner le service de son usage initial</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">6. Suspension de compte</h2>
            <p>
              En cas de non-respect des présentes CGU, LupiApp se réserve le droit de suspendre 
              ou supprimer un compte.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">7. Modification</h2>
            <p>
              LupiApp peut modifier les CGU à tout moment. L'utilisateur sera informé par 
              notification ou e-mail.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TermsOfService;
