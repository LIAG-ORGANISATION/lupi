import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Clock, Award, Globe, Phone, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { capitalizeWords } from "@/lib/utils";
const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id) return;
      try {
        const {
          data,
          error
        } = await supabase.from("professionals").select("*").eq("user_id", id).single();
        if (error) throw error;
        setProfessional(data);
      } catch (error) {
        console.error("Error fetching professional:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfessional();
  }, [id, toast]);
  const handleSendMessage = async () => {
    if (!user || !professional) return;
    try {
      // Check if conversation already exists
      const {
        data: existingConv,
        error: searchError
      } = await supabase.from("conversations").select("id").eq("owner_id", user.id).eq("professional_id", professional.user_id).is("dog_id", null).maybeSingle();
      if (searchError && searchError.code !== "PGRST116") throw searchError;
      let conversationId = existingConv?.id;

      // Create conversation if it doesn't exist
      if (!conversationId) {
        const {
          data: newConv,
          error: createError
        } = await supabase.from("conversations").insert({
          owner_id: user.id,
          professional_id: professional.user_id,
          dog_id: null
        }).select("id").single();
        if (createError) throw createError;
        conversationId = newConv.id;
      }

      // Navigate to messages page
      navigate("/guardian/messages");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la conversation",
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>;
  }
  if (!professional) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Professionnel non trouvé</p>
      </div>;
  }
  const professionalData = {
    name: capitalizeWords(professional.full_name) || "Professionnel",
    profession: capitalizeWords(professional.profession) || "Professionnel de santé animale",
    location: capitalizeWords(professional.localisation || professional.zone) || "France",
    phone: professional.phone,
    email: professional.email,
    avatar: professional.photo_url || professional.avatar_url,
    phoneVisible: !!professional.phone,
    emailVisible: !!professional.email,
    rating: 4.9,
    clients: "100+",
    years: 5,
    specializations: [],
    bio: professional.bio || "Professionnel de santé animale qualifié",
    certifications: [],
    languages: ["Français"],
    services: [],
    pricing: professional.tarifs ? `${professional.tarifs} €` : "Nous consulter"
  };
  return <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={professionalData.avatar || undefined} />
                <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                  {professionalData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-title">{professionalData.name}</h1>
              <p className="text-sm text-primary font-medium">{professionalData.profession}</p>
              <p className="text-sm text-muted-foreground">{professionalData.location}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professionalData.rating}</div>
              <div className="text-xs text-muted-foreground">Note</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professionalData.clients}</div>
              <div className="text-xs text-muted-foreground">Clients</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professionalData.years}</div>
              <div className="text-xs text-muted-foreground">Années</div>
            </Card>
          </div>

          {/* Specializations */}
          {professionalData.specializations.length > 0 && <div className="flex flex-wrap gap-2">
              {professionalData.specializations.map((spec, index) => <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                  {spec}
                </span>)}
            </div>}

          {/* Bio */}
          <Card className="lupi-card">
            <p className="text-sm text-foreground leading-relaxed py-[6px] my-[5px] px-[9px]">{professionalData.bio}</p>
          </Card>

          {/* Certifications */}
          {professionalData.certifications.length > 0 && <Card className="lupi-card space-y-3">
              <h3 className="font-bold text-title flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </h3>
              <div className="space-y-2">
                {professionalData.certifications.map((cert, index) => <div key={index} className="flex items-start gap-3">
                    <Award className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{cert}</span>
                  </div>)}
              </div>
            </Card>}

          {/* Languages */}
          {professionalData.languages.length > 0 && <Card className="lupi-card space-y-3">
              <h3 className="font-bold text-title flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Langues
              </h3>
              <div className="space-y-2">
                {professionalData.languages.map((lang, index) => <div key={index} className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lang}</span>
                  </div>)}
              </div>
            </Card>}

          {/* Services */}
          {professionalData.services.length > 0 && <Card className="lupi-card space-y-3">
              <h3 className="font-bold text-title flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Services
              </h3>
              <div className="space-y-3">
                {professionalData.services.map((service, index) => <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                    </div>
                  </div>)}
              </div>
            </Card>}

          {/* Pricing */}
          {professionalData.pricing && <Card className="lupi-card">
              <h3 className="font-bold text-title flex items-center gap-2 mb-3">
                <span className="text-primary">€</span>
                Tarifs
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-primary">€</span>
                <span className="text-lg font-semibold text-title">{professionalData.pricing}</span>
              </div>
            </Card>}

          {/* Actions */}
          <div className="space-y-3 pb-8">
            {professionalData.phoneVisible && professionalData.phone && <Button variant="outline" className="w-full rounded-full" size="lg" onClick={() => window.location.href = `tel:${professionalData.phone}`}>
                <Phone className="h-5 w-5 mr-2" />
                Appeler
              </Button>}
            {professionalData.emailVisible && professionalData.email && <Button variant="outline" className="w-full rounded-full" size="lg" onClick={() => window.location.href = `mailto:${professionalData.email}`}>
                <Mail className="h-5 w-5 mr-2" />
                Envoyer un email
              </Button>}
            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg" onClick={handleSendMessage}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Envoyer un message
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfessionalProfile;