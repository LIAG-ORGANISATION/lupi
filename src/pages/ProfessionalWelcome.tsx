import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ProfessionalWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <Card className="p-8 rounded-3xl text-center space-y-6 bg-gradient-to-br from-[#E8A87C] to-[#C27B52]">
          <div className="w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-[#D4916D] flex items-end justify-center p-8">
            <div className="w-full h-3/4 bg-white/20 rounded-t-full flex items-end justify-center pb-8">
              <div className="text-6xl">🐕</div>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-title">Welcome to Lupi Pro</h1>
          <p className="text-foreground">
            Connect with guardians and professionals who share your passion for animal care.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/professional/ethical-charter")}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            Read the Ethical Charter
          </Button>
          
          <Button
            onClick={() => navigate("/professional/edit-profile")}
            variant="outline"
            className="w-full rounded-full"
            size="lg"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWelcome;
