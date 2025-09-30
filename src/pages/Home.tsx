import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TestTube2, ClipboardList, Stethoscope, Lightbulb, LogIn, Plus, Dog as DogIcon } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import heroImage from "@/assets/hero-dog-dna.jpg";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Dog {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
}

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isProfessional, isGuardian, user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(false);

  useEffect(() => {
    if (isGuardian && user) {
      fetchDogs();
    }
  }, [isGuardian, user]);

  const fetchDogs = async () => {
    setLoadingDogs(true);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, avatar_url')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setDogs(data || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoadingDogs(false);
    }
  };
  return <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <Card className="bg-secondary p-6 rounded-3xl shadow-lg overflow-hidden relative">
        <div className="relative z-10 space-y-4">
          <h1 className="text-2xl font-bold text-title">
            Découvrez l'ADN de votre chien
          </h1>
          <p className="text-sm text-foreground/80">
            Analyse complète des races, prédispositions santé et profil comportemental
          </p>
          
          <div className="space-y-2">
            {!isAuthenticated ? <>
                <Button onClick={() => navigate("/choose-account-type")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter / S'inscrire
                </Button>
              </> : <>
                {isGuardian && <>
                    <Button onClick={() => navigate("/dogs/add")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter un chien
                    </Button>
                    <Button onClick={() => navigate("/guardian/dashboard")} variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/10" size="lg">
                      Mon tableau de bord
                    </Button>
                  </>}
                {isProfessional && <Button onClick={() => navigate("/professional/dashboard")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
                    Mon tableau de bord Pro
                  </Button>}
              </>}
          </div>
        </div>
      </Card>

      {isGuardian && dogs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-title">Mes compagnons</h2>
          <div className="space-y-3">
            {dogs.map((dog) => (
              <Card
                key={dog.id}
                className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all"
                onClick={() => navigate(`/dogs/${dog.id}`)}
              >
                <div className="flex items-center gap-4">
                  {dog.avatar_url ? (
                    <img
                      src={dog.avatar_url}
                      alt={dog.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <DogIcon className="h-7 w-7 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-title">{dog.name}</h3>
                    {dog.breed && (
                      <p className="text-sm text-muted-foreground">{dog.breed}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-title mb-4">Accès rapide</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionCard icon={TestTube2} label="Tests ADN" onClick={() => navigate("/dogs")} />
          <QuickActionCard icon={ClipboardList} label="Questionnaire" onClick={() => navigate("/questionnaire")} />
          <QuickActionCard icon={Stethoscope} label="Pros & RDV" onClick={() => navigate("/professionals")} />
          <QuickActionCard icon={Lightbulb} label="Recommandations" onClick={() => navigate("/recommendations")} />
        </div>
      </div>
    </div>;
};
export default Home;