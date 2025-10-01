import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Dog as DogIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddDog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    neutered: "",
    photoFile: null as File | null,
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Le fichier doit être une image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5 Mo.",
        variant: "destructive",
      });
      return;
    }

    setFormData({ ...formData, photoFile: file });
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[AddDog] 🚀 Starting dog creation...');
    console.log('[AddDog] User:', user);
    
    if (!user) {
      console.error('[AddDog] ❌ No user found');
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un chien.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = null;

      // Upload photo if provided
      if (formData.photoFile) {
        setUploadingPhoto(true);
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('dog-documents')
          .upload(fileName, formData.photoFile);

        if (uploadError) {
          console.error('[AddDog] Photo upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('dog-documents')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
        setUploadingPhoto(false);
      }

      const dogData = {
        owner_id: user.id,
        name: formData.name,
        breed: formData.breed || null,
        gender: formData.sex || null,
        birth_date: formData.birthDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        avatar_url: avatarUrl,
      };
      
      console.log('[AddDog] 📝 Inserting dog data:', dogData);
      
      const { data, error } = await supabase
        .from('dogs')
        .insert(dogData)
        .select();

      console.log('[AddDog] Response:', { data, error });

      if (error) {
        console.error('[AddDog] ❌ Supabase error:', error);
        throw error;
      }

      console.log('[AddDog] ✅ Dog created successfully:', data);
      
      toast({
        title: "Profil créé !",
        description: `${formData.name} a été ajouté avec succès.`,
      });
      
      // Redirect to questionnaire if dog was created
      if (data && data[0]) {
        navigate(`/questionnaire?dogId=${data[0].id}`);
      } else {
        navigate("/dogs");
      }
    } catch (error) {
      console.error('[AddDog] 💥 Exception:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le chien.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dogs")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Ajouter un chien</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="lupi-card space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-32 h-32 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? (
                  <AvatarImage src={photoPreview} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-secondary">
                    <DogIcon className="h-16 w-16 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <p className="text-sm text-muted-foreground text-center">
              Ajoutez une photo de votre chien
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom du chien *</Label>
            <Input
              id="name"
              placeholder="Ex: Buddy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-2xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Race supposée</Label>
            <Input
              id="breed"
              placeholder="Ex: Golden Retriever"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Sexe</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.sex === "male" ? "default" : "outline"}
                className="flex-1 rounded-full"
                onClick={() => setFormData({ ...formData, sex: "male" })}
              >
                Mâle
              </Button>
              <Button
                type="button"
                variant={formData.sex === "female" ? "default" : "outline"}
                className="flex-1 rounded-full"
                onClick={() => setFormData({ ...formData, sex: "female" })}
              >
                Femelle
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Ex: 30"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Stérilisé ?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.neutered === "yes" ? "default" : "outline"}
                className="flex-1 rounded-full"
                onClick={() => setFormData({ ...formData, neutered: "yes" })}
              >
                Oui
              </Button>
              <Button
                type="button"
                variant={formData.neutered === "no" ? "default" : "outline"}
                className="flex-1 rounded-full"
                onClick={() => setFormData({ ...formData, neutered: "no" })}
              >
                Non
              </Button>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
          disabled={loading || uploadingPhoto}
        >
          {uploadingPhoto ? "Upload de la photo..." : loading ? "Ajout en cours..." : "Continuer vers le questionnaire"}
        </Button>
      </form>
    </div>
  );
};

export default AddDog;
