import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Settings, Home, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const { unreadCount } = useUnreadMessages();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { count: pending } = await supabase
        .from('dog_professional_access')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', user?.id)
        .eq('status', 'pending');

      const { count: approved } = await supabase
        .from('dog_professional_access')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', user?.id)
        .eq('status', 'approved');

      setPendingRequests(pending || 0);
      setTotalClients(approved || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <AuthGuard requiredRole="professional">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              <h1 className="text-2xl font-bold text-title">Tableau de bord</h1>
            </div>
            <Button
              onClick={() => navigate("/professional/edit-profile")}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="lupi-card">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{pendingRequests}</div>
                <p className="text-sm text-muted-foreground">Demandes en attente</p>
              </div>
            </Card>

            <Card className="lupi-card">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-title">{totalClients}</div>
                <p className="text-sm text-muted-foreground">Clients actifs</p>
              </div>
            </Card>

            <Card
              className="lupi-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/professional/messages")}
            >
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-3xl font-bold text-primary">{unreadCount}</div>
                  {unreadCount > 0 && (
                    <Bell className="h-5 w-5 text-primary animate-pulse" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Messages non lus</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="lupi-card cursor-pointer"
              onClick={() => navigate("/professional/clients")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title">Mes Clients</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer les accès et demandes
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="lupi-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/professional/messages")}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-title">Messages</h3>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="h-5 px-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Communiquer avec les gardiens
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfessionalDashboard;
