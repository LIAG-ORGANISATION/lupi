import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  const [formData, setFormData] = useState({
    // Step 1
    idNumber: "",
    birthDate: "",
    sex: "",
    neutered: "",
    weight: "",
    disability: "",
    // Step 2
    previousHomes: "",
    transitionsCount: "",
    separationAge: "",
    socialization: "",
    trauma: "",
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
              Identité & statut du chien
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
              <Label htmlFor="birthDate">Date de naissance</Label>
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
              <Input
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
              Historique de vie & socialisation
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
              <Label htmlFor="separationAge">Âge de séparation d'avec la mère (en semaines)</Label>
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
                    className="flex-1 rounded-full"
                    onClick={() => setFormData({ ...formData, socialization: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trauma">Expériences traumatiques connues ?</Label>
              <Input
                id="trauma"
                placeholder="Décrivez si applicable"
                value={formData.trauma}
                onChange={(e) => setFormData({ ...formData, trauma: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">
              Étape {step} sur {totalSteps}
            </h2>
            <p className="text-muted-foreground">
              Cette section du questionnaire sera complétée dans une prochaine itération.
            </p>
          </div>
        );
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
        <h1 className="text-2xl font-bold text-title">Questionnaire</h1>
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
