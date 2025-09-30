import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, TestTube2, FileText, Calendar, Stethoscope, Heart, Dog as DogIcon } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Dog {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
}

const Dogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Dogs] 🔍 Checking user...', user);
    if (user) {
      fetchDogs();
    } else {
      console.log('[Dogs] ⚠️ No user, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  const fetchDogs = async () => {
    console.log('[Dogs] 📡 Fetching dogs for user:', user?.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, avatar_url')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      console.log('[Dogs] Response:', { data, error });

      if (error) throw error;
      console.log('[Dogs] ✅ Dogs loaded:', data?.length || 0);
      setDogs(data || []);
    } catch (error) {
      console.error('[Dogs] ❌ Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-title">Bienvenue</h1>
        <p className="text-muted-foreground">Gérez les profils de vos compagnons</p>
      </div>

      <Card className="bg-secondary p-6 rounded-3xl space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-title">
            Créez un profil pour votre compagnon
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            Suivez sa santé et son comportement
          </p>
        </div>
        <Button
          onClick={() => navigate("/dogs/add")}
          className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un chien
        </Button>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-title">Mes chiens</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('[Dogs] 🔄 Manual refresh');
              fetchDogs();
            }}
            className="text-xs"
          >
            Actualiser
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : dogs.length === 0 ? (
          <Card className="p-6 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucun chien ajouté pour le moment</p>
          </Card>
        ) : (
          dogs.map((dog) => (
            <Card
              key={dog.id}
              className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/dogs/${dog.id}`)}
            >
              <div className="flex items-center gap-4">
                {dog.avatar_url ? (
                  <img
                    src={dog.avatar_url}
                    alt={dog.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <DogIcon className="h-8 w-8 text-primary" />
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
          ))
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-title mb-4">Accès rapide</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard
            icon={TestTube2}
            label="Tests"
            onClick={() => navigate("/questionnaire")}
          />
          <QuickActionCard
            icon={Heart}
            label="Santé"
            onClick={() => navigate("/dogs/1")}
          />
          <QuickActionCard
            icon={FileText}
            label="Rapports"
            onClick={() => navigate("/dogs/1")}
          />
          <QuickActionCard
            icon={Stethoscope}
            label="RDV"
            onClick={() => navigate("/professionals")}
          />
          <QuickActionCard
            icon={Calendar}
            label="Calendrier"
            onClick={() => navigate("/dogs/1")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dogs;
