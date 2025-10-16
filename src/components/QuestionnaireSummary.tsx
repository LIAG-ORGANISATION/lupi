import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface QuestionnaireSummaryProps {
  data: any;
}

export const QuestionnaireSummary = ({ data }: QuestionnaireSummaryProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: "identity",
      title: "Identité",
      fields: [
        { label: "Date de naissance", value: data.birthDate },
        { label: "Sexe", value: data.sex === 'male' ? 'Mâle' : data.sex === 'female' ? 'Femelle' : data.sex },
        { label: "Stérilisé", value: data.neutered },
        { label: "Poids", value: data.weight ? `${data.weight} kg` : null },
        { label: "Handicap", value: data.disability },
      ]
    },
    {
      id: "history",
      title: "Historique",
      fields: [
        { label: "Foyers précédents", value: data.previousHomes },
        { label: "Nombre de transitions", value: data.transitionsCount },
        { label: "Âge de séparation", value: data.separationAge },
        { label: "Socialisation", value: data.socialization },
        { label: "Traumatisme", value: data.trauma },
        { label: "Description traumatisme", value: data.traumaDescription },
      ]
    },
    {
      id: "health",
      title: "Santé",
      fields: [
        { label: "Historique médical", value: data.medicalHistory },
        { label: "Traitements actuels", value: data.currentTreatments },
        { label: "Vaccinations", value: data.vaccinations },
        { label: "Vermifuges", value: data.deworming },
        { label: "Allergies", value: data.allergies },
      ]
    },
    {
      id: "nutrition",
      title: "Alimentation",
      fields: [
        { label: "Type d'alimentation", value: data.foodType },
        { label: "Compléments", value: Array.isArray(data.supplements) ? data.supplements.join(', ') : null },
        { label: "Symptômes digestifs", value: Array.isArray(data.digestiveSymptoms) ? data.digestiveSymptoms.join(', ') : null },
        { label: "Allergies alimentaires", value: data.foodAllergies },
      ]
    },
    {
      id: "behavior",
      title: "Comportements",
      fields: [
        { label: "Réactions aux bruits", value: Array.isArray(data.noiseReactions) ? data.noiseReactions.join(', ') : null },
        { label: "Réaction aux inconnus", value: data.strangerReaction },
        { label: "Réaction aux chiens", value: data.dogReaction },
        { label: "Réaction en voiture", value: data.carReaction },
        { label: "Réaction chez le vétérinaire", value: data.vetReaction },
        { label: "Comportements compulsifs", value: Array.isArray(data.compulsiveBehaviors) ? data.compulsiveBehaviors.join(', ') : null },
        { label: "Niveau d'énergie", value: data.energyLevel },
      ]
    },
    {
      id: "environment",
      title: "Environnement",
      fields: [
        { label: "Type d'habitat", value: data.habitatType },
        { label: "Composition du foyer", value: Array.isArray(data.householdComposition) ? data.householdComposition.join(', ') : null },
        { label: "Temps seul", value: data.aloneTime },
        { label: "Rythme du foyer", value: data.householdRhythm },
      ]
    },
    {
      id: "activity",
      title: "Activité",
      fields: [
        { label: "Durée des balades", value: data.walkDuration },
        { label: "Activités régulières", value: Array.isArray(data.regularActivities) ? data.regularActivities.join(', ') : null },
        { label: "Fréquence d'activité", value: data.activityFrequency },
        { label: "Signes d'ennui", value: Array.isArray(data.boredomSigns) ? data.boredomSigns.join(', ') : null },
      ]
    },
    {
      id: "training",
      title: "Éducation",
      fields: [
        { label: "Méthodes d'éducation", value: Array.isArray(data.trainingMethods) ? data.trainingMethods.join(', ') : null },
        { label: "Commandes connues", value: Array.isArray(data.knownCommands) ? data.knownCommands.join(', ') : null },
        { label: "Comportements problématiques", value: Array.isArray(data.problematicBehaviors) ? data.problematicBehaviors.join(', ') : null },
      ]
    },
    {
      id: "relationship",
      title: "Relation",
      fields: [
        { label: "Difficultés relationnelles", value: data.relationshipDifficulties },
        { label: "Accompagnement professionnel souhaité", value: data.professionalSupport },
        { label: "État émotionnel", value: data.emotionalState },
      ]
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-title">Synthèse du questionnaire</h3>
      <div className="space-y-2">
        {sections.map(section => {
          const hasContent = section.fields.some(field => field.value && field.value !== '');
          if (!hasContent) return null;

          const isExpanded = expandedSections.includes(section.id);

          return (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <h4 className="font-semibold text-title text-left">{section.title}</h4>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {section.fields.map((field, index) => {
                    if (!field.value || field.value === '') return null;
                    
                    return (
                      <div key={index} className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                        <p className="text-sm text-foreground">{field.value}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
