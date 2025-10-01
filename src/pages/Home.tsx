import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TestTube2, ClipboardList, Stethoscope, Lightbulb, LogIn, Plus, Dog as DogIcon, Users, MessageSquare, Settings, FileText } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import heroImage from "@/assets/hero-dog-dna.jpg";
import dogsOriginSection from "@/assets/dogs-origin-section.png";
import messagesIcon from "@/assets/messages-icon.jpg";
import documentsIcon from "@/assets/documents-icon.jpg";
import professionalsIcon from "@/assets/professionals-icon.jpg";
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
  const {
    isAuthenticated,
    isProfessional,
    isGuardian,
    user
  } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  useEffect(() => {
    if (isGuardian && user) {
      fetchDogs();
    }
    if (isProfessional && user) {
      fetchProStats();
    }
  }, [isGuardian, isProfessional, user]);
  const fetchDogs = async () => {
    setLoadingDogs(true);
    try {
      const {
        data,
        error
      } = await supabase.from('dogs').select('id, name, breed, avatar_url').eq('owner_id', user?.id).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      setDogs(data || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoadingDogs(false);
    }
  };
  const fetchProStats = async () => {
    try {
      const {
        count: pending
      } = await supabase.from('dog_professional_access').select('*', {
        count: 'exact',
        head: true
      }).eq('professional_id', user?.id).eq('status', 'pending');
      const {
        count: approved
      } = await supabase.from('dog_professional_access').select('*', {
        count: 'exact',
        head: true
      }).eq('professional_id', user?.id).eq('status', 'approved');
      setPendingRequests(pending || 0);
      setTotalClients(approved || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Professional Dashboard View
  if (isProfessional) {
    return <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-title">Tableau de bord</h1>
            <Button onClick={() => navigate("/professional/edit-profile")} variant="outline" size="sm" className="rounded-full">
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </Button>
          </div>

          <Card className="bg-secondary p-6 rounded-3xl shadow-lg overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold text-title">
                Commander un test ADN pour un patient
              </h2>
              <p className="text-sm text-foreground/80">
                Analyse complète des races, prédispositions santé et profil comportemental
              </p>
              <Button onClick={() => navigate("/dna-kit")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
                <TestTube2 className="h-5 w-5 mr-2" />
                Commander un kit ADN
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 rounded-3xl">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{pendingRequests}</div>
                <p className="text-sm text-muted-foreground">Demandes en attente</p>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-secondary">{totalClients}</div>
                <p className="text-sm text-muted-foreground">Clients actifs</p>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-accent">0</div>
                <p className="text-sm text-muted-foreground">Messages non lus</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 rounded-3xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/professional/clients")}>
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

            <Card className="p-6 rounded-3xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/professional/messages")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title">Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Communiquer avec les gardiens
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>;
  }

  // Guardian/Default View
  return <div className="min-h-screen pb-20 animate-fade-in">
      {/* Hero Section with Gradient */}
      <div className="p-8 rounded-b-[3rem] shadow-xl" style={{ backgroundColor: '#3D0000' }}>
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h1 className="text-3xl font-bold text-white">Découvrez & accompagnez votre chien</h1>
          <p className="text-white/90 text-sm">Lupi, votre carnet de santé connecté aux données génétiques de votre chien, à ses alertes et à son profil comportemental.</p>
          
          <div className="space-y-3 pt-4">
            {!isAuthenticated ? <>
                <button onClick={() => navigate("/choose-account-type")} className="w-full btn-lupi bg-white text-primary hover:bg-white/90 shadow-lg">
                  <LogIn className="h-5 w-5 mr-2 inline" />
                  Se connecter / S'inscrire
                </button>
              </> : <>
                {isGuardian && <>
                    <button onClick={() => navigate("/dogs/add")} className="w-full btn-lupi bg-white text-primary hover:bg-white/90 shadow-lg">
                      <Plus className="h-5 w-5 mr-2 inline" />
                      Ajouter un chien
                    </button>
                    <button onClick={() => navigate("/dna-kit")} className="w-full rounded-full bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 font-semibold hover:bg-white/30 transition-all">
                      <TestTube2 className="h-5 w-5 mr-2 inline" />
                      Faire le test ADN
                    </button>
                  </>}
              </>}
          </div>
        </div>
      </div>

      {/* D'où ils viennent Section */}
      <div className="p-4 max-w-4xl mx-auto mt-6">
        <img 
          src={dogsOriginSection} 
          alt="D'où ils viennent - Généalogie et traits comportementaux" 
          className="w-full rounded-3xl shadow-lg"
        />
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto mt-6">

        {isAuthenticated && isGuardian && <div className="grid grid-cols-3 gap-3 mb-6">
            <div 
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/guardian/messages")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
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
            </div>

            <div 
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/guardian/documents")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
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
            </div>

            <div 
              className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4"
              onClick={() => navigate("/professionals")}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
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
            </div>
          </div>}

        {isGuardian && dogs.length > 0 && <div className="space-y-4">
            <h2 className="text-xl font-bold text-title">Mes compagnons</h2>
            <div className="space-y-3">
              {dogs.map(dog => <div key={dog.id} className="lupi-card">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/dogs/${dog.id}`)}>
                    {dog.avatar_url ? <img src={dog.avatar_url} alt={dog.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" /> : <div className="w-16 h-16 rounded-full bg-gradient-card flex items-center justify-center border-2 border-primary/20">
                        <DogIcon className="h-8 w-8 text-primary" />
                      </div>}
                    <div className="flex-1">
                      <h3 className="font-bold text-title text-lg">{dog.name}</h3>
                      {dog.breed && <p className="text-sm text-muted-foreground">{dog.breed}</p>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}

        {isAuthenticated && !isGuardian && <div>
            <h2 className="text-xl font-bold text-title mb-4">Accès rapide</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard icon={TestTube2} label="Tests ADN" onClick={() => navigate("/dogs")} />
              <QuickActionCard icon={ClipboardList} label="Questionnaire" onClick={() => navigate("/questionnaire")} />
              <QuickActionCard icon={Stethoscope} label="Pros & RDV" onClick={() => navigate("/professionals")} />
              <QuickActionCard icon={Lightbulb} label="Recommandations" onClick={() => navigate("/recommendations")} />
            </div>
          </div>}
      </div>
    </div>;
};
export default Home;