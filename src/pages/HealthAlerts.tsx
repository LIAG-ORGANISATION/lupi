import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
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

interface HealthAlert {
  id: string;
  alert_date: string;
  description: string;
  created_at: string;
}

const HealthAlerts = () => {
  const navigate = useNavigate();
  const { id: dogId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertDate, setAlertDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (dogId && user) {
      fetchAlerts();
    }
  }, [dogId, user]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("dog_health_alerts")
        .select("*")
        .eq("dog_id", dogId)
        .order("alert_date", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching health alerts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes de santé.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !dogId || !alertDate || !description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("dog_health_alerts")
        .insert({
          dog_id: dogId,
          owner_id: user.id,
          alert_date: alertDate,
          description: description.trim(),
        });

      if (error) throw error;

      toast({
        title: "Alerte ajoutée",
        description: "L'alerte de santé a été enregistrée.",
      });

      setAlertDate("");
      setDescription("");
      setIsDialogOpen(false);
      fetchAlerts();
    } catch (error) {
      console.error("Error adding health alert:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'alerte de santé.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("dog_health_alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;

      toast({
        title: "Alerte supprimée",
        description: "L'alerte de santé a été supprimée.",
      });
      fetchAlerts();
    } catch (error) {
      console.error("Error deleting health alert:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte.",
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/dogs/${dogId}`)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Alertes Santé</h1>
      </div>

      <Card className="p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-title">Incidents de santé</h2>
              <p className="text-sm text-muted-foreground">
                {alerts.length} {alerts.length === 1 ? "alerte" : "alertes"}
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle alerte de santé</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-date">Date de l'incident</Label>
                  <Input
                    id="alert-date"
                    type="date"
                    value={alertDate}
                    onChange={(e) => setAlertDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez l'incident de santé..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 rounded-full"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full"
                  >
                    {submitting ? "Ajout..." : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-6 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucune alerte de santé enregistrée</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="p-4 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-title">
                    {new Date(alert.alert_date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-foreground mt-1 break-words">
                    {alert.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthAlerts;
