import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BottomNavigation } from "@/components/BottomNavigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Profession {
  id: string;
  label: string;
}

interface Specialisation {
  id: string;
  label: string;
}

const ProfessionalEditProfileNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [allSpecialisations, setAllSpecialisations] = useState<Specialisation[]>([]);
  const [filteredSpecialisations, setFilteredSpecialisations] = useState<Specialisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<"Email" | "Téléphone" | null>(null);

  const [formData, setFormData] = useState({
    nom: "",
    profession_id: "",
    specialisations_ids: [] as string[],
    localisation: "",
    preferences_contact: [] as string[],
    tarifs: "",
    photo_url: "",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.profession_id) {
      loadFilteredSpecialisations(formData.profession_id);
    } else {
      setFilteredSpecialisations([]);
    }
  }, [formData.profession_id]);

  const loadData = async () => {
    try {
      // Load professions
      const { data: professionsData, error: professionsError } = await supabase
        .from("professions")
        .select("*")
        .order("label");

      if (professionsError) throw professionsError;
      setProfessions(professionsData || []);

      // Load all specialisations
      const { data: specsData, error: specsError } = await supabase
        .from("specialisations")
        .select("*")
        .order("label");

      if (specsError) throw specsError;
      setAllSpecialisations(specsData || []);

      // Load user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("professionals" as any)
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileData) {
          setFormData({
            nom: (profileData as any).full_name || "",
            profession_id: (profileData as any).profession_id || "",
            specialisations_ids: (profileData as any).specialisations_ids || [],
            localisation: (profileData as any).localisation || "",
            preferences_contact: (profileData as any).preferences_contact || [],
            tarifs: (profileData as any).tarifs || "",
            photo_url: (profileData as any).photo_url || "",
            email: (profileData as any).email || "",
            phone: (profileData as any).phone || "",
            bio: (profileData as any).bio || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredSpecialisations = async (professionId: string) => {
    try {
      const { data, error } = await supabase
        .from("profession_specialisation")
        .select(`
          specialisation_id,
          specialisations (id, label)
        `)
        .eq("profession_id", professionId);

      if (error) throw error;

      const specs = data
        .map((item: any) => item.specialisations)
        .filter(Boolean)
        .sort((a, b) => a.label.localeCompare(b.label));

      setFilteredSpecialisations(specs);
      
      // Reset selected specialisations when profession changes
      setFormData(prev => ({ ...prev, specialisations_ids: [] }));
    } catch (error) {
      console.error("Error loading specialisations:", error);
    }
  };

  const toggleSpecialisation = (specId: string) => {
    setFormData(prev => ({
      ...prev,
      specialisations_ids: prev.specialisations_ids.includes(specId)
        ? prev.specialisations_ids.filter(id => id !== specId)
        : [...prev.specialisations_ids, specId]
    }));
  };

  const toggleContactPreference = (pref: string) => {
    const isCurrentlySelected = formData.preferences_contact.includes(pref);
    
    if (isCurrentlySelected) {
      // Deselecting - remove preference
      setFormData(prev => ({
        ...prev,
        preferences_contact: prev.preferences_contact.filter(p => p !== pref)
      }));
    } else {
      // Selecting - open modal for Email or Téléphone
      if (pref === "Email" || pref === "Téléphone") {
        setContactModalType(pref);
        setContactModalOpen(true);
      } else {
        // For "Messagerie", just add it
        setFormData(prev => ({
          ...prev,
          preferences_contact: [...prev.preferences_contact, pref]
        }));
      }
    }
  };

  const handleSaveContactInfo = () => {
    if (contactModalType) {
      setFormData(prev => ({
        ...prev,
        preferences_contact: [...prev.preferences_contact, contactModalType]
      }));
    }
    setContactModalOpen(false);
    setContactModalType(null);
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('professional-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professional-avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));

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
    if (!formData.profession_id) {
      toast({
        title: "Champ requis",
        description: "Veuillez sélectionner votre métier",
        variant: "destructive",
      });
      return;
    }

    if (formData.specialisations_ids.length === 0) {
      toast({
        title: "Astuce",
        description: "Choisissez au moins une spécialisation pour être mieux référencé",
      });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("professionals" as any)
        .update({
          full_name: formData.nom,
          profession_id: formData.profession_id,
          specialisations_ids: formData.specialisations_ids,
          localisation: formData.localisation,
          preferences_contact: formData.preferences_contact,
          tarifs: formData.tarifs,
          photo_url: formData.photo_url,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profil professionnel mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });

      // Redirect to profile page after save
      navigate("/professional/my-profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le profil",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header with photo */}
        <Card className="p-6 rounded-3xl text-center space-y-4 shadow-md">
          <div className="relative w-24 h-24 mx-auto">
            <Avatar className="w-24 h-24">
              {formData.photo_url && (
                <img src={formData.photo_url} alt="Photo de profil" className="object-cover w-full h-full rounded-full" />
              )}
              <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                {formData.nom.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Camera className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                id="photo-upload"
              />
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-sm font-medium text-title">
              Nom
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Votre nom et prénom"
              className="rounded-2xl border-border"
            />
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-bold text-title text-lg">Informations professionnelles</h3>
          
          <div className="space-y-2">
            <Label htmlFor="profession" className="text-sm font-medium text-title">
              Métier <span className="text-primary">*</span>
            </Label>
            <Select
              value={formData.profession_id}
              onValueChange={(value) => setFormData({ ...formData, profession_id: value })}
            >
              <SelectTrigger className="rounded-2xl border-border">
                <SelectValue placeholder="Choisissez votre métier" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {professions.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-title">
              Spécialisations
            </Label>
            {!formData.profession_id ? (
              <p className="text-sm text-muted-foreground italic">
                Veuillez d'abord sélectionner votre métier
              </p>
            ) : filteredSpecialisations.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Aucune spécialisation disponible pour ce métier
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-2xl min-h-[60px]">
                  {formData.specialisations_ids.length === 0 ? (
                    <span className="text-sm text-muted-foreground italic">
                      Sélectionnez vos spécialisations
                    </span>
                  ) : (
                    formData.specialisations_ids.map(specId => {
                      const spec = allSpecialisations.find(s => s.id === specId);
                      return spec ? (
                        <Badge
                          key={specId}
                          variant="secondary"
                          className="bg-primary/10 text-title hover:bg-primary/20 cursor-pointer"
                          onClick={() => toggleSpecialisation(specId)}
                        >
                          {spec.label} ×
                        </Badge>
                      ) : null;
                    })
                  )}
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 border border-border rounded-2xl">
                  {filteredSpecialisations.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-xl cursor-pointer"
                      onClick={() => toggleSpecialisation(spec.id)}
                    >
                      <Checkbox
                        id={spec.id}
                        checked={formData.specialisations_ids.includes(spec.id)}
                        onCheckedChange={() => toggleSpecialisation(spec.id)}
                      />
                      <label
                        htmlFor={spec.id}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {spec.label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  💡 Choisissez au moins une spécialisation pour être mieux référencé
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Biography Section */}
        <Card className="p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-bold text-title text-lg">Biographie</h3>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-title">
              Présentez-vous
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Parlez de votre parcours, votre expérience, votre approche..."
              className="rounded-2xl border-border min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground italic">
              💡 Une bonne biographie aide les gardiens à mieux vous connaître
            </p>
          </div>
        </Card>

        {/* Location & Contact */}
        <Card className="p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-bold text-title text-lg">Coordonnées & visibilité</h3>
          
          <div className="space-y-2">
            <Label htmlFor="localisation" className="text-sm font-medium text-title">
              Localisation
            </Label>
            <Input
              id="localisation"
              value={formData.localisation}
              onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
              placeholder="Ville, secteur d'intervention..."
              className="rounded-2xl border-border"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-title">
              Préférences de contact
            </Label>
            {["Email", "Téléphone", "Messagerie"].map((pref) => (
              <div key={pref}>
                <div
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-xl cursor-pointer"
                  onClick={() => toggleContactPreference(pref)}
                >
                  <Checkbox
                    id={pref}
                    checked={formData.preferences_contact.includes(pref)}
                    onCheckedChange={() => toggleContactPreference(pref)}
                  />
                  <label htmlFor={pref} className="text-sm cursor-pointer flex-1">
                    {pref}
                  </label>
                </div>
                {/* Show the entered info below if available */}
                {pref === "Email" && formData.preferences_contact.includes("Email") && formData.email && (
                  <p className="text-xs text-muted-foreground ml-8 mt-1">{formData.email}</p>
                )}
                {pref === "Téléphone" && formData.preferences_contact.includes("Téléphone") && formData.phone && (
                  <p className="text-xs text-muted-foreground ml-8 mt-1">{formData.phone}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-bold text-title text-lg">Tarifs (optionnel)</h3>
          
          <div className="space-y-2">
            <Input
              id="tarifs"
              value={formData.tarifs}
              onChange={(e) => setFormData({ ...formData, tarifs: e.target.value })}
              placeholder="Ex. 60 € / séance"
              className="rounded-2xl border-border"
            />
          </div>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
            size="lg"
          >
            Enregistrer mes modifications
          </Button>
        </div>
      </div>

      <BottomNavigation />

      {/* Contact Information Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="text-title">
              {contactModalType === "Email" ? "Ajouter votre email" : "Ajouter votre téléphone"}
            </DialogTitle>
            <DialogDescription>
              Renseignez vos coordonnées pour que les propriétaires puissent vous contacter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {contactModalType === "Email" ? (
              <div className="space-y-2">
                <Label htmlFor="modal-email" className="text-sm font-medium text-title">
                  Email professionnel
                </Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@exemple.com"
                  className="rounded-2xl border-border"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="modal-phone" className="text-sm font-medium text-title">
                  Numéro de téléphone
                </Label>
                <Input
                  id="modal-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="rounded-2xl border-border"
                />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setContactModalOpen(false);
                setContactModalType(null);
              }}
              className="flex-1 rounded-full"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveContactInfo}
              className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Valider
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalEditProfileNew;
