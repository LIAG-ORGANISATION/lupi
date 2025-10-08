import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, FileText, Dog as DogIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import messagesIcon from "@/assets/messages-icon.jpg";
import documentsIcon from "@/assets/documents-icon.jpg";
import professionalsIcon from "@/assets/professionals-icon.jpg";

interface DogData {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
}

const GuardianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dogs, setDogs] = useState<DogData[]>([]);
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
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
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

          <div className="grid grid-cols-3 gap-3">
            <Card
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/guardian/messages")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={messagesIcon} 
                    alt="Messages" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Messages</h3>
                  <p className="text-xs text-muted-foreground">Avec les pros</p>
                </div>
              </div>
            </Card>

            <Card
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/guardian/documents")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={documentsIcon} 
                    alt="Documents" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Documents</h3>
                  <p className="text-xs text-muted-foreground">Partagés</p>
                </div>
              </div>
            </Card>

            <Card
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/professionals")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={professionalsIcon} 
                    alt="Professionnels" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Professionnels</h3>
                  <p className="text-xs text-muted-foreground">Trouver</p>
                </div>
              </div>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : dogs.length === 0 ? (
            <Card className="lupi-card text-center">
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
                  className="lupi-card cursor-pointer"
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
