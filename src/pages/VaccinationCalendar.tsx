import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalendarEntry {
  id: string;
  dog_id: string;
  event_date: string;
  description: string;
  created_at: string;
}

const VaccinationCalendar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id && user) {
      fetchEntries();
    }
  }, [id, user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_vaccinations')
        .select('*')
        .eq('dog_id', id)
        .order('vaccination_date', { ascending: false });

      if (error) throw error;
      
      const mappedEntries = (data || []).map(item => ({
        id: item.id,
        dog_id: item.dog_id,
        event_date: item.vaccination_date,
        description: item.vaccine_name,
        created_at: item.created_at
      }));
      
      setEntries(mappedEntries);
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!eventDate || !description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir la date et la description.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('dog_vaccinations')
        .insert({
          dog_id: id,
          vaccine_name: description,
          vaccination_date: eventDate,
          reminders: [],
          owner_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Événement ajouté",
        description: "L'événement a été enregistré avec succès.",
      });

      setDialogOpen(false);
      setEventDate("");
      setDescription("");
      fetchEntries();
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('dog_vaccinations')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès.",
      });

      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Calendrier</h1>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un événement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Ex: Vaccin rage, Rappel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card className="p-6 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucun événement enregistré</p>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4 rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {new Date(entry.event_date).toLocaleDateString('fr-FR')}
                  </p>
                  <h4 className="font-semibold text-title">
                    {entry.description}
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VaccinationCalendar;
