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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Vaccination = Database['public']['Tables']['dog_vaccinations']['Row'];

const VaccinationCalendar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState<Date>();
  const [reminders, setReminders] = useState<Date[]>([]);
  const [currentReminderDate, setCurrentReminderDate] = useState<Date>();

  useEffect(() => {
    if (id && user) {
      fetchVaccinations();
    }
  }, [id, user]);

  const fetchVaccinations = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_vaccinations')
        .select('*')
        .eq('dog_id', id)
        .order('vaccination_date', { ascending: false });

      if (error) throw error;
      setVaccinations(data || []);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = () => {
    if (currentReminderDate) {
      setReminders([...reminders, currentReminderDate]);
      setCurrentReminderDate(undefined);
    }
  };

  const handleRemoveReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!vaccineName || !vaccinationDate) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('dog_vaccinations')
        .insert({
          dog_id: id,
          vaccine_name: vaccineName,
          vaccination_date: format(vaccinationDate, 'yyyy-MM-dd'),
          reminders: reminders.map(date => format(date, 'yyyy-MM-dd')),
          owner_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Vaccination ajoutée",
        description: "Le vaccin a été enregistré avec succès.",
      });

      setDialogOpen(false);
      setVaccineName("");
      setVaccinationDate(undefined);
      setReminders([]);
      fetchVaccinations();
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la vaccination.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVaccination = async (vaccinationId: string) => {
    try {
      const { error } = await supabase
        .from('dog_vaccinations')
        .delete()
        .eq('id', vaccinationId);

      if (error) throw error;

      toast({
        title: "Vaccination supprimée",
        description: "Le vaccin a été supprimé avec succès.",
      });

      fetchVaccinations();
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vaccination.",
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
            onClick={() => navigate(`/dogs/${id}`)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Calendrier de vaccination</h1>
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
              <DialogTitle>Ajouter une vaccination</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaccine-name">Nom du vaccin</Label>
                <Input
                  id="vaccine-name"
                  placeholder="Ex: Rage, DHPP..."
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date de vaccination</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !vaccinationDate && "text-muted-foreground"
                      )}
                    >
                      {vaccinationDate ? (
                        format(vaccinationDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={vaccinationDate}
                      onSelect={setVaccinationDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Rappels</Label>
                {reminders.length > 0 && (
                  <div className="space-y-2">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm flex-1">
                          {format(reminder, "PPP", { locale: fr })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveReminder(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !currentReminderDate && "text-muted-foreground"
                        )}
                      >
                        {currentReminderDate ? (
                          format(currentReminderDate, "PPP", { locale: fr })
                        ) : (
                          <span>Date du rappel</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentReminderDate}
                        onSelect={setCurrentReminderDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="secondary"
                    onClick={handleAddReminder}
                    disabled={!currentReminderDate}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {vaccinations.length === 0 ? (
          <Card className="p-6 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucune vaccination enregistrée</p>
          </Card>
        ) : (
          vaccinations.map((vaccination) => (
            <Card key={vaccination.id} className="p-4 rounded-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-title mb-1">
                    {vaccination.vaccine_name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Date: {format(new Date(vaccination.vaccination_date), "PPP", { locale: fr })}
                  </p>
                  {vaccination.reminders && vaccination.reminders.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Rappels:</p>
                      {vaccination.reminders.map((reminder, index) => (
                        <p key={index} className="text-sm text-muted-foreground ml-2">
                          • {format(new Date(reminder), "PPP", { locale: fr })}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteVaccination(vaccination.id)}
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
