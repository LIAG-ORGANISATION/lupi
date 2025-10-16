import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { X, Camera, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfessionalEditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "Olivia Bennett",
    profession: "Spécialiste en soins animaliers",
    location: "Paris, France",
    bio: "",
    email: "",
    phone: "",
    photoUrl: "",
    specializations: ["Garde d'animaux", "Promenade de chiens"],
    certifications: [],
    languages: ["Français"],
    services: [],
    hourlyRate: "",
    emailVisible: false,
    phoneVisible: false,
    messagingContact: true,
    profileVisible: false,
  });

  const [newSpec, setNewSpec] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newService, setNewService] = useState({ name: "", duration: "" });

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dog-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dog-documents')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photoUrl: publicUrl }));

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été modifiée.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('professionals')
        .update({
          full_name: formData.name,
          profession: formData.profession,
          localisation: formData.location,
          bio: formData.bio,
          email: formData.emailVisible ? formData.email : user.email,
          phone: formData.phoneVisible ? formData.phone : null,
          avatar_url: formData.photoUrl,
          tarifs: formData.hourlyRate,
          preferences_contact: [
            formData.emailVisible ? 'email' : null,
            formData.phoneVisible ? 'phone' : null,
            formData.messagingContact ? 'messaging' : null,
          ].filter(Boolean),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profil enregistré",
        description: "Vos informations ont été mises à jour.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professionals")}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-title">Modifier le profil</h1>
          <Button
            onClick={handleSave}
            className="rounded-full bg-primary hover:bg-primary/90"
            size="sm"
          >
            Enregistrer
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <Avatar className="w-24 h-24">
                {formData.photoUrl && (
                  <AvatarImage src={formData.photoUrl} alt="Photo de profil" />
                )}
                <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                  OB
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  id="photo-upload"
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold text-title">{formData.name}</h2>
              <p className="text-sm text-muted-foreground">{formData.profession}</p>
              <p className="text-sm text-muted-foreground">{formData.location}</p>
            </div>
          </div>

          {/* About Section */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">À propos</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="rounded-2xl bg-secondary/50 min-h-[100px]"
                placeholder="Parlez-nous de vous et de votre expérience..."
              />
            </div>
          </Card>

          {/* Specializations */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Spécialisations</h3>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Ajouter une spécialisation"
                className="rounded-2xl bg-secondary/50"
              />
              <Button
                onClick={() => {
                  if (newSpec) {
                    setFormData({
                      ...formData,
                      specializations: [...formData.specializations, newSpec],
                    });
                    setNewSpec("");
                  }
                }}
                size="icon"
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Certifications</h3>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Ajouter une certification</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>

          {/* Languages */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Langues</h3>
            <div className="space-y-2">
              {formData.languages.map((lang, index) => (
                <div key={index} className="text-sm">{lang}</div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Ajouter une langue</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>

          {/* Services */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Services</h3>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Ajouter un service</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>


          {/* Contact Info & Preferences */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Coordonnées & visibilité</h3>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex. Paris, France"
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <h4 className="font-semibold text-title text-sm">Préférences de contact</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email visible</Label>
                  <Switch
                    id="email"
                    checked={formData.emailVisible}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, emailVisible: checked })
                    }
                  />
                </div>
                {formData.emailVisible && (
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex. nom@example.com"
                    className="rounded-2xl bg-secondary/50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone">Téléphone visible</Label>
                  <Switch
                    id="phone"
                    checked={formData.phoneVisible}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, phoneVisible: checked })
                    }
                  />
                </div>
                {formData.phoneVisible && (
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex. +33 6 12 34 56 78"
                    className="rounded-2xl bg-secondary/50"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="messaging">Messagerie Lupi</Label>
                <Switch
                  id="messaging"
                  checked={formData.messagingContact}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, messagingContact: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Tarifs (optionnel)</h3>
            <div className="space-y-2">
              <Input
                id="rate"
                type="text"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="Ex. 60 € / séance"
                className="rounded-2xl bg-secondary/50"
              />
            </div>
          </Card>

          {/* Visibility */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Visibilité</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visibilité du profil</Label>
                <Switch
                  id="visible"
                  checked={formData.profileVisible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, profileVisible: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                En rendant votre profil visible, vous acceptez notre{" "}
                <button className="text-primary underline">charte éthique</button>.
              </p>
            </div>
          </Card>

          <div className="flex gap-4 pb-8">
            <Button
              onClick={() => navigate(`/professionals/${1}`)}
              variant="outline"
              className="flex-1 rounded-full"
              size="lg"
            >
              Aperçu
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalEditProfile;
