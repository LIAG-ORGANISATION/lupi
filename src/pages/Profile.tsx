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
  return <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-white">
      <h1 className="text-2xl font-bold text-title">Profil</h1>

      <Card className="lupi-card text-center space-y-4">
        {loading ? <div className="animate-pulse space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-secondary" />
            <div className="h-6 bg-secondary rounded w-32 mx-auto" />
            <div className="h-4 bg-secondary rounded w-24 mx-auto" />
          </div> : <>
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {profileData?.avatar_url && <AvatarImage src={profileData.avatar_url} />}
                <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                  {profileData?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-lg h-8 w-8" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}>
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <div>
              <h2 className="text-xl font-bold text-title">
                {profileData?.full_name || 'Utilisateur'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isProfessional ? profileData?.profession || 'Professionnel' : 'Propriétaire de chien'}
              </p>
            </div>
          </>}
      </Card>

      {isGuardian && dogs.length > 0 && <Card className="lupi-card bg-secondary space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-title">
              Mes compagnons
            </h2>
            <p className="text-sm text-foreground/70 mt-1">
              {dogs.length} chien{dogs.length > 1 ? 's' : ''} enregistré{dogs.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate(dogs.length === 1 ? `/dogs/${dogs[0].id}` : "/dogs")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <DogIcon className="mr-2 h-4 w-4" />
            {dogs.length === 1 ? 'Voir mon chien' : 'Accéder à mes chiens'}
          </Button>
        </Card>}

      {isGuardian && dogs.length === 0 && <Card className="lupi-card bg-secondary space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-title">
              Créez un profil pour votre compagnon
            </h2>
            <p className="text-sm text-foreground/70 mt-1">
              Suivez sa santé et son comportement
            </p>
          </div>
          <Button onClick={() => navigate("/dogs/add")} className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un chien
          </Button>
        </Card>}

      <div className="space-y-2">
        {menuItems.map((item, index) => <Card key={index} className="p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(item.path)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>)}
      </div>

      <Button onClick={handleSignOut} variant="outline" className="w-full rounded-full border-destructive text-destructive hover:bg-destructive/10" size="lg">
        <LogOut className="mr-2 h-4 w-4" />
        Se déconnecter
      </Button>
    </div>;
};
export default Profile;