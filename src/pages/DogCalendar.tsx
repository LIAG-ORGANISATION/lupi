import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Syringe, Stethoscope, Scissors, GraduationCap, Bell, MoreHorizontal, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DogCalendar as CalendarComponent } from "@/components/DogCalendar";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: 'vaccination' | 'veterinary' | 'grooming' | 'training' | 'reminder' | 'other';
  status: 'upcoming' | 'completed' | 'cancelled';
  medication_name?: string | null;
  medication_dosage?: string | null;
}

const eventTypeIcons = {
  vaccination: Syringe,
  veterinary: Stethoscope,
  grooming: Scissors,
  training: GraduationCap,
  reminder: Bell,
  other: MoreHorizontal,
};

const eventTypeLabels = {
  vaccination: "Vaccination",
  veterinary: "Vétérinaire",
  grooming: "Toilettage",
  training: "Éducation",
  reminder: "Rappel",
  other: "Autre",
};

const DogCalendarPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dogName, setDogName] = useState("");

  useEffect(() => {
    if (id && user) {
      fetchDogInfo();
      fetchAllEvents();
    }
  }, [id, user]);

  const fetchDogInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("dogs")
        .select("name")
        .eq("id", id)
        .eq("owner_id", user?.id)
        .single();

      if (error) throw error;
      setDogName(data.name);
    } catch (error) {
      console.error("Error fetching dog info:", error);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("dog_calendar_events")
        .select("id, title, description, event_date, event_time, event_type, status, medication_name, medication_dosage")
        .eq("dog_id", id)
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents((data as CalendarEvent[]) || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("dog_calendar_events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé du calendrier",
      });

      fetchAllEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("dog_calendar_events")
        .update({ status: "completed" })
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Événement complété",
        description: "L'événement a été marqué comme terminé",
      });

      fetchAllEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive",
      });
    }
  };

  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const completedEvents = events.filter((e) => e.status === "completed");

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-title">Calendrier de {dogName}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar Component */}
        {id && user && <CalendarComponent dogId={id} ownerId={user.id} />}

        {/* Upcoming Events List */}
        {upcomingEvents.length > 0 && (
          <Card className="p-4 rounded-xl shadow-card">
            <h3 className="text-lg font-bold text-title mb-3">Tous les événements à venir</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                const Icon = eventTypeIcons[event.event_type];
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-title">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.event_date), "d MMMM yyyy", { locale: fr })}
                          {event.event_time && ` • ${event.event_time}`}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {eventTypeLabels[event.event_type]}
                        </div>
                        {event.description && (
                          <div className="text-sm text-foreground mt-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkComplete(event.id)}
                          className="h-8 w-8"
                        >
                          ✓
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <Card className="p-4 rounded-xl shadow-card">
            <h3 className="text-lg font-bold text-title mb-3">Événements terminés</h3>
            <div className="space-y-2">
              {completedEvents.map((event) => {
                const Icon = eventTypeIcons[event.event_type];
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-muted/30 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-muted-foreground line-through">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(event.event_date), "d MMMM yyyy", { locale: fr })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {events.length === 0 && (
          <Card className="p-8 rounded-xl shadow-card text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-title mb-2">Aucun événement</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez à ajouter des rendez-vous, rappels et événements pour votre chien
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DogCalendarPage;
