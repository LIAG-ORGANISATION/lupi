import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import guardianImage from "@/assets/guardian-woman-dog.jpg";
import professionalImage from "@/assets/professional-vet.jpg";

const ChooseAccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header N26 Simple */}
      <div className="bg-gradient-n26 p-6 pb-8 mb-4">
        <div className="max-w-md mx-auto text-center" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'hsl(240 6% 11%)' }}>Bienvenue sur Lupi</h1>
          <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Choisissez votre type de compte pour commencer</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-8 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div 
          className="lupi-card cursor-pointer hover:shadow-xl transition-all p-6"
          onClick={() => navigate('/auth?type=guardian')}
        >
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
              <img 
                src={guardianImage} 
                alt="Gardien avec son chien" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-title text-xl mb-1">Gardien</h3>
              <p className="text-sm text-muted-foreground">
                Je veux suivre la santé de mes chiens ainsi que leurs données génétiques et comportementales
              </p>
            </div>
          </div>
        </div>

        <div 
          className="lupi-card cursor-pointer hover:shadow-xl transition-all p-6"
          onClick={() => navigate('/professional/auth')}
        >
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
              <img 
                src={professionalImage} 
                alt="Vétérinaire professionnel" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-title text-xl mb-1">Professionnel</h3>
              <p className="text-sm text-muted-foreground">
                Je suis vétérinaire, éducateur ou autre professionnel canin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseAccountType;
