import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Calendar } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

const BillingSettings = () => {
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { toast } = useToast();
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

        {isProfessional ? (
          <Card className="p-6 rounded-3xl space-y-4 bg-gradient-to-br from-primary/10 to-secondary">
            <h2 className="text-lg font-bold text-title">Abonnement Professionnel</h2>
            <ul className="space-y-2 text-sm">
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
            </ul>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-bold text-title">14,99€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
              Souscrire maintenant
            </Button>
          </Card>
        ) : (
          <Card className="p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-title">Abonnement Guardian</h2>
            
            <div className="space-y-4">
              {/* Formule Mensuelle */}
              <Card className="p-6 rounded-2xl border-2 border-primary/20 bg-secondary/50">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold text-title">Formule Mensuelle</h3>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">4,99 €</span>
                      <span className="text-sm text-muted-foreground">/mois</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Profils chiens illimités</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Suivi santé et comportement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Accès aux professionnels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Messagerie sécurisée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Partage de documents</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => toast({
                      title: "Bientôt disponible",
                      description: "L'abonnement mensuel sera disponible prochainement.",
                    })}
                  >
                    Souscrire maintenant
                  </Button>
                </div>
              </Card>

              {/* Formule Annuelle */}
              <Card className="p-6 rounded-2xl border-2 border-primary bg-primary/5">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-title">Formule Annuelle</h3>
                      <span className="text-xs text-primary font-medium">Meilleure offre • 2 mois offerts</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">45 €</span>
                      <span className="text-sm text-muted-foreground">/an</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Tous les avantages de la formule mensuelle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>2 mois offerts (équivalent à 3,75€/mois)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="font-semibold">5 € reversés à une association de protection animale</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => toast({
                      title: "Bientôt disponible",
                      description: "L'abonnement annuel sera disponible prochainement.",
                    })}
                  >
                    Souscrire maintenant
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        )}

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
