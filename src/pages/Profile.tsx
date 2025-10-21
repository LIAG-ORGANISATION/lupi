import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Bell, Lock, CreditCard, HelpCircle, LogOut, Plus, Camera, Dog as DogIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
const Profile = () => {
  const navigate = useNavigate();
  const {
    signOut,
    user,
    isGuardian,
    isProfessional
  } = useAuth();
  const {
    toast
  } = useToast();
  const [profileData, setProfileData] = useState<{
    full_name: string;
    avatar_url?: string;
    profession?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        if (isProfessional) {
          const {
            data,
            error
          } = await supabase.from('professionals').select('full_name, avatar_url, profession').eq('user_id', user.id).maybeSingle();
          if (error) throw error;
          if (data) setProfileData(data);
        } else if (isGuardian) {
          const {
            data,
            error
          } = await supabase.from('owners').select('full_name, avatar_url').eq('user_id', user.id).maybeSingle();
          if (error) throw error;
          if (data) setProfileData(data);

          // Fetch dogs for guardian
          const {
            data: dogsData
          } = await supabase.from('dogs').select('id, name, avatar_url').eq('owner_id', user.id);
          setDogs(dogsData || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, isProfessional, isGuardian]);
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Le fichier doit être une image.",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5 Mo.",
        variant: "destructive"
      });
      return;
    }
    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${user.id}/${Date.now()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('dog-documents').upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('dog-documents').getPublicUrl(fileName);

      // Update profile with new avatar
      const tableName = isProfessional ? 'professionals' : 'owners';
      const {
        error: updateError
      } = await supabase.from(tableName).update({
        avatar_url: publicUrl
      }).eq('user_id', user.id);
      if (updateError) throw updateError;
      setProfileData(prev => prev ? {
        ...prev,
        avatar_url: publicUrl
      } : null);
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été modifiée."
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo.",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
  };
  const handleSignOut = async () => {
    console.log('[Profile] Bouton Se déconnecter cliqué');
    try {
      console.log('[Profile] Appel de signOut()...');
      await signOut();
      console.log('[Profile] signOut() réussi');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !"
      });
      navigate("/");
    } catch (error) {
      console.error('[Profile] Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive"
      });
    }
  };
  const menuItems = [{
    icon: User,
    label: "Modifier mon profil",
    path: "/profile/edit"
  }, {
    icon: Bell,
    label: "Notifications",
    path: "/profile/notifications"
  }, {
    icon: Lock,
    label: "Confidentialité",
    path: "/profile/privacy"
  }, {
    icon: CreditCard,
    label: "Abonnement & paiement",
    path: "/profile/billing"
  }, {
    icon: HelpCircle,
    label: "Support & FAQ",
    path: "/profile/support"
  }];
  return <div className="min-h-screen pb-20 animate-fade-in" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Image with Overlay */}
      {!loading && (
        <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden' }}>
          {profileData?.avatar_url ? (
            <img 
              src={profileData.avatar_url} 
              alt={profileData.full_name || 'Profile'}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center'
              }} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'hsl(0 0% 96%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User className="h-24 w-24" style={{ color: 'hsl(240 6% 11%)' }} strokeWidth={1.5} />
            </div>
          )}
          
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px'
          }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              color: '#FFFFFF',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {profileData?.full_name || 'Utilisateur'}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 400, 
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {isProfessional ? profileData?.profession || 'Professionnel' : 'Propriétaire de chien'}
            </p>
          </div>
          
          <label 
            htmlFor="photo-upload" 
            style={{ 
              position: 'absolute', 
              bottom: '16px', 
              right: '16px',
              width: '48px',
              height: '48px',
              backgroundColor: '#5B9D8C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Camera className="h-5 w-5" strokeWidth={1.5} />
            <input id="photo-upload" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>
      )}

      {loading && (
        <div style={{ 
          height: '280px', 
          background: 'hsl(0 0% 96%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {isGuardian && dogs.length > 0 && <Card className="n26-card" style={{ background: 'hsl(0 0% 96%)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: 'hsl(240 6% 11%)' }}>
              Mes compagnons
            </h2>
            <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)', marginTop: '4px' }}>
              {dogs.length} chien{dogs.length > 1 ? 's' : ''} enregistré{dogs.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate(dogs.length === 1 ? `/dogs/${dogs[0].id}` : "/dogs")} className="w-full btn-action">
            <DogIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
            {dogs.length === 1 ? 'Voir mon chien' : 'Accéder à mes chiens'}
          </Button>
        </Card>}

      {isGuardian && dogs.length === 0 && <Card className="n26-card" style={{ background: 'hsl(0 0% 96%)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: 'hsl(240 6% 11%)' }}>
              Créez un profil pour votre compagnon
            </h2>
            <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)', marginTop: '4px' }}>
              Suivez sa santé et son comportement
            </p>
          </div>
          <Button onClick={() => navigate("/dogs/add")} className="w-full btn-action">
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Ajouter un chien
          </Button>
        </Card>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item, index) => <Card key={index} className="n26-card cursor-pointer hover:shadow-md transition-all" style={{ padding: '12px' }} onClick={() => navigate(item.path)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="icon-container">
                  <item.icon strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(240 6% 11%)' }}>{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5" style={{ color: 'hsl(240 3% 57%)' }} strokeWidth={1.5} />
            </div>
          </Card>)}
      </div>

      <Button onClick={handleSignOut} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10" style={{ borderRadius: '16px' }} size="lg">
        <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
        Se déconnecter
      </Button>

      </div>
    </div>;
};
export default Profile;