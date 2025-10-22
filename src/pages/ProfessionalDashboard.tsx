import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Settings, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const unreadCount = useUnreadMessages();

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
      <div className="min-h-screen animate-fade-in bg-background pb-24" style={{ padding: '16px' }}>
        <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                style={{ borderRadius: '12px' }}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'hsl(240 6% 11%)' }}>Tableau de bord</h1>
            </div>
            <Button
              onClick={() => navigate("/professional/edit-profile")}
              variant="outline"
              size="sm"
              style={{ borderRadius: '12px' }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <Card style={{ padding: '16px' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: '#5B9D8C' }}>{pendingRequests}</div>
                <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Demandes en attente</p>
              </div>
            </Card>

            <Card style={{ padding: '16px' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: 'hsl(240 6% 11%)' }}>{totalClients}</div>
                <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Clients actifs</p>
              </div>
            </Card>

            <Card style={{ padding: '16px' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: 'hsl(240 6% 11%)' }}>{unreadCount}</div>
                <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Messages non lus</p>
              </div>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <Card
              style={{ padding: '16px', cursor: 'pointer' }}
              onClick={() => navigate("/professional/clients")}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="icon-container">
                  <Users className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'hsl(240 6% 11%)' }}>Mes Clients</h3>
                  <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>
                    Gérer les accès et demandes
                  </p>
                </div>
              </div>
            </Card>

            <Card
              style={{ padding: '16px', cursor: 'pointer' }}
              onClick={() => navigate("/professional/messages")}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="icon-container relative">
                  <MessageSquare className="h-6 w-6" strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'hsl(240 6% 11%)' }}>Messages</h3>
                  <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>
                    {unreadCount > 0 ? `${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''} message${unreadCount > 1 ? 's' : ''}` : 'Communiquer avec les gardiens'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" style={{ borderRadius: '12px' }}>
                    Consulter
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfessionalDashboard;
