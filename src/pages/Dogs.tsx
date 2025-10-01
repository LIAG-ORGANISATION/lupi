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
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header avec gradient */}
      <div className="bg-gradient-lupi p-6 rounded-b-[3rem] shadow-xl mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white text-center">
            Mes chiens 🐕
          </h1>
          <p className="text-white/90 text-center text-sm mt-2">Gérez les profils de vos compagnons</p>
        </div>
      </div>

      <div className="px-4 space-y-6 max-w-4xl mx-auto">

        {!loading && dogs.length === 0 && (
          <div className="lupi-card text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-card flex items-center justify-center">
              <DogIcon className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-title mb-2">
                Bienvenue sur LupiApp ! 🐾
              </h2>
              <p className="text-muted-foreground mb-6">
                Créez un profil pour votre compagnon et suivez sa santé
              </p>
              <button
                onClick={() => navigate("/dogs/add")}
                className="btn-lupi"
              >
                <Plus className="h-5 w-5 mr-2 inline" />
                Ajouter mon premier chien
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-title">Mes compagnons</h2>
            {dogs.length > 0 && (
              <button
                onClick={() => navigate("/dogs/add")}
                className="text-primary font-semibold text-sm hover:underline"
              >
                + Ajouter
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : dogs.length === 0 ? null : (
            <div className="grid gap-4">
              {dogs.map((dog) => (
                <div
                  key={dog.id}
                  className="lupi-card cursor-pointer group"
                  onClick={() => navigate(`/dogs/${dog.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {dog.avatar_url ? (
                      <img
                        src={dog.avatar_url}
                        alt={dog.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-all"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-card flex items-center justify-center border-2 border-primary/20 group-hover:border-primary transition-all">
                        <DogIcon className="h-10 w-10 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-title">{dog.name}</h3>
                      {dog.breed && (
                        <p className="text-sm text-muted-foreground">{dog.breed}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {dogs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-title mb-4">Accès rapide</h2>
            <div className="grid grid-cols-3 gap-3">
              {dogs.length === 1 ? (
                <>
                  <QuickActionCard
                    icon={TestTube2}
                    label="Tests"
                    onClick={() => navigate(`/dogs/${dogs[0].id}`)}
                  />
                  <QuickActionCard
                    icon={Heart}
                    label="Santé"
                    onClick={() => navigate(`/dogs/${dogs[0].id}`)}
                  />
                  <QuickActionCard
                    icon={FileText}
                    label="Rapports"
                    onClick={() => navigate(`/dogs/${dogs[0].id}`)}
                  />
                  <QuickActionCard
                    icon={Stethoscope}
                    label="RDV"
                    onClick={() => navigate("/professionals")}
                  />
                  <QuickActionCard
                    icon={Calendar}
                    label="Calendrier"
                    onClick={() => navigate(`/dogs/${dogs[0].id}`)}
                  />
                </>
              ) : (
                <QuickActionCard
                  icon={Calendar}
                  label="RDV"
                  onClick={() => navigate("/professionals")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dogs;
