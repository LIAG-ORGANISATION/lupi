import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [breeds, setBreeds] = useState<{ id: string; fr_name: string }[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    neutered: "",
    photoFile: null as File | null,
  });

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoadingBreeds(true);
      try {
        const { data, error } = await supabase
          .from('breeds')
          .select('id, fr_name')
          .order('fr_name');

        if (error) throw error;

        setBreeds(data || []);
      } catch (error) {
        console.error('[AddDog] Error fetching breeds:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des races.",
          variant: "destructive",
        });
      } finally {
        setLoadingBreeds(false);
      }
    };

    fetchBreeds();
  }, [toast]);

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
      
      // Redirect to home page after creating dog
      navigate("/");
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
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Ajouter un chien</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="lupi-card" style={{ padding: '16px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Photo Upload */}
          <div className="flex flex-col items-center" style={{ gap: '12px' }}>
...
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label htmlFor="breed">Race supposée</Label>
            <Select
              value={formData.breed || ""}
              onValueChange={(value) => setFormData({ ...formData, breed: value })}
              disabled={loadingBreeds}
            >
              <SelectTrigger id="breed" className="rounded-2xl">
                <SelectValue placeholder="Ex: Golden Retriever" />
              </SelectTrigger>
              <SelectContent>
                {breeds.map((breed) => (
                  <SelectItem key={breed.id} value={breed.fr_name}>
                    {breed.fr_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="rounded-2xl"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
          {uploadingPhoto ? "Upload de la photo..." : loading ? "Ajout en cours..." : "Ajouter mon chien"}
        </Button>
      </form>
    </div>
  );
};

export default AddDog;
