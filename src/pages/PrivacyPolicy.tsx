import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
        <h1 className="text-2xl font-bold text-title">Politique de confidentialité</h1>
      </div>

      <Card className="p-6 rounded-3xl space-y-6">
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">Dernière mise à jour : octobre 2025</p>
          
          <p>
            LupiApp (ci-après « nous » ou « l'Application ») attache une importance particulière 
            à la protection des données personnelles de ses utilisateurs. La présente politique 
            de confidentialité explique quelles données sont collectées, comment elles sont 
            utilisées et quels sont vos droits.
          </p>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">1. Responsable du traitement</h2>
            <p>Le responsable du traitement est :</p>
            <p className="font-medium">LupiApp</p>
            <p>Contact : support@lupiapp.com</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">2. Données collectées</h2>
            <p>Nous collectons notamment :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Données des propriétaires (nom, prénom, e-mail, informations de compte)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Données des chiens (nom, race, âge, poids, résultats de tests, questionnaires comportementaux, documents ajoutés)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Données des professionnels (nom, profession, spécialisation, informations de contact)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Données techniques (logs de connexion, appareil, version de l'application)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">3. Finalités</h2>
            <p>Ces données sont utilisées pour :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Créer et gérer les profils chiens et comptes utilisateurs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Permettre le partage volontaire des profils chiens entre propriétaires et professionnels</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Générer et partager des documents (rapports, PDF, résultats)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Améliorer l'application et corriger les bugs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Envoyer des communications liées au service</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">4. Base légale</h2>
            <p>Le traitement des données repose sur :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>L'exécution du contrat (utilisation de LupiApp)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Le consentement explicite lors du partage de données entre propriétaires et professionnels</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les obligations légales (facturation, sécurité)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">5. Conservation</h2>
            <p>
              Les données sont conservées aussi longtemps que nécessaire à la fourniture du service, 
              puis supprimées ou anonymisées. Les documents et profils peuvent être supprimés à tout 
              moment par le propriétaire.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">6. Partage</h2>
            <p>Les données ne sont partagées qu'avec :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les professionnels auxquels le propriétaire a explicitement donné accès</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Nos prestataires techniques (hébergement, stockage sécurisé)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Les autorités, uniquement si la loi l'exige</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">7. Droits utilisateurs</h2>
            <p>Conformément au RGPD, vous disposez des droits :</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Accès à vos données</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Rectification</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Suppression (« droit à l'oubli »)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Limitation et opposition</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Portabilité</span>
              </li>
            </ul>
            <p>Pour exercer vos droits : support@lupiapp.com</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">8. Sécurité</h2>
            <p>
              Nous utilisons des protocoles de sécurité avancés (chiffrement, RLS Supabase, 
              stockage restreint) afin de protéger vos données.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-title">9. Contact</h2>
            <p>Pour toute question : support@lupiapp.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
