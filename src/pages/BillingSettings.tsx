import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Calendar } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

const BillingSettings = () => {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const isProfessional = role === "professional";

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
        <h1 className="text-2xl font-bold text-title">Abonnement & paiement</h1>
      </div>

      <div className="space-y-4">
        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Abonnement actuel</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Gratuit</p>
              <p className="text-sm text-muted-foreground">Accès limité aux fonctionnalités de base</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4 bg-gradient-to-br from-primary/10 to-secondary">
          <h2 className="text-lg font-bold text-title">
            {isProfessional ? "Abonnement Professionnel" : "Passer à Premium"}
          </h2>
          <ul className="space-y-2 text-sm">
            {isProfessional ? (
              <>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Référencement du profil professionnel</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Accès à la messagerie clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Être contacté par les propriétaires</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Consulter et envoyer des documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Recevoir des commissions sur les tests ADN</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Tests ADN illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Accès prioritaire aux professionnels</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Recommandations personnalisées avancées</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Support prioritaire</span>
                </li>
              </>
            )}
          </ul>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-3xl font-bold text-title">
              {isProfessional ? "14,99€" : "9,99€"}
            </span>
            <span className="text-muted-foreground">/mois</span>
          </div>
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
            Souscrire maintenant
          </Button>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Moyens de paiement</h2>
          <p className="text-sm text-muted-foreground">
            Aucun moyen de paiement enregistré
          </p>
          <Button variant="outline" className="w-full rounded-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Ajouter une carte
          </Button>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Historique des paiements</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Kit ADN</p>
                  <p className="text-xs text-muted-foreground">15 mars 2025</p>
                </div>
              </div>
              <span className="font-semibold">149€</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BillingSettings;
