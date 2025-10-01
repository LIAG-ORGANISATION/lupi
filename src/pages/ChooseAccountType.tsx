import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import guardianImage from "@/assets/guardian-woman-dog.jpg";
import professionalImage from "@/assets/professional-vet.jpg";

const ChooseAccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-title">Bienvenue sur Lupi</h1>
          <p className="text-foreground">Choisissez votre type de compte</p>
        </div>

        <div className="space-y-4">
          <Card 
            className="p-6 rounded-2xl cursor-pointer hover:border-primary transition-all overflow-hidden"
            onClick={() => navigate('/auth?type=guardian')}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={guardianImage} 
                  alt="Gardien avec son chien" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-title text-lg">Gardien</h3>
                <p className="text-sm text-muted-foreground">
                  Je veux suivre la santé de mes chiens ainsi que leurs données génétiques et comportementales
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 rounded-2xl cursor-pointer hover:border-primary transition-all overflow-hidden"
            onClick={() => navigate('/professional/auth')}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={professionalImage} 
                  alt="Vétérinaire professionnel" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-title text-lg">Professionnel</h3>
                <p className="text-sm text-muted-foreground">
                  Je suis vétérinaire, éducateur ou autre professionnel canin
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseAccountType;
