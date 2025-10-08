import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeTutorialProps {
  onComplete: () => void;
}

const WelcomeTutorial = ({ onComplete }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: Plus,
      title: "Bienvenue sur LupiApp",
      description: "Créez le profil de votre chien pour commencer à suivre sa santé et son bien-être.",
      primaryAction: "Ajouter un chien",
      primaryLink: "/dogs/add",
      secondaryAction: "Continuer le tuto"
    },
    {
      icon: Users,
      title: "Connectez-vous avec des professionnels",
      description: "Partagez le profil de votre chien avec des vétérinaires et éducateurs canins.",
      primaryAction: "Trouver des pros",
      primaryLink: "/professionals",
      secondaryAction: "Continuer le tuto"
    },
    {
      icon: FileText,
      title: "Centralisez vos documents",
      description: "Stockez vaccins, ordonnances et documents médicaux au même endroit.",
      primaryAction: "Voir mes documents",
      primaryLink: "/guardian/documents",
      secondaryAction: "Ajouter un chien"
    }
  ];

  const handlePrimaryAction = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.primaryLink) {
      onComplete();
      navigate(currentStepData.primaryLink);
    }
  };

  const handleSecondaryAction = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape : "Ajouter un chien"
      onComplete();
      navigate("/dogs/add");
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md p-8 rounded-xl">
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-card flex items-center justify-center">
            <IconComponent className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-title">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={handlePrimaryAction}
              className="w-full rounded-full"
              size="lg"
            >
              {currentStepData.primaryAction}
            </Button>
            
            <Button 
              onClick={handleSecondaryAction}
              variant="outline"
              className="w-full rounded-full"
            >
              {currentStepData.secondaryAction}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeTutorial;