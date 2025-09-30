import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Edit, Globe, Award, DollarSign, MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Badge } from "@/components/ui/badge";

interface Profession {
  id: string;
  label: string;
}

interface Specialisation {
  id: string;
  label: string;
}

interface ProfileData {
  full_name: string;
  email: string;
  profession: Profession | null;
  specialisations: Specialisation[];
  localisation: string;
  preferences_contact: string[];
  tarifs: string;
  photo_url: string;
}

const MyProfessionalProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load profile with profession and specialisations
      const { data: profile, error: profileError } = await supabase
        .from("professionals" as any)
        .select(`
          full_name,
          email,
          profession_id,
          specialisations_ids,
          localisation,
          preferences_contact,
          tarifs,
          photo_url
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        setProfileData(null);
        setLoading(false);
        return;
      }

      // Load profession
      let profession = null;
      if ((profile as any).profession_id) {
        const { data: professionData } = await supabase
          .from("professions")
          .select("*")
          .eq("id", (profile as any).profession_id)
          .maybeSingle();
        profession = professionData;
      }

      // Load specialisations
      const specialisations: Specialisation[] = [];
      if ((profile as any).specialisations_ids && (profile as any).specialisations_ids.length > 0) {
        const { data: specsData } = await supabase
          .from("specialisations")
          .select("*")
          .in("id", (profile as any).specialisations_ids);
        if (specsData) specialisations.push(...specsData as any);
      }

      setProfileData({
        full_name: (profile as any).full_name || "",
        email: (profile as any).email || "",
        profession,
        specialisations,
        localisation: (profile as any).localisation || "",
        preferences_contact: (profile as any).preferences_contact || [],
        tarifs: (profile as any).tarifs || "",
        photo_url: (profile as any).photo_url || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-24">
        <p className="text-muted-foreground mb-4">Profil non trouvé</p>
        <Button
          onClick={() => navigate("/professional/edit-profile")}
          className="rounded-full bg-primary hover:bg-primary/90"
        >
          Créer mon profil
        </Button>
        <BottomNavigation />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header with edit button */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-title">Mon profil professionnel</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professional/edit-profile")}
            className="rounded-full hover:bg-secondary"
          >
            <Edit className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <Card className="p-6 rounded-3xl text-center space-y-4 shadow-md">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                {getInitials(profileData.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-title">{profileData.full_name}</h2>
              {profileData.profession && (
                <p className="text-sm text-primary font-medium mt-1">
                  {profileData.profession.label}
                </p>
              )}
              {profileData.localisation && (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.localisation}
                </p>
              )}
            </div>
          </Card>

          {/* Specializations */}
          {profileData.specialisations.length > 0 && (
            <Card className="p-6 rounded-3xl space-y-3 shadow-md">
              <h3 className="font-bold text-title text-lg">Spécialisations</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.specialisations.map((spec) => (
                  <Badge
                    key={spec.id}
                    variant="secondary"
                    className="bg-secondary text-title"
                  >
                    {spec.label}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Contact Preferences */}
          {profileData.preferences_contact.length > 0 && (
            <Card className="p-6 rounded-3xl space-y-3 shadow-md">
              <h3 className="font-bold text-title text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Préférences de contact
              </h3>
              <div className="space-y-2">
                {profileData.preferences_contact.map((pref) => (
                  <div key={pref} className="flex items-center gap-3 text-sm">
                    {pref === "Email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                    {pref === "Téléphone" && <Phone className="h-4 w-4 text-muted-foreground" />}
                    {pref === "Messagerie" && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                    <span>{pref}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Pricing */}
          {profileData.tarifs && (
            <Card className="p-6 rounded-3xl shadow-md">
              <h3 className="font-bold text-title text-lg flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-primary" />
                Tarifs
              </h3>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold text-title">{profileData.tarifs}</span>
              </div>
            </Card>
          )}

          {/* Edit Profile Button */}
          <Button
            onClick={() => navigate("/professional/edit-profile")}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
            size="lg"
          >
            <Edit className="h-5 w-5 mr-2" />
            Modifier mon profil
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyProfessionalProfile;
