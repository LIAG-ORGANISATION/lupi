import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, FileText, Dog as DogIcon, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import messagesIcon from "@/assets/messages-icon.jpg";
import documentsIcon from "@/assets/documents-icon.jpg";
import professionalsIcon from "@/assets/professionals-icon.jpg";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const unreadCount = useUnreadMessages();

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
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
              Alerte aux chenilles processionnaires !
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-2 text-sm mt-2">
              <p>
                Leur retour marque un vrai danger pour nos chiens : les poils urticants de ces chenilles peuvent provoquer de graves brûlures sur la langue, la gueule ou les pattes, voire des complications vitales.
              </p>
              <p className="font-medium">Les bons réflexes :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ne laissez pas votre chien renifler ou toucher les zones où elles passent (pins, chênes, sols forestiers).</li>
                <li>Si vous voyez des chenilles alignées ou des cocons blancs dans les arbres, évitez le secteur.</li>
              </ul>
              <p className="font-medium">En cas de contact :</p>
              <p>Rincez immédiatement à l'eau claire sans frotter et filez chez le vétérinaire en urgence.</p>
              <p className="font-semibold mt-2">🪶 Mieux vaut une balade ailleurs qu'une visite aux urgences vétérinaires !</p>
            </AlertDescription>
          </Alert>
          
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
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={messagesIcon} 
                      alt="Messages" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Messages</h3>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount > 0 ? `${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''}` : 'Avec les pros'}
                  </p>
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
