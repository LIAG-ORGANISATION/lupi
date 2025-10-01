import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SalesTerms = () => {
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
        <h1 className="text-2xl font-bold text-title">Conditions Générales de Vente</h1>
      </div>

      <Card className="p-6 rounded-3xl space-y-6">
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">Dernière mise à jour : octobre 2025</p>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">1. Objet</h2>
            <p>
              Les présentes CGV régissent les ventes de kits ADN et services associés proposés 
              via LupiApp.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">2. Produits</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Kits ADN pour chiens</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Accès à l'application et fonctionnalités associées (profils, rapports, analyses, etc.)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">3. Prix</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les prix sont indiqués en euros TTC.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>LupiApp se réserve le droit de modifier ses tarifs à tout moment.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">4. Commande</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>La commande est validée une fois le paiement confirmé.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Le client reçoit un e-mail de confirmation.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">5. Paiement</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Par carte bancaire (Stripe) ou autres moyens proposés dans l'application.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Le paiement est sécurisé via nos prestataires de paiement.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">6. Livraison</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les kits ADN sont expédiés à l'adresse indiquée par le client.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Délais moyens : 5 à 7 jours ouvrés.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">7. Droit de rétractation</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Conformément au Code de la consommation, vous disposez d'un délai de 14 jours pour annuler votre achat.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Le kit doit être retourné non utilisé et dans son emballage d'origine.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">8. Garantie</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les kits sont garantis contre les défauts de fabrication.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>En cas de problème, contactez support@lupiapp.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">9. Responsabilité</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>LupiApp n'est pas responsable des résultats ADN ou de leur interprétation médicale/vétérinaire.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les informations fournies sont à visée informative et ne remplacent pas un avis professionnel.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">10. Litiges</h2>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les présentes CGV sont soumises au droit français.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Tout litige sera soumis aux tribunaux compétents.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesTerms;
