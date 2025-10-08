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
      action: "Commencer"
    },
    {
      icon: Users,
      title: "Connectez-vous avec des professionnels",
      description: "Partagez le profil de votre chien avec des vétérinaires et éducateurs canins.",
      action: "Suivant"
    },
    {
      icon: FileText,
      title: "Centralisez vos documents",
      description: "Stockez vaccins, ordonnances et documents médicaux au même endroit.",
      action: "Terminer"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
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
              onClick={handleNext}
              className="w-full rounded-full"
              size="lg"
            >
              {currentStepData.action}
            </Button>
            
            {currentStep === 0 && (
              <Button 
                onClick={handleSkip}
                variant="ghost"
                className="w-full rounded-full"
              >
                Passer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeTutorial;