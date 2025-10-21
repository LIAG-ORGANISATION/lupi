import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, TestTube2, FileText, Calendar, Stethoscope, Heart, Dog as DogIcon, Trash2 } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Dog {
  id: string;
  name: string;
  breed: string | null;
  avatar_url: string | null;
}

const Dogs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; dogId: string | null; dogName: string | null }>({
    open: false,
    dogId: null,
    dogName: null,
  });

  useEffect(() => {
    console.log('[Dogs] 🔍 Checking user...', user);
    if (user) {
      fetchDogs();
    } else {
      console.log('[Dogs] ⚠️ No user, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  const fetchDogs = async () => {
    console.log('[Dogs] 📡 Fetching dogs for user:', user?.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, avatar_url')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      console.log('[Dogs] Response:', { data, error });

      if (error) throw error;
      console.log('[Dogs] ✅ Dogs loaded:', data?.length || 0);
      setDogs(data || []);
    } catch (error) {
      console.error('[Dogs] ❌ Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dogId: string) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', dogId);

      if (error) throw error;

      toast({
        title: "Chien supprimé",
        description: "Le profil a été supprimé avec succès.",
      });

      // Refresh the list
      setDogs(dogs.filter(d => d.id !== dogId));
      setDeleteDialog({ open: false, dogId: null, dogName: null });
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header médical */}
      <div className="bg-gradient-lupi p-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-white text-center">
            Mes chiens
          </h1>
          <p className="text-white/90 text-center mt-1" style={{ fontSize: '12px' }}>Gérez les profils de vos compagnons</p>
        </div>
      </div>

      <div className="px-4 space-y-6 max-w-4xl mx-auto">

        {!loading && dogs.length === 0 && (
          <div className="lupi-card text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
              <DogIcon className="h-10 w-10" style={{ color: 'hsl(20 28% 28%)' }} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-semibold text-title mb-2" style={{ fontSize: '18px' }}>
                Bienvenue sur Lupi
              </h2>
              <p className="text-muted-foreground mb-6" style={{ fontSize: '14px' }}>
                Créez un profil pour votre compagnon et suivez sa santé
              </p>
              <button
                onClick={() => navigate("/dogs/add")}
                className="btn-cta"
              >
                <Plus className="h-5 w-5 mr-2 inline" strokeWidth={1.5} />
                Ajouter mon premier chien
              </button>
            </div>
          </div>
        )}

        <div className="lupi-section-gap">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-title" style={{ fontSize: '18px' }}>Mes compagnons</h2>
            {dogs.length > 0 && (
              <button
                onClick={() => navigate("/dogs/add")}
                className="font-semibold hover:underline"
                style={{ color: 'hsl(9 48% 56%)', fontSize: '14px' }}
              >
                + Ajouter
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : dogs.length === 0 ? null : (
            <div className="space-y-4">
              {dogs.map((dog) => (
                <div
                  key={dog.id}
                  className="lupi-card cursor-pointer group"
                  onClick={() => navigate(`/dogs/${dog.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {dog.avatar_url ? (
                      <img
                        src={dog.avatar_url}
                        alt={dog.name}
                        className="w-16 h-16 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <DogIcon className="h-8 w-8" style={{ color: 'hsl(20 28% 28%)' }} strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-title" style={{ fontSize: '16px' }}>{dog.name}</h3>
                      {dog.breed && (
                        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{dog.breed}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialog({ open: true, dogId: dog.id, dogName: dog.name });
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {dogs.length > 0 && (
          <div className="lupi-section-gap">
            <h2 className="font-semibold text-title mb-4" style={{ fontSize: '18px' }}>Accès rapide</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                icon={Stethoscope}
                label="RDV"
                onClick={() => navigate("/professionals")}
              />
              <QuickActionCard
                icon={Calendar}
                label="Calendrier"
                onClick={() => navigate(dogs.length === 1 ? `/dogs/${dogs[0].id}` : "/dogs")}
              />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {deleteDialog.dogName} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce chien (questionnaires, vaccinations, documents, etc.) seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.dogId && handleDelete(deleteDialog.dogId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dogs;
