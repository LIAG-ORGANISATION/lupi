import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const ProfessionalSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profession: "",
    zone: "",
    phone: "",
    bio: "",
    tarifs: "",
    photoUrl: "",
  });

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
        title: "Photo ajoutée",
        description: "Votre photo de profil a été ajoutée.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la photo.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'professional',
            full_name: formData.fullName,
            profession: formData.profession,
            zone: formData.zone,
          },
          emailRedirectTo: `${window.location.origin}/professional/welcome`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Mettre à jour le profil professionnel avec les données supplémentaires
        const { error: profileError } = await supabase
          .from('professionals')
          .update({
            phone: formData.phone || null,
            bio: formData.bio || null,
            tarifs: formData.tarifs || null,
            photo_url: formData.photoUrl || null,
            localisation: formData.zone,
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Inscription réussie !",
        description: "Bienvenue dans la communauté Lupi Pro. Vérifiez votre email pour confirmer votre compte.",
      });
      
      navigate("/professional/welcome");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Sign Up</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6 pb-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-title">
            Rejoignez notre communauté<br />de professionnels
          </h2>
          <p className="text-sm text-muted-foreground">Remplissez tous les champs pour créer votre profil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo de profil */}
          <Card className="p-6 rounded-3xl">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {formData.photoUrl && (
                    <AvatarImage src={formData.photoUrl} alt="Photo de profil" />
                  )}
                  <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                    {formData.fullName ? formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
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
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Ajoutez votre photo ou logo professionnel
            </p>
          </Card>

          {/* Informations de compte */}
          <Card className="p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-title">Compte</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                placeholder="Ex: Dr. Marie Dupont"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 caractères"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-2xl"
                required
                minLength={6}
              />
            </div>
          </Card>

          {/* Informations professionnelles */}
          <Card className="p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-title">Profil professionnel</h3>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                placeholder="Ex: Vétérinaire, Éducateur canin"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Zone d'exercice *</Label>
              <Input
                id="zone"
                placeholder="Ex: Paris, Île-de-France"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: +33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                placeholder="Présentez votre expérience et vos compétences..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="rounded-2xl min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tarifs">Tarifs (optionnel)</Label>
              <Input
                id="tarifs"
                placeholder="Ex: 60€ / consultation"
                value={formData.tarifs}
                onChange={(e) => setFormData({ ...formData, tarifs: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            Créer mon profil professionnel
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            En continuant, vous acceptez nos{" "}
            <button type="button" onClick={() => navigate("/terms")} className="text-primary underline">
              Conditions d'utilisation
            </button>{" "}
            et notre{" "}
            <button type="button" onClick={() => navigate("/privacy")} className="text-primary underline">
              Politique de confidentialité
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalSignUp;
