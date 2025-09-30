import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, TestTube2, FileText, Calendar, Stethoscope, Heart, Share2 } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { BottomNavigation } from "@/components/BottomNavigation";

interface Dog {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
  owner_id: string;
}

const DogsOrPatients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading: roleLoading } = useUserRole();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading) {
      loadDogs();
    }
  }, [role, roleLoading]);

  const loadDogs = async () => {
    try {
      if (role === "owner") {
        // Load owner's dogs
        const { data, error } = await supabase
          .from("dogs" as any)
          .select("*")
          .order("name");

        if (error) throw error;
        setDogs((data as any) || []);
      } else if (role === "professional") {
        // Load shared dogs (patients) - query dogs directly with join logic
        const { data: sharesData, error: sharesError } = await supabase
          .from("dog_shares" as any)
          .select("dog_id")
          .eq("professional_id", (await supabase.auth.getUser()).data.user?.id)
          .eq("status", "accepted");

        if (sharesError) throw sharesError;

        if (sharesData && sharesData.length > 0) {
          const dogIds = sharesData.map((s: any) => s.dog_id);
          const { data: dogsData, error: dogsError } = await supabase
            .from("dogs" as any)
            .select("*")
            .in("id", dogIds)
            .order("name");

          if (dogsError) throw dogsError;
          setDogs((dogsData as any) || []);
        } else {
          setDogs([]);
        }
      }
    } catch (error) {
      console.error("Error loading dogs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-24">
        <p className="text-muted-foreground">Chargement...</p>
        <BottomNavigation />
      </div>
    );
  }

  const pageTitle = role === "professional" ? "Mes patients" : "Mes chiens";
  const emptyMessage = role === "professional" 
    ? "Aucun patient partagé avec vous pour le moment"
    : "Créez un profil pour votre compagnon";
  const emptySubtitle = role === "professional"
    ? "Les propriétaires pourront vous donner accès à leurs chiens"
    : "Suivez sa santé et son comportement";

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-title">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {role === "professional" ? "Chiens dont vous avez la charge" : "Gérez les profils de vos compagnons"}
        </p>
      </div>

      {role === "owner" && (
        <Card className="bg-secondary p-6 rounded-3xl space-y-4 shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-title">{emptyMessage}</h2>
            <p className="text-sm text-foreground/70 mt-1">{emptySubtitle}</p>
          </div>
          <Button
            onClick={() => navigate("/dogs/add")}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un chien
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {dogs.length === 0 ? (
          <Card className="p-8 rounded-3xl text-center shadow-md">
            <p className="text-muted-foreground">{emptyMessage}</p>
            {role === "professional" && (
              <p className="text-sm text-muted-foreground mt-2">{emptySubtitle}</p>
            )}
          </Card>
        ) : (
          dogs.map((dog) => (
            <Card
              key={dog.id}
              className="p-4 rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/dogs/${dog.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl overflow-hidden">
                  {dog.avatar_url ? (
                    <img
                      src={dog.avatar_url}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "🐕"
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg">{dog.name}</h3>
                  {dog.breed && (
                    <p className="text-sm text-muted-foreground">{dog.breed}</p>
                  )}
                </div>
                {role === "owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Open share modal
                      toast({
                        title: "Partage",
                        description: "Fonctionnalité de partage à venir",
                      });
                    }}
                    className="rounded-full"
                  >
                    <Share2 className="h-5 w-5 text-primary" />
                  </Button>
                )}
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
            onClick={() => dogs.length > 0 && navigate(`/dogs/${dogs[0].id}`)}
          />
          <QuickActionCard
            icon={FileText}
            label="Rapports"
            onClick={() => dogs.length > 0 && navigate(`/dogs/${dogs[0].id}`)}
          />
          <QuickActionCard
            icon={Stethoscope}
            label="RDV"
            onClick={() => navigate("/professionals")}
          />
          <QuickActionCard
            icon={Calendar}
            label="Calendrier"
            onClick={() => dogs.length > 0 && navigate(`/dogs/${dogs[0].id}`)}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DogsOrPatients;
