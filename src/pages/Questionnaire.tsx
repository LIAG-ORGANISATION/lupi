import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  const [formData, setFormData] = useState<any>({
    // Step 1 - Identité
    idNumber: "",
    birthDate: "",
    sex: "",
    neutered: "",
    weight: "",
    disability: "",
    // Step 2 - Historique
    previousHomes: "",
    transitionsCount: "",
    separationAge: "",
    socialization: "",
    trauma: "",
    traumaDescription: "",
    // Step 3 - Santé
    medicalHistory: "",
    currentTreatments: "",
    vaccinations: "",
    deworming: "",
    allergies: "",
    // Step 4 - Alimentation
    foodType: "",
    supplements: [] as string[],
    digestiveSymptoms: [] as string[],
    foodAllergies: "",
    // Step 5 - Comportements
    noiseReactions: [] as string[],
    strangerReaction: "",
    dogReaction: "",
    carReaction: "",
    vetReaction: "",
    compulsiveBehaviors: [] as string[],
    energyLevel: "",
    // Step 6 - Environnement
    habitatType: "",
    householdComposition: [] as string[],
    aloneTime: "",
    householdRhythm: "",
    // Step 7 - Activité
    walkDuration: "",
    regularActivities: [] as string[],
    activityFrequency: "",
    boredomSigns: [] as string[],
    // Step 8 - Éducation
    acquiredSkills: [] as string[],
    educationMethods: [] as string[],
    attentionDifficulties: "",
    newSkills: "",
    // Step 9 - Objectifs
    relationshipDifficulties: "",
    professionalSupport: "",
    emotionalState: "",
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast({
        title: "Questionnaire complété !",
        description: "Vos réponses ont été enregistrées.",
      });
      navigate("/dogs");
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 1 - Identité & statut du chien
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">Numéro d'identification</Label>
              <Input
                id="idNumber"
                placeholder="Ex: 250268500123456"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance ou âge</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Sexe</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.sex === "male" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, sex: "male" })}
                >
                  Mâle
                </Button>
                <Button
                  type="button"
                  variant={formData.sex === "female" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, sex: "female" })}
                >
                  Femelle
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stérilisé ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.neutered === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, neutered: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.neutered === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, neutered: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids actuel (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 30"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disability">Handicap connu ?</Label>
              <Textarea
                id="disability"
                placeholder="Décrivez si applicable"
                value={formData.disability}
                onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 2 - Historique de vie & socialisation
            </h2>
            
            <div className="space-y-2">
              <Label>Le chien a-t-il déjà vécu dans d'autres foyers ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.previousHomes === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, previousHomes: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.previousHomes === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, previousHomes: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            {formData.previousHomes === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="transitionsCount">Nombre de transitions de foyer</Label>
                <Input
                  id="transitionsCount"
                  type="number"
                  placeholder="Ex: 2"
                  value={formData.transitionsCount}
                  onChange={(e) => setFormData({ ...formData, transitionsCount: e.target.value })}
                  className="rounded-2xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="separationAge">Âge de séparation d'avec la mère/lignée (en semaines)</Label>
              <Input
                id="separationAge"
                type="number"
                placeholder="Ex: 8"
                value={formData.separationAge}
                onChange={(e) => setFormData({ ...formData, separationAge: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Socialisation avant 16 semaines</Label>
              <div className="flex gap-2">
                {["Faible", "Moyenne", "Riche"].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.socialization === level ? "default" : "outline"}
                    className="flex-1 rounded-full text-xs"
                    onClick={() => setFormData({ ...formData, socialization: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expériences traumatiques connues ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.trauma === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, trauma: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.trauma === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, trauma: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            {formData.trauma === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="traumaDescription">Description</Label>
                <Textarea
                  id="traumaDescription"
                  placeholder="Décrivez l'expérience traumatique"
                  value={formData.traumaDescription}
                  onChange={(e) => setFormData({ ...formData, traumaDescription: e.target.value })}
                  className="rounded-2xl"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 3 - Santé & traitements
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Décrivez les antécédents médicaux"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentTreatments">Traitements actuels</Label>
              <Textarea
                id="currentTreatments"
                placeholder="Listez les traitements en cours"
                value={formData.currentTreatments}
                onChange={(e) => setFormData({ ...formData, currentTreatments: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Vaccinations</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.vaccinations === "uptodate" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, vaccinations: "uptodate" })}
                >
                  À jour
                </Button>
                <Button
                  type="button"
                  variant={formData.vaccinations === "notuptodate" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, vaccinations: "notuptodate" })}
                >
                  Non à jour
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vermifuge</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.deworming === "uptodate" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, deworming: "uptodate" })}
                >
                  À jour
                </Button>
                <Button
                  type="button"
                  variant={formData.deworming === "notuptodate" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, deworming: "notuptodate" })}
                >
                  Non à jour
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies connues</Label>
              <Textarea
                id="allergies"
                placeholder="Listez les allergies connues"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 4 - Alimentation & digestion
            </h2>
            
            <div className="space-y-2">
              <Label>Type d'alimentation</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Croquettes", "Pâtée", "Maison", "BARF", "Mixte"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.foodType === type ? "default" : "outline"}
                    className="rounded-full text-sm"
                    onClick={() => setFormData({ ...formData, foodType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Suppléments (sélection multiple)</Label>
              <div className="space-y-2">
                {["Aucun", "Probiotiques", "Enzymes digestives", "Fibres", "Autres"].map((supp) => (
                  <div key={supp} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.supplements.includes(supp)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, supplements: [...formData.supplements, supp] });
                        } else {
                          setFormData({ ...formData, supplements: formData.supplements.filter((s: string) => s !== supp) });
                        }
                      }}
                    />
                    <label className="text-sm">{supp}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Symptômes digestifs (sélection multiple)</Label>
              <div className="space-y-2">
                {["Vomissements", "Diarrhées", "Constipation", "Gaz", "Autres", "Aucun"].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.digestiveSymptoms.includes(symptom)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, digestiveSymptoms: [...formData.digestiveSymptoms, symptom] });
                        } else {
                          setFormData({ ...formData, digestiveSymptoms: formData.digestiveSymptoms.filter((s: string) => s !== symptom) });
                        }
                      }}
                    />
                    <label className="text-sm">{symptom}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodAllergies">Allergies alimentaires connues</Label>
              <Textarea
                id="foodAllergies"
                placeholder="Listez les allergies alimentaires"
                value={formData.foodAllergies}
                onChange={(e) => setFormData({ ...formData, foodAllergies: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 5 - Comportements observés
            </h2>
            
            <div className="space-y-2">
              <Label>Réactions face aux bruits (sélection multiple)</Label>
              <div className="space-y-2">
                {["Feux d'artifice", "Orages", "Aspirateur", "Sirènes", "Autres bruits forts"].map((noise) => (
                  <div key={noise} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.noiseReactions.includes(noise)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, noiseReactions: [...formData.noiseReactions, noise] });
                        } else {
                          setFormData({ ...formData, noiseReactions: formData.noiseReactions.filter((n: string) => n !== noise) });
                        }
                      }}
                    />
                    <label className="text-sm">{noise}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Réactions face aux étrangers</Label>
              <div className="flex flex-col gap-2">
                {["Amical", "Neutre", "Méfiant", "Agressif"].map((reaction) => (
                  <Button
                    key={reaction}
                    type="button"
                    variant={formData.strangerReaction === reaction ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setFormData({ ...formData, strangerReaction: reaction })}
                  >
                    {reaction}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Réactions face aux autres chiens</Label>
              <div className="flex flex-col gap-2">
                {["Sociable", "Neutre", "Craintif", "Agressif"].map((reaction) => (
                  <Button
                    key={reaction}
                    type="button"
                    variant={formData.dogReaction === reaction ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setFormData({ ...formData, dogReaction: reaction })}
                  >
                    {reaction}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Comportements compulsifs (sélection multiple)</Label>
              <div className="space-y-2">
                {["Léchage excessif", "Poursuite de queue", "Chasse aux ombres", "Autres", "Aucun"].map((behavior) => (
                  <div key={behavior} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.compulsiveBehaviors.includes(behavior)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, compulsiveBehaviors: [...formData.compulsiveBehaviors, behavior] });
                        } else {
                          setFormData({ ...formData, compulsiveBehaviors: formData.compulsiveBehaviors.filter((b: string) => b !== behavior) });
                        }
                      }}
                    />
                    <label className="text-sm">{behavior}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Niveau d'énergie</Label>
              <div className="flex gap-2">
                {["Faible", "Moyen", "Élevé"].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.energyLevel === level ? "default" : "outline"}
                    className="flex-1 rounded-full"
                    onClick={() => setFormData({ ...formData, energyLevel: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 6 - Environnement & routine
            </h2>
            
            <div className="space-y-2">
              <Label>Type d'habitat</Label>
              <div className="flex gap-2">
                {["Appartement", "Maison", "Ferme"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.habitatType === type ? "default" : "outline"}
                    className="flex-1 rounded-full"
                    onClick={() => setFormData({ ...formData, habitatType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Composition du foyer (sélection multiple)</Label>
              <div className="space-y-2">
                {["Seul", "Avec enfants", "Avec autres animaux", "Mixte"].map((comp) => (
                  <div key={comp} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.householdComposition.includes(comp)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, householdComposition: [...formData.householdComposition, comp] });
                        } else {
                          setFormData({ ...formData, householdComposition: formData.householdComposition.filter((h: string) => h !== comp) });
                        }
                      }}
                    />
                    <label className="text-sm">{comp}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aloneTime">Temps moyen seul par jour (heures)</Label>
              <Input
                id="aloneTime"
                type="number"
                placeholder="Ex: 4"
                value={formData.aloneTime}
                onChange={(e) => setFormData({ ...formData, aloneTime: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Rythme du foyer</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.householdRhythm === "calm" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, householdRhythm: "calm" })}
                >
                  Calme
                </Button>
                <Button
                  type="button"
                  variant={formData.householdRhythm === "active" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, householdRhythm: "active" })}
                >
                  Actif
                </Button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 7 - Activité physique & mentale
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="walkDuration">Durée moyenne des promenades (minutes)</Label>
              <Input
                id="walkDuration"
                type="number"
                placeholder="Ex: 60"
                value={formData.walkDuration}
                onChange={(e) => setFormData({ ...formData, walkDuration: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Activités régulières (sélection multiple)</Label>
              <div className="space-y-2">
                {["Jeu libre", "Randonnées", "Sports canins", "Autres"].map((activity) => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.regularActivities.includes(activity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, regularActivities: [...formData.regularActivities, activity] });
                        } else {
                          setFormData({ ...formData, regularActivities: formData.regularActivities.filter((a: string) => a !== activity) });
                        }
                      }}
                    />
                    <label className="text-sm">{activity}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fréquence des activités</Label>
              <div className="flex gap-2">
                {["Quotidienne", "Hebdomadaire", "Occasionnelle"].map((freq) => (
                  <Button
                    key={freq}
                    type="button"
                    variant={formData.activityFrequency === freq ? "default" : "outline"}
                    className="flex-1 rounded-full text-xs"
                    onClick={() => setFormData({ ...formData, activityFrequency: freq })}
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Signes d'ennui (sélection multiple)</Label>
              <div className="space-y-2">
                {["Aboiements", "Destructions", "Agitation", "Autres", "Aucun"].map((sign) => (
                  <div key={sign} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.boredomSigns.includes(sign)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, boredomSigns: [...formData.boredomSigns, sign] });
                        } else {
                          setFormData({ ...formData, boredomSigns: formData.boredomSigns.filter((s: string) => s !== sign) });
                        }
                      }}
                    />
                    <label className="text-sm">{sign}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 8 - Éducation & apprentissages
            </h2>
            
            <div className="space-y-2">
              <Label>Compétences acquises (sélection multiple)</Label>
              <div className="space-y-2">
                {["Assis", "Couché", "Rappel", "Marche en laisse", "Pas bouger"].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.acquiredSkills.includes(skill)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, acquiredSkills: [...formData.acquiredSkills, skill] });
                        } else {
                          setFormData({ ...formData, acquiredSkills: formData.acquiredSkills.filter((s: string) => s !== skill) });
                        }
                      }}
                    />
                    <label className="text-sm">{skill}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Méthodes d'éducation (sélection multiple)</Label>
              <div className="space-y-2">
                {["Club canin", "À la maison", "Cours particuliers", "Aucune"].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.educationMethods.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, educationMethods: [...formData.educationMethods, method] });
                        } else {
                          setFormData({ ...formData, educationMethods: formData.educationMethods.filter((m: string) => m !== method) });
                        }
                      }}
                    />
                    <label className="text-sm">{method}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Difficultés d'attention ou de concentration ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.attentionDifficulties === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, attentionDifficulties: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.attentionDifficulties === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, attentionDifficulties: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newSkills">Nouvelles compétences à enseigner</Label>
              <Textarea
                id="newSkills"
                placeholder="Listez les compétences que vous souhaitez enseigner"
                value={formData.newSkills}
                onChange={(e) => setFormData({ ...formData, newSkills: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape 9 - Objectifs du binôme
            </h2>
            
            <div className="space-y-2">
              <Label>Rencontrez-vous des difficultés dans la relation avec votre chien ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.relationshipDifficulties === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, relationshipDifficulties: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.relationshipDifficulties === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, relationshipDifficulties: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Souhaitez-vous un accompagnement professionnel ?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.professionalSupport === "yes" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, professionalSupport: "yes" })}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={formData.professionalSupport === "no" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setFormData({ ...formData, professionalSupport: "no" })}
                >
                  Non
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>État émotionnel vis-à-vis de la relation</Label>
              <div className="flex flex-col gap-2">
                {["Ouvert aux idées", "Débordé", "Besoin de soutien"].map((state) => (
                  <Button
                    key={state}
                    type="button"
                    variant={formData.emotionalState === state ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setFormData({ ...formData, emotionalState: state })}
                  >
                    {state}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dogs")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Questionnaire comportemental</h1>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Étape {step} sur {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2" />
      </div>

      <Card className="p-6 rounded-3xl">
        {renderStep()}
      </Card>

      <div className="flex gap-4">
        {step > 1 && (
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex-1 rounded-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
        >
          {step === totalSteps ? "Terminer" : "Suivant"}
          {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default Questionnaire;
