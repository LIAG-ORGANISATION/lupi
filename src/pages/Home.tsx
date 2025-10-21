import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TestTube2, ClipboardList, Stethoscope, Lightbulb, LogIn, Plus, Dog as DogIcon, Users, MessageSquare, Settings, FileText, Heart, Gift, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import QuickActionCard from "@/components/QuickActionCard";
import heroImage from "@/assets/hero-dog-dna.jpg";
import dogsOriginSection from "@/assets/dogs-origin-section.png";
import messagesIcon from "@/assets/messages-icon.jpg";
import documentsIcon from "@/assets/documents-icon.jpg";
import professionalsIcon from "@/assets/professionals-icon.jpg";
import kozooLogo from "@/assets/kozoo-logo-new.png";
import pennypetLogo from "@/assets/pennypet-logo-new.png";
import espritDogLogo from "@/assets/esprit-dog-logo.png";
import baladeXoldokogaina from "@/assets/balade-xoldokogaina.jpg";
import baladeGuethary from "@/assets/balade-guethary.jpg";
import baladeMondarrain from "@/assets/balade-mondarrain.jpg";
import baladeOssasSuhare from "@/assets/balade-ossas-suhare.jpg";
import baladeAdarra from "@/assets/balade-adarra.jpg";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import WelcomeTutorial from "@/components/WelcomeTutorial";
import { DogCalendar } from "@/components/DogCalendar";
import { SeasonalAllergies } from "@/components/SeasonalAllergies";
import { SeasonalRecipes } from "@/components/SeasonalRecipes";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
interface Dog {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  weight: number | null;
  gender: string | null;
  medical_notes: string | null;
}
interface DogCompletion {
  dogId: string;
  hasDnaTest: boolean;
  hasQuestionnaire: boolean;
}
const Home = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasTestedDogs, setHasTestedDogs] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);
  const [dogsCompletion, setDogsCompletion] = useState<DogCompletion[]>([]);
  const [activeMedications, setActiveMedications] = useState<any[]>([]);
  const unreadCount = useUnreadMessages();

  // Check if user is first time logging in as guardian
  useEffect(() => {
    const checkFirstLogin = async () => {
      if (isGuardian && user) {
        const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${user.id}`);

        // Check if user has any dogs
        const {
          data: userDogs
        } = await supabase.from('dogs').select('id').eq('owner_id', user.id).limit(1);
        const hasDogs = userDogs && userDogs.length > 0;

        // Show tutorial only if user hasn't seen it AND has no dogs
        if (!hasSeenTutorial && !hasDogs) {
          setShowTutorial(true);
        }
      }
    };
    checkFirstLogin();
  }, [isGuardian, user]);
  useEffect(() => {
    console.log('[Home] Auth state:', {
      isAuthenticated,
      isGuardian,
      isProfessional,
      user: !!user
    });
    console.log('[Home] Dogs:', {
      dogsCount: dogs.length,
      loadingDogs
    });
    if (isGuardian && user) {
      fetchDogs();
    }
    if (isProfessional && user) {
      fetchProStats();
    }
  }, [isGuardian, isProfessional, user, isAuthenticated]);

  useEffect(() => {
    if (dogs.length > 0) {
      fetchActiveMedications();
    }
  }, [dogs]);
  const fetchDogs = async () => {
    setLoadingDogs(true);
    try {
      const {
        data,
        error
      } = await supabase.from('dogs').select('id, name, breed, avatar_url, birth_date, weight, gender, medical_notes').eq('owner_id', user?.id).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      setDogs(data || []);

      // Check completion status for each dog
      if (data && data.length > 0) {
        const dogIds = data.map(d => d.id);

        // Fetch all questionnaires for these dogs
        const {
          data: questionnaires
        } = await supabase.from('dog_questionnaires').select('dog_id').in('dog_id', dogIds);
        setHasTestedDogs(questionnaires && questionnaires.length > 0 || false);

        // Build completion data for each dog
        const completionData: DogCompletion[] = data.map(dog => ({
          dogId: dog.id,
          hasDnaTest: questionnaires?.some(q => q.dog_id === dog.id) || false,
          hasQuestionnaire: questionnaires?.some(q => q.dog_id === dog.id) || false
        }));
      setDogsCompletion(completionData);
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoadingDogs(false);
    }
  };

  const fetchActiveMedications = async () => {
    if (dogs.length === 0) return;
    
    try {
      const dogIds = dogs.map(d => d.id);
      const { data, error } = await supabase
        .from("dog_medications")
        .select("*")
        .in("dog_id", dogIds)
        .eq("active", true)
        .order("start_date", { ascending: false });

      if (error) throw error;
      setActiveMedications(data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
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
  const handleTutorialComplete = () => {
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    }
    setShowTutorial(false);
    navigate('/dogs/add');
  };
  const handleCopyPromo = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedPromo(code);
      toast({
        title: "Code promo copié !",
        description: `Le code ${code} a été copié dans le presse-papier.`
      });
      setTimeout(() => {
        setCopiedPromo(null);
      }, 2000);
    });
  };
  const calculateProfileCompletion = (dog: Dog): number => {
    // Base profile fields (7 fields = 50% of total)
    const profileFields = [dog.name, dog.breed, dog.avatar_url, dog.birth_date, dog.weight, dog.gender, dog.medical_notes];
    const filledProfileFields = profileFields.filter(field => field !== null && field !== undefined && field !== '').length;
    const profileScore = filledProfileFields / profileFields.length * 50;

    // DNA test (25% of total)
    const completion = dogsCompletion.find(c => c.dogId === dog.id);
    const dnaScore = completion?.hasDnaTest ? 25 : 0;

    // Behavioral questionnaire (25% of total)
    const questionnaireScore = completion?.hasQuestionnaire ? 25 : 0;
    return Math.round(profileScore + dnaScore + questionnaireScore);
  };
  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'text-red-500';
    if (percentage < 80) return 'text-orange-500';
    return 'text-green-500';
  };

  // Professional Dashboard View
  if (isProfessional) {
    return <div className="min-h-screen p-3 space-y-4 animate-fade-in bg-background">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-title">Tableau de bord</h1>
            <Button onClick={() => navigate("/professional/edit-profile")} variant="outline" size="sm" className="rounded-full">
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </Button>
          </div>

          <Card className="bg-secondary p-4 rounded-xl shadow-lg overflow-hidden relative">
            <div className="relative z-10 space-y-3">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="p-4 rounded-xl">
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-primary">{pendingRequests}</div>
                <p className="text-sm text-muted-foreground">Demandes en attente</p>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-secondary">{totalClients}</div>
                <p className="text-sm text-muted-foreground">Clients actifs</p>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-accent">{unreadCount}</div>
                <p className="text-sm text-muted-foreground">Messages non lus</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-4 rounded-xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/professional/clients")}>
              <div className="flex items-center gap-3">
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

            <Card className="p-4 rounded-xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/professional/messages")}>
              <div className="flex items-center gap-3">
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

          {/* Partners section for professionals */}
          <div className="space-y-3 mt-4">
            <h2 className="text-xl font-bold text-title">Nos partenaires</h2>
            <div className="space-y-2">
              <a href="https://www.kozoo.eu" target="_blank" rel="noopener noreferrer" className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4 flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <img src={kozooLogo} alt="KOZOO" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg">KOZOO</h3>
                  <p className="text-sm text-muted-foreground">Assurance pour chien</p>
                </div>
              </a>

              <a href="https://pennypet.io/" target="_blank" rel="noopener noreferrer" className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4 flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <img src={pennypetLogo} alt="PENNYPET" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg">PENNYPET</h3>
                  <p className="text-sm text-muted-foreground">Cashback frais animaux</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>;
  }

  // Guardian/Default View
  return <div className="min-h-screen pb-20 animate-fade-in">
      {showTutorial && <WelcomeTutorial onComplete={handleTutorialComplete} />}
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-[#6B1C1C] to-[#4A0F0F] p-5 rounded-b-[3rem] shadow-card">
        <div className="max-w-4xl mx-auto space-y-3 text-center">
          <h1 className="text-3xl font-bold text-white">
            {isGuardian && dogs.length > 0 ? "Mieux comprendre pour mieux accompagner" : "Découvrez & accompagnez votre chien"}
          </h1>
          <p className="text-sm text-white/80">Lupi, votre carnet de santé connecté aux données génétiques de votre chien, à ses alertes et à son profil comportemental.</p>
          
          <div className="space-y-2 pt-1">
            {!isAuthenticated ? <>
                <button onClick={() => navigate("/choose-account-type")} className="w-full btn-lupi bg-white text-primary hover:bg-white/90 shadow-lg">
                  <LogIn className="h-5 w-5 mr-2 inline" />
                  Se connecter / S'inscrire
                </button>
              </> : <>
                {isGuardian && dogs.length > 0 ? <>
                    <button onClick={() => navigate("/dna-kit")} className="w-full btn-lupi bg-white text-primary hover:bg-white/90 shadow-lg">
                      <TestTube2 className="h-5 w-5 mr-2 inline" />
                      Commander un test ADN
                    </button>
                  </> : isGuardian ? <>
                    <button onClick={() => navigate("/dogs/add")} className="w-full btn-lupi bg-white text-primary hover:bg-white/90 shadow-lg">
                      <Plus className="h-5 w-5 mr-2 inline" />
                      Ajouter un chien
                    </button>
                    <button onClick={() => navigate("/dna-kit")} className="w-full rounded-full bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 font-semibold hover:bg-white/30 transition-all">
                      <TestTube2 className="h-5 w-5 mr-2 inline" />
                      Faire le test ADN
                    </button>
                  </> : null}
              </>}
          </div>
        </div>
      </div>

      <div className="p-2 space-y-3 max-w-4xl mx-auto mt-2">
        {/* My Dogs section - show first when user has dogs */}
        {isGuardian && dogs.length > 0 && <div className="space-y-2 mb-3">
            <h2 className="text-xl font-bold text-title">Mes chiens</h2>
            <div className="space-y-2">
              {dogs.map(dog => {
            const completion = calculateProfileCompletion(dog);
            return <div key={dog.id} className="lupi-card">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/dogs/${dog.id}`)}>
                    {dog.avatar_url ? <img src={dog.avatar_url} alt={dog.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20" /> : <div className="w-20 h-20 rounded-2xl bg-gradient-card flex items-center justify-center border-2 border-primary/20">
                        <DogIcon className="h-10 w-10 text-primary" />
                      </div>}
                    <div className="flex-1">
                      <h3 className="font-bold text-title text-lg">{dog.name}</h3>
                      {dog.breed && <p className="text-sm text-muted-foreground">{dog.breed}</p>}
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-secondary" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - completion / 100)}`} className={`${getProgressColor(completion)} transition-all duration-300`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-foreground">{completion}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Profil</span>
                    </div>
                  </div>
                </div>;
          })}
              
              {/* Raccourci vers Recommandations personnalisées */}
              <div className="lupi-card bg-gradient-card border-2 border-primary/20">
                <div className="flex items-center gap-3 cursor-pointer p-3" onClick={() => navigate('/recommendations-demo')}>
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-md bg-black">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-title text-lg">Recommandations personnalisées</h3>
                    <p className="text-sm text-muted-foreground">Une fois votre test ADN réalisé, Lupi vous propose des recommandations ultra personnalisées pour votre chien</p>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {/* Active Medications Section */}
        {isGuardian && activeMedications.length > 0 && (
          <Card className="p-4 rounded-xl shadow-card">
            <h3 className="text-lg font-bold text-title mb-3 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Traitements en cours
            </h3>
            <div className="space-y-3">
              {activeMedications.map((med) => {
                const dog = dogs.find(d => d.id === med.dog_id);
                const daysRemaining = med.end_date 
                  ? Math.ceil((new Date(med.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                
                return (
                  <div key={med.id} className="p-3 rounded-lg bg-pink-50 border border-pink-200">
                    <div className="flex items-start gap-3">
                      {dog && (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {dog.avatar_url ? (
                            <img src={dog.avatar_url} alt={dog.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{dog.name[0]}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-semibold text-pink-900">{med.medication_name}</div>
                          {dog && (
                            <Badge variant="secondary" className="flex-shrink-0 text-xs">
                              {dog.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-pink-800 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Posologie:</span>
                            <span>{med.dosage_detail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Fréquence:</span>
                            <span>{med.frequency}</span>
                          </div>
                          {med.start_date && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium">Début:</span>
                              <span>{format(new Date(med.start_date), "d MMM yyyy", { locale: fr })}</span>
                            </div>
                          )}
                          {med.end_date && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium">Fin:</span>
                              <span>{format(new Date(med.end_date), "d MMM yyyy", { locale: fr })}</span>
                              {daysRemaining !== null && daysRemaining > 0 && (
                                <Badge variant="outline" className="text-xs bg-pink-100 border-pink-300">
                                  {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          )}
                          {med.notes && (
                            <div className="text-xs mt-2 pt-2 border-t border-pink-200">
                              <span className="font-medium">Notes:</span> {med.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Calendar for all dogs - compact version */}
        {isGuardian && dogs.length > 0 && user && (
          <DogCalendar 
            dogs={dogs} 
            ownerId={user.id} 
            compact={true} 
          />
        )}
      </div>

      {/* D'où ils viennent Section */}
        

      <div className="p-2 space-y-3 max-w-4xl mx-auto mt-2">

        {/* CTA to create dog for authenticated guardians without dogs */}
        {isAuthenticated && isGuardian && dogs.length === 0 && !loadingDogs && <>
            <div className="lupi-card p-4 text-center space-y-3 bg-gradient-card mb-3">
              
              <h3 className="text-lg font-bold text-title">
                Créez le profil de votre chien
              </h3>
              <p className="text-sm text-muted-foreground">
                Commencez à suivre sa santé et son bien-être
              </p>
              <Button onClick={() => navigate("/dogs/add")} className="w-full rounded-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Créer mon chien
              </Button>
            </div>

            <div className="lupi-card p-4 text-center space-y-3 mb-3">
              <TestTube2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-lg font-bold text-title">
                Découvrez un exemple de résultats ADN
              </h3>
              <p className="text-sm text-muted-foreground">
                Visualisez comment fonctionne l'analyse génétique complète
              </p>
              <Button onClick={() => navigate("/dna-demo")} variant="outline" className="w-full rounded-full" size="lg">
                <TestTube2 className="h-5 w-5 mr-2" />
                Voir la démo
              </Button>
            </div>

            <div className="lupi-card p-4 text-center space-y-3 mb-3">
              <Lightbulb className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-lg font-bold text-title">
                Recommandations personnalisées
              </h3>
              <p className="text-sm text-muted-foreground">
                Quand vous réalisez un test, Lupi vous fournit des recommandations lifestyle personnalisées
              </p>
              <Button onClick={() => navigate("/recommendations-demo")} variant="outline" className="w-full rounded-full" size="lg">
                <Lightbulb className="h-5 w-5 mr-2" />
                Voir les recommandations
              </Button>
            </div>
          </>}

        {/* Quick actions for authenticated guardians */}
        {isAuthenticated && isGuardian && <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="cursor-pointer transition-all" onClick={() => navigate("/guardian/messages")}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                    <img src={messagesIcon} alt="Messages" className="w-full h-full object-cover" />
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
                  <p className="text-xs text-primary">Avec les pros</p>
                </div>
              </div>
            </div>

            <div className="cursor-pointer transition-all" onClick={() => navigate("/guardian/documents")}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                  <img src={documentsIcon} alt="Documents" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Documents</h3>
                  <p className="text-xs text-primary">Partagés</p>
                </div>
              </div>
            </div>

            <div className="cursor-pointer transition-all" onClick={() => navigate("/professionals")}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                  <img src={professionalsIcon} alt="Professionnels" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-title text-sm">Professionnels</h3>
                  <p className="text-xs text-primary">Trouver</p>
                </div>
              </div>
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

        {/* CTA for non-authenticated users */}
        {!isAuthenticated && <div className="mt-8 lupi-card p-8 text-center space-y-4 bg-gradient-card">
            <DogIcon className="h-16 w-16 text-primary mx-auto" />
            <h3 className="text-xl font-bold text-title">
              Ajoutez votre chien pour démarrer l'expérience Lupi
            </h3>
            <p className="text-sm text-muted-foreground">
              Commencez à suivre la santé et le bien-être de votre compagnon
            </p>
            <Button onClick={() => navigate("/choose-account-type")} className="w-full rounded-full" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Télécharger l'app et s'inscrire
            </Button>
          </div>}


      </div>
    </div>;
};
export default Home;