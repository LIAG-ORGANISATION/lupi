import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Calendar, Wallet, TrendingUp, Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { redirectToCheckout, redirectToCustomerPortal } from "@/lib/stripe-checkout";
import { PLAN_CONFIG, PlanType } from "@/lib/stripe";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

const BillingSettings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, userId } = useUserRole();
  const { toast } = useToast();
  const { subscription, loading: subscriptionLoading, refetch } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const isProfessional = role === "professional";

  // Handle checkout success/cancel redirects
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast({
        title: "Abonnement activé !",
        description: "Votre abonnement a été configuré avec succès.",
      });
      refetch();
      // Clean URL
      navigate('/profile/billing', { replace: true });
    } else if (canceled === 'true') {
      toast({
        title: "Paiement annulé",
        description: "Vous pouvez réessayer à tout moment.",
        variant: "destructive",
      });
      // Clean URL
      navigate('/profile/billing', { replace: true });
    }
  }, [searchParams, toast, navigate, refetch]);

  const handleSubscribe = async (planType: PlanType) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour souscrire.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutLoading(planType);
    try {
      await redirectToCheckout(planType, userId);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer la session de paiement.",
        variant: "destructive",
      });
      setCheckoutLoading(null);
    }
  };

  const handleManagePayment = async () => {
    if (!subscription) {
      toast({
        title: "Erreur",
        description: "Aucun abonnement trouvé.",
        variant: "destructive",
      });
      return;
    }

    try {
      await redirectToCustomerPortal();
    } catch (error) {
      console.error('Customer portal error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'accéder au portail client.",
        variant: "destructive",
      });
    }
  };

  const getSubscriptionStatusText = () => {
    if (!subscription) return null;

    const planConfig = PLAN_CONFIG[subscription.plan_type];
    
    if (subscription.status === 'trial' && subscription.trial_end) {
      const trialEndDate = format(new Date(subscription.trial_end), "d MMMM yyyy", { locale: fr });
      return `Essai en cours – se termine le ${trialEndDate}`;
    }
    
    if (subscription.status === 'active' && subscription.current_period_end) {
      const periodEndDate = format(new Date(subscription.current_period_end), "d MMMM yyyy", { locale: fr });
      return `Abonnement actif jusqu'au ${periodEndDate}`;
    }
    
    if (subscription.status === 'canceled' && subscription.current_period_end) {
      const periodEndDate = format(new Date(subscription.current_period_end), "d MMMM yyyy", { locale: fr });
      return `Abonnement annulé – accès jusqu'au ${periodEndDate}`;
    }
    
    if (subscription.status === 'past_due') {
      return "Paiement en attente – veuillez mettre à jour votre moyen de paiement";
    }
    
    if (subscription.status === 'expired') {
      return "Abonnement expiré";
    }

    return `Statut: ${subscription.status}`;
  };

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
        <h1 className="text-2xl font-bold text-title">Abonnement & paiement</h1>
      </div>

      <div className="space-y-4">
        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Abonnement actuel</h2>
          {subscriptionLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Chargement...</span>
            </div>
          ) : subscription ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{PLAN_CONFIG[subscription.plan_type]?.name || subscription.plan_type}</p>
                  <p className="text-sm text-muted-foreground">{getSubscriptionStatusText()}</p>
                </div>
              </div>
              {(subscription.status === 'active' || subscription.status === 'trial') && (
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleManagePayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Gérer l'abonnement et le paiement
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Gratuit</p>
                <p className="text-sm text-muted-foreground">Accès limité aux fonctionnalités de base</p>
              </div>
            </div>
          )}
        </Card>

        {isProfessional ? (
          <>
            <Card className="p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-title">Abonnement Professionnel</h2>
              
              <div className="space-y-4">
                {/* Formule Mensuelle */}
                <Card className="p-6 rounded-2xl border-2 border-primary/20 bg-secondary/50">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-title">Formule Mensuelle</h3>
                      <div className="text-right whitespace-nowrap flex-shrink-0">
                        <span className="text-3xl font-bold text-primary">14,90 €</span>
                        <span className="text-sm text-muted-foreground">/mois</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Référencement du profil professionnel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Accès à la messagerie clients</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Être contacté par les propriétaires</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Consulter et envoyer des documents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Recevoir des commissions sur les tests ADN</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>1 mois d'essai gratuit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Sans engagement</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full rounded-full bg-primary hover:bg-primary/90"
                      onClick={() => handleSubscribe('pro_mensuel_14_90')}
                      disabled={checkoutLoading === 'pro_mensuel_14_90' || !!subscription}
                    >
                      {checkoutLoading === 'pro_mensuel_14_90' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirection...
                        </>
                      ) : subscription ? (
                        'Abonnement actif'
                      ) : (
                        'Souscrire maintenant'
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Formule Annuelle avec engagement */}
                <Card className="p-6 rounded-2xl border-2 border-primary bg-primary/5">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-title">Formule Annuelle</h3>
                        <span className="text-xs text-primary font-medium">Meilleure offre • 3 mois d'essai gratuit</span>
                      </div>
                      <div className="text-right whitespace-nowrap flex-shrink-0">
                        <span className="text-3xl font-bold text-primary">14,90 €</span>
                        <span className="text-sm text-muted-foreground">/mois</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Tous les avantages de la formule mensuelle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>3 mois d'essai gratuit (au lieu de 1)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="font-semibold">Engagement annuel (12 mois)</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full rounded-full bg-primary hover:bg-primary/90"
                      onClick={() => handleSubscribe('pro_annuel_14_90')}
                      disabled={checkoutLoading === 'pro_annuel_14_90' || !!subscription}
                    >
                      {checkoutLoading === 'pro_annuel_14_90' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirection...
                        </>
                      ) : subscription ? (
                        'Abonnement actif'
                      ) : (
                        'Souscrire maintenant'
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl space-y-4 border-2 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="icon-container">
                  <Wallet className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-title">Cagnotte commission test ADN</h2>
                  <p className="text-sm text-muted-foreground">Commissions accumulées</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-title">0,00 €</span>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Commission : 10% par test ADN vendu
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => toast({
                    title: "Décaissement demandé",
                    description: "Votre demande sera traitée sous 48h.",
                  })}
                >
                  Décaisser
                </Button>
                <Button 
                  className="rounded-full bg-accent hover:bg-accent/90"
                  onClick={() => toast({
                    title: "Merci pour votre générosité",
                    description: "Choisissez une association bénéficiaire.",
                  })}
                >
                  Reverser à une asso
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-title">Abonnement Guardian</h2>
            
            <div className="space-y-4">
              {/* Formule Mensuelle */}
              <Card className="p-6 rounded-2xl border-2 border-primary/20 bg-secondary/50">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-title">Formule Mensuelle</h3>
                    <div className="text-right whitespace-nowrap flex-shrink-0">
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
                    onClick={() => handleSubscribe('gardien_mensuel_4_90')}
                    disabled={checkoutLoading === 'gardien_mensuel_4_90' || !!subscription}
                  >
                    {checkoutLoading === 'gardien_mensuel_4_90' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirection...
                      </>
                    ) : subscription ? (
                      'Abonnement actif'
                    ) : (
                      'Souscrire maintenant'
                    )}
                  </Button>
                </div>
              </Card>

              {/* Formule Annuelle */}
              <Card className="p-6 rounded-2xl border-2 border-primary bg-primary/5">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-title">Formule Annuelle</h3>
                      <span className="text-xs text-primary font-medium">Meilleure offre • 2 mois offerts</span>
                    </div>
                    <div className="text-right whitespace-nowrap flex-shrink-0">
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
                    onClick={() => handleSubscribe('gardien_annuel_45')}
                    disabled={checkoutLoading === 'gardien_annuel_45' || !!subscription}
                  >
                    {checkoutLoading === 'gardien_annuel_45' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirection...
                      </>
                    ) : subscription ? (
                      'Abonnement actif'
                    ) : (
                      'Souscrire maintenant'
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        )}

        {subscription && (
          <Card className="p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-title">Moyens de paiement</h2>
            <p className="text-sm text-muted-foreground">
              Gérez votre moyen de paiement et votre abonnement via le portail Stripe
            </p>
            <Button 
              variant="outline" 
              className="w-full rounded-full"
              onClick={handleManagePayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Gérer le paiement
            </Button>
          </Card>
        )}

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
