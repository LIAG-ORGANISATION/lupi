import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Settings, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import heroDog1 from "@/assets/hero-dog-new-1.jpg";
import heroDog2 from "@/assets/hero-dog-new-2.jpg";
import heroDog3 from "@/assets/hero-dog-new-3.jpg";
import heroDog4 from "@/assets/hero-dog-new-4.jpg";
import heroDog5 from "@/assets/hero-dog-new-5.jpg";
import heroDog6 from "@/assets/hero-dog-new-6.jpg";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const unreadCount = useUnreadMessages();
  const [heroApi, setHeroApi] = useState<any>();

  // Auto-scroll hero carousel
  useEffect(() => {
    if (!heroApi) return;
    const interval = setInterval(() => {
      heroApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [heroApi]);

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
      <div className="min-h-screen animate-fade-in pb-20" style={{ background: '#FFFFFF' }}>
        {/* Hero Section with Auto-Sliding Images */}
        <div className="relative mb-0 overflow-hidden" style={{
          height: '40vh',
          minHeight: '300px'
        }}>
          <Carousel setApi={setHeroApi} opts={{
            loop: true,
            align: 'center'
          }} className="w-full h-full">
            <CarouselContent className="h-full -ml-0">
              {[heroDog1, heroDog2, heroDog3, heroDog4, heroDog5, heroDog6].map((image, index) => (
                <CarouselItem key={index} className="pl-0 h-full">
                  <div className="relative w-full h-full">
                    <img 
                      src={image} 
                      alt={`Chien ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl" style={{ zIndex: 10 }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#FFFFFF',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Tableau de bord professionnel
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <div style={{ fontSize: '30px', fontWeight: 700, color: '#5B9D8C' }}>{totalClients}</div>
                <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)' }}>Clients actifs</p>
              </div>
            </Card>

            <Card style={{ padding: '16px' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: '#5B9D8C' }}>{unreadCount}</div>
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
