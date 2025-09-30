import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AddDog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    neutered: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un chien.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('dogs')
        .insert({
          owner_id: user.id,
          name: formData.name,
          breed: formData.breed || null,
          gender: formData.sex || null,
          birth_date: formData.birthDate || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        });

      if (error) throw error;

      toast({
        title: "Profil créé !",
        description: `${formData.name} a été ajouté avec succès.`,
      });
      navigate("/dogs");
    } catch (error) {
      console.error('Error adding dog:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le chien. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
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
        <Card className="p-6 rounded-3xl space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du chien</Label>
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
          disabled={loading}
        >
          {loading ? "Ajout en cours..." : "Ajouter"}
        </Button>
      </form>
    </div>
  );
};

export default AddDog;
