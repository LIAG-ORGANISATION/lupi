import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, FileText, Dog as DogIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dog } from "@/types/database";
import AuthGuard from "@/components/AuthGuard";

const GuardianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDogs();
    }
  }, [user]);

  const fetchDogs = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDogs(data || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requiredRole="guardian">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-title">Mes Chiens</h1>
            <Button
              onClick={() => navigate("/dogs/add")}
              className="rounded-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-4 rounded-3xl cursor-pointer hover:border-primary transition-all"
              onClick={() => navigate("/guardian/messages")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-title">Messages</h3>
                  <p className="text-sm text-muted-foreground">Avec les pros</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 rounded-3xl cursor-pointer hover:border-primary transition-all"
              onClick={() => navigate("/guardian/documents")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-title">Documents</h3>
                  <p className="text-sm text-muted-foreground">Partagés</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 rounded-3xl cursor-pointer hover:border-primary transition-all"
              onClick={() => navigate("/professionals")}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <DogIcon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-title">Professionnels</h3>
                  <p className="text-sm text-muted-foreground">Trouver</p>
                </div>
              </div>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : dogs.length === 0 ? (
            <Card className="p-8 rounded-3xl text-center">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore ajouté de chien</p>
              <Button onClick={() => navigate("/dogs/add")} className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter mon premier chien
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dogs.map((dog) => (
                <Card
                  key={dog.id}
                  className="p-6 rounded-3xl cursor-pointer hover:border-primary transition-all"
                  onClick={() => navigate(`/dogs/${dog.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {dog.photo_url ? (
                      <img
                        src={dog.photo_url}
                        alt={dog.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <DogIcon className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-title">{dog.name}</h3>
                      {dog.breed && (
                        <p className="text-sm text-muted-foreground">{dog.breed}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default GuardianDashboard;
