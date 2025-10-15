import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireData {
  id: string;
  questionnaire_data: any;
  completed_at: string;
}

const QuestionnaireResults = () => {
  const navigate = useNavigate();
  const { id: dogId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dogId && user) {
      fetchQuestionnaire();
    }
  }, [dogId, user]);

  const fetchQuestionnaire = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_questionnaires')
        .select('*')
        .eq('dog_id', dogId)
        .single();

      if (error) throw error;
      setQuestionnaire(data);
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le questionnaire.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!questionnaire) return;

    const shareData = {
      title: 'Questionnaire comportemental',
      text: 'Résultats du questionnaire comportemental',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Partagé",
          description: "Le lien a été partagé avec succès.",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderSection = (title: string, data: any, fields: { key: string; label: string }[]) => {
    return (
      <Card className="p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-title">{title}</h3>
        <div className="space-y-3">
          {fields.map((field) => {
            const value = data[field.key];
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            return (
              <div key={field.key} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                <p className="text-sm text-foreground">
                  {Array.isArray(value) ? value.join(', ') : value}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="min-h-screen p-4 space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card className="p-6 rounded-3xl text-center">
          <p className="text-muted-foreground">Aucun questionnaire trouvé</p>
        </Card>
      </div>
    );
  }

  const data = questionnaire.questionnaire_data;

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-title">Questionnaire comportemental</h1>
            <p className="text-sm text-muted-foreground">
              Complété le {new Date(questionnaire.completed_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleShare}
          className="rounded-full"
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>

      <div className="space-y-4">
        {renderSection("Identité & statut", data, [
          { key: "idNumber", label: "Numéro d'identification" },
          { key: "birthDate", label: "Date de naissance" },
          { key: "sex", label: "Sexe" },
          { key: "neutered", label: "Stérilisé" },
          { key: "weight", label: "Poids (kg)" },
          { key: "disability", label: "Handicap" },
        ])}

        {renderSection("Historique de vie", data, [
          { key: "previousHomes", label: "Foyers précédents" },
          { key: "transitionsCount", label: "Nombre de transitions" },
          { key: "separationAge", label: "Âge de séparation (semaines)" },
          { key: "socialization", label: "Socialisation" },
          { key: "trauma", label: "Expériences traumatiques" },
          { key: "traumaDescription", label: "Description du trauma" },
        ])}

        {renderSection("Santé & traitements", data, [
          { key: "medicalHistory", label: "Antécédents médicaux" },
          { key: "currentTreatments", label: "Traitements actuels" },
          { key: "vaccinations", label: "Vaccinations" },
          { key: "deworming", label: "Vermifuge" },
          { key: "allergies", label: "Allergies" },
        ])}

        {renderSection("Alimentation", data, [
          { key: "foodType", label: "Type d'alimentation" },
          { key: "supplements", label: "Suppléments" },
          { key: "digestiveSymptoms", label: "Symptômes digestifs" },
          { key: "foodAllergies", label: "Allergies alimentaires" },
        ])}

        {renderSection("Comportements", data, [
          { key: "noiseReactions", label: "Réactions aux bruits" },
          { key: "strangerReaction", label: "Réaction aux inconnus" },
          { key: "dogReaction", label: "Réaction aux autres chiens" },
          { key: "carReaction", label: "Réaction en voiture" },
          { key: "vetReaction", label: "Réaction chez le vétérinaire" },
          { key: "compulsiveBehaviors", label: "Comportements compulsifs" },
          { key: "energyLevel", label: "Niveau d'énergie" },
        ])}

        {renderSection("Environnement", data, [
          { key: "habitatType", label: "Type d'habitat" },
          { key: "householdComposition", label: "Composition du foyer" },
          { key: "aloneTime", label: "Temps seul" },
          { key: "householdRhythm", label: "Rythme du foyer" },
        ])}

        {renderSection("Activité physique", data, [
          { key: "walkDuration", label: "Durée des promenades" },
          { key: "regularActivities", label: "Activités régulières" },
          { key: "activityFrequency", label: "Fréquence d'activité" },
          { key: "boredomSigns", label: "Signes d'ennui" },
        ])}

        {renderSection("Éducation", data, [
          { key: "acquiredSkills", label: "Compétences acquises" },
          { key: "educationMethods", label: "Méthodes d'éducation" },
          { key: "attentionDifficulties", label: "Difficultés d'attention" },
          { key: "newSkills", label: "Nouvelles compétences" },
        ])}

        {renderSection("Objectifs", data, [
          { key: "relationshipDifficulties", label: "Difficultés relationnelles" },
          { key: "professionalSupport", label: "Accompagnement professionnel" },
          { key: "emotionalState", label: "État émotionnel" },
        ])}
      </div>
    </div>
  );
};

export default QuestionnaireResults;
