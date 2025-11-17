import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Plus, Trash2, Check, X, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
interface Medication {
  id: string;
  medication_name: string;
  dosage_detail: string;
  frequency: string;
  duration_days: number | null;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  active: boolean;
}
interface MedicationsManagerProps {
  dogId?: string;
  dogs?: {
    id: string;
    name: string;
    avatar_url: string | null;
  }[];
  ownerId: string;
  initialDialogOpen?: boolean;
  onDialogClose?: () => void;
  className?: string;
}
export const MedicationsManager = ({
  dogId,
  dogs,
  ownerId,
  initialDialogOpen = false,
  onDialogClose,
  className
}: MedicationsManagerProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(initialDialogOpen);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [medicationToReactivate, setMedicationToReactivate] = useState<Medication | null>(null);
  const [reactivateEndDate, setReactivateEndDate] = useState("");
  const [selectedDogId, setSelectedDogId] = useState(dogId || (dogs && dogs.length > 0 ? dogs[0].id : ""));
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage_detail: "",
    frequency: "",
    duration_days: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    notes: ""
  });
  useEffect(() => {
    if (selectedDogId) {
      fetchMedications();
    }
  }, [selectedDogId]);
  const fetchMedications = async () => {
    if (!selectedDogId) return;
    try {
      const {
        data,
        error
      } = await supabase.from("dog_medications").select("*").eq("dog_id", selectedDogId).order("start_date", {
        ascending: false
      });
      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!selectedDogId || !formData.medication_name || !formData.dosage_detail || !formData.frequency || !formData.start_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    try {
      const durationDays = formData.duration_days ? parseInt(formData.duration_days) : null;
      const endDate = durationDays ? format(addDays(new Date(formData.start_date), durationDays), "yyyy-MM-dd") : null;
      const {
        error
      } = await supabase.from("dog_medications").insert({
        dog_id: selectedDogId,
        owner_id: ownerId,
        medication_name: formData.medication_name,
        dosage_detail: formData.dosage_detail,
        frequency: formData.frequency,
        duration_days: durationDays,
        start_date: formData.start_date,
        end_date: endDate,
        notes: formData.notes || null,
        active: true
      });
      if (error) throw error;
      toast({
        title: "Traitement ajouté",
        description: "Le traitement a été enregistré avec succès"
      });
      setFormData({
        medication_name: "",
        dosage_detail: "",
        frequency: "",
        duration_days: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        notes: ""
      });
      setDialogOpen(false);
      if (onDialogClose) onDialogClose();
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le traitement",
        variant: "destructive"
      });
    }
  };
  const handleToggleActive = async (medicationId: string, currentActive: boolean) => {
    // If reactivating from history, open dialog to ask for end date
    if (!currentActive) {
      const med = medications.find(m => m.id === medicationId);
      if (med) {
        setMedicationToReactivate(med);
        setReactivateEndDate("");
        setReactivateDialogOpen(true);
      }
      return;
    }
    
    // If deactivating, proceed directly
    try {
      const {
        error
      } = await supabase.from("dog_medications").update({
        active: false
      }).eq("id", medicationId);
      if (error) throw error;
      toast({
        title: "Traitement désactivé"
      });
      fetchMedications();
    } catch (error) {
      console.error("Error toggling medication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleConfirmReactivate = async () => {
    if (!medicationToReactivate) return;
    
    if (!reactivateEndDate) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une date de fin",
        variant: "destructive"
      });
      return;
    }

    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const endDate = new Date(reactivateEndDate);
      const startDate = new Date(today);
      
      if (endDate < startDate) {
        toast({
          title: "Erreur",
          description: "La date de fin doit être supérieure ou égale à la date de début",
          variant: "destructive"
        });
        return;
      }

      // Calculate duration_days if needed
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const {
        error
      } = await supabase.from("dog_medications").update({
        active: true,
        start_date: today,
        end_date: reactivateEndDate,
        duration_days: durationDays
      }).eq("id", medicationToReactivate.id);
      
      if (error) throw error;
      
      toast({
        title: "Traitement réactivé",
        description: "Le traitement a été réactivé avec succès"
      });
      
      setReactivateDialogOpen(false);
      setMedicationToReactivate(null);
      setReactivateEndDate("");
      setHistoryDialogOpen(false);
      fetchMedications();
    } catch (error) {
      console.error("Error reactivating medication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de réactiver le traitement",
        variant: "destructive"
      });
    }
  };
  const handleDelete = async (medicationId: string) => {
    try {
      const {
        error
      } = await supabase.from("dog_medications").delete().eq("id", medicationId);
      if (error) throw error;
      toast({
        title: "Traitement supprimé"
      });
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le traitement",
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return <Card className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>;
  }
  return <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-title flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          Traitements en cours
        </h3>
        <Dialog open={dialogOpen} onOpenChange={open => {
        setDialogOpen(open);
        if (!open && onDialogClose) onDialogClose();
      }}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau traitement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dogs && dogs.length > 0 && <div className="space-y-2">
                  <Label htmlFor="dog_select">Chien *</Label>
                  <Select value={selectedDogId} onValueChange={setSelectedDogId}>
                    <SelectTrigger id="dog_select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      {dogs.map(dog => <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center gap-2">
                            {dog.avatar_url ? <img src={dog.avatar_url} alt={dog.name} className="w-5 h-5 rounded-full object-cover" /> : <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-primary">{dog.name[0]}</span>
                              </div>}
                            <span>{dog.name}</span>
                          </div>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>}

              <div className="space-y-2">
                <Label htmlFor="medication_name">Nom du médicament *</Label>
                <Input id="medication_name" value={formData.medication_name} onChange={e => setFormData({
                ...formData,
                medication_name: e.target.value
              })} placeholder="Ex: Amoxicilline" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage_detail">Posologie détaillée *</Label>
                <Textarea id="dosage_detail" value={formData.dosage_detail} onChange={e => setFormData({
                ...formData,
                dosage_detail: e.target.value
              })} placeholder="Ex: 1 comprimé de 500mg" rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Fréquence de prise *</Label>
                <Input id="frequency" value={formData.frequency} onChange={e => setFormData({
                ...formData,
                frequency: e.target.value
              })} placeholder="Ex: 2 fois par jour (matin et soir)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début *</Label>
                <Input id="start_date" type="date" value={formData.start_date} onChange={e => setFormData({
                ...formData,
                start_date: e.target.value
              })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_days">Durée du traitement (en jours)</Label>
                <Input id="duration_days" type="number" min="1" value={formData.duration_days} onChange={e => setFormData({
                ...formData,
                duration_days: e.target.value
              })} placeholder="Ex: 7 pour une semaine" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes complémentaires</Label>
                <Textarea id="notes" value={formData.notes} onChange={e => setFormData({
                ...formData,
                notes: e.target.value
              })} placeholder="Instructions spéciales, précautions..." rows={3} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  Enregistrer
                </Button>
                <Button onClick={() => setDialogOpen(false)} variant="outline" className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {medications.length === 0 ? <Card className="p-6 text-center px-[23px] mx-[10px]">
          <Pill className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Aucun traitement enregistré</p>
        </Card> : <div className="space-y-2">
          {medications.map(med => <Card key={med.id} className={`p-4 ${!med.active ? 'opacity-60 bg-muted/30' : ''}`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-title">{med.medication_name}</h4>
                      {med.active ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Actif
                        </span> : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          Terminé
                        </span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{med.dosage_detail}</p>
                    <p className="text-sm text-foreground mt-1">
                      <span className="font-medium">Fréquence :</span> {med.frequency}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(med.id, med.active)} title={med.active ? "Marquer comme terminé" : "Réactiver"}>
                      {med.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(med.id)} title="Supprimer">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Début :</span>{" "}
                    {format(new Date(med.start_date), "d MMMM yyyy", {
                locale: fr
              })}
                  </p>
                  {med.end_date && <p>
                      <span className="font-medium">Fin :</span>{" "}
                      {format(new Date(med.end_date), "d MMMM yyyy", {
                locale: fr
              })}
                      {med.duration_days && ` (${med.duration_days} jours)`}
                    </p>}
                  {med.notes && <p className="text-muted-foreground mt-2 pt-2 border-t">
                      {med.notes}
                    </p>}
                </div>
              </div>
            </Card>)}
        </div>}
    </div>;
};