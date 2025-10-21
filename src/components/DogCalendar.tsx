import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Syringe, Stethoscope, Scissors, GraduationCap, Bell, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, addDays, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: 'vaccination' | 'veterinary' | 'grooming' | 'training' | 'reminder' | 'other';
  status: 'upcoming' | 'completed' | 'cancelled';
  dog_id?: string;
}

interface Dog {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface DogCalendarProps {
  dogId?: string; // Pour le mode single dog
  dogIds?: string[]; // Pour le mode multi dogs
  dogs?: Dog[]; // Pour afficher les avatars
  ownerId: string;
  compact?: boolean; // Pour afficher seulement 2 semaines
}

const eventTypeIcons = {
  vaccination: Syringe,
  veterinary: Stethoscope,
  grooming: Scissors,
  training: GraduationCap,
  reminder: Bell,
  other: MoreHorizontal,
};

const eventTypeColors = {
  vaccination: "text-green-600 bg-green-50",
  veterinary: "text-blue-600 bg-blue-50",
  grooming: "text-purple-600 bg-purple-50",
  training: "text-orange-600 bg-orange-50",
  reminder: "text-yellow-600 bg-yellow-50",
  other: "text-gray-600 bg-gray-50",
};

const eventTypeLabels = {
  vaccination: "Vaccination",
  veterinary: "Vétérinaire",
  grooming: "Toilettage",
  training: "Éducation",
  reminder: "Rappel",
  other: "Autre",
};

export const DogCalendar = ({ dogId, dogIds, dogs, ownerId, compact = false }: DogCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "reminder" as CalendarEvent["event_type"],
    event_date: format(new Date(), "yyyy-MM-dd"),
    event_time: "",
    dog_id: dogId || (dogs && dogs.length > 0 ? dogs[0].id : ""),
  });
  const { toast } = useToast();

  // Determine which dog IDs to fetch events for
  const targetDogIds = dogId ? [dogId] : (dogIds || (dogs?.map(d => d.id) || []));

  useEffect(() => {
    fetchEvents();
  }, [currentDate, targetDogIds.join(',')]);

  const fetchEvents = async () => {
    if (targetDogIds.length === 0) return;
    
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from("dog_calendar_events")
        .select("id, title, description, event_date, event_time, event_type, status, dog_id")
        .in("dog_id", targetDogIds)
        .gte("event_date", format(start, "yyyy-MM-dd"))
        .lte("event_date", format(end, "yyyy-MM-dd"))
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents((data as CalendarEvent[]) || []);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.dog_id || !newEvent.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("dog_calendar_events").insert({
        dog_id: newEvent.dog_id,
        owner_id: ownerId,
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time || null,
        event_type: newEvent.event_type,
        status: "upcoming",
      });

      if (error) throw error;

      toast({
        title: "Événement ajouté",
        description: "L'événement a été ajouté au calendrier",
      });

      setShowAddEventDialog(false);
      setNewEvent({ 
        title: "", 
        description: "", 
        event_type: "reminder", 
        event_date: format(new Date(), "yyyy-MM-dd"), 
        event_time: "",
        dog_id: dogId || (dogs && dogs.length > 0 ? dogs[0].id : ""),
      });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async () => {
    if (!eventToEdit) return;

    try {
      const { error } = await supabase
        .from("dog_calendar_events")
        .update({
          title: eventToEdit.title,
          description: eventToEdit.description,
          event_date: eventToEdit.event_date,
          event_time: eventToEdit.event_time,
          event_type: eventToEdit.event_type,
        })
        .eq("id", eventToEdit.id);

      if (error) throw error;

      toast({
        title: "Événement modifié",
        description: "L'événement a été mis à jour",
      });

      setShowEditEventDialog(false);
      setEventToEdit(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'événement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const { error } = await supabase
        .from("dog_calendar_events")
        .delete()
        .eq("id", eventToDelete.id);

      if (error) throw error;

      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé du calendrier",
      });

      setShowDeleteDialog(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    }
  };

  const getDogForEvent = (eventDogId: string) => {
    return dogs?.find(d => d.id === eventDogId);
  };

  // Pour le mode compact, afficher seulement 2 semaines à venir
  const today = startOfToday();
  const calendarStart = compact ? today : startOfMonth(currentDate);
  const calendarEnd = compact ? addDays(today, 13) : endOfMonth(currentDate);
  const daysToDisplay = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.event_date), date)
    );
  };

  const upcomingEvents = events
    .filter((event) => 
      !isBefore(new Date(event.event_date), startOfDay(new Date())) && 
      event.status === "upcoming"
    )
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <Card className="p-4 rounded-xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-title flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {compact ? "Prochains jours" : "Calendrier"}
          </h3>
          {!compact ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium capitalize">
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate(new Date());
                setShowAddEventDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className={`grid ${compact ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
          {daysToDisplay.map((day) => {
            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            const isCurrentDay = isToday(day);

            return (
              <Dialog key={day.toISOString()}>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-1 rounded-lg text-sm relative
                      ${isCurrentDay ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary"}
                      ${hasEvents && !isCurrentDay ? "font-semibold" : ""}
                    `}
                  >
                    <div>{format(day, "d")}</div>
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              event.event_type === "vaccination" ? "bg-green-600" :
                              event.event_type === "veterinary" ? "bg-blue-600" :
                              event.event_type === "grooming" ? "bg-purple-600" :
                              event.event_type === "training" ? "bg-orange-600" :
                              event.event_type === "reminder" ? "bg-yellow-600" :
                              "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {format(day, "d MMMM yyyy", { locale: fr })}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {dayEvents.length > 0 ? (
                      <div className="space-y-2">
                        {dayEvents.map((event) => {
                          const Icon = eventTypeIcons[event.event_type];
                          const dog = getDogForEvent((event as any).dog_id);
                          return (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg ${eventTypeColors[event.event_type]}`}
                            >
                              <div className="flex items-start gap-2">
                                <Icon className="h-4 w-4 mt-0.5" />
                                {dog && (
                                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                    {dog.avatar_url ? (
                                      <img src={dog.avatar_url} alt={dog.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-primary">{dog.name[0]}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">{event.title}</div>
                                  {event.event_time && (
                                    <div className="text-xs opacity-80">
                                      {event.event_time}
                                    </div>
                                  )}
                                  {event.description && (
                                    <div className="text-xs mt-1 opacity-80">
                                      {event.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun événement ce jour
                      </p>
                    )}
                    <Button
                      onClick={() => {
                        setShowAddEventDialog(true);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un événement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card className="p-4 rounded-xl shadow-card">
          <h3 className="text-sm font-bold text-title mb-3">Prochains événements</h3>
          <div className="space-y-2">
            {upcomingEvents.map((event) => {
              const Icon = eventTypeIcons[event.event_type];
              const dog = getDogForEvent((event as any).dog_id);
              return (
                <div
                  key={event.id}
                  className={`p-2 rounded-lg text-sm ${eventTypeColors[event.event_type]}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {dog && (
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        {dog.avatar_url ? (
                          <img src={dog.avatar_url} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">{dog.name[0]}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="text-xs opacity-80">
                        {format(new Date(event.event_date), "d MMM", { locale: fr })}
                        {event.event_time && ` • ${event.event_time}`}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEventToEdit(event);
                          setShowEditEventDialog(true);
                        }}
                        className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEventToDelete(event);
                          setShowDeleteDialog(true);
                        }}
                        className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {dogs && dogs.length > 1 && (
              <div>
                <label className="text-sm font-medium mb-1 block">Chien *</label>
                <Select
                  value={newEvent.dog_id}
                  onValueChange={(value: string) =>
                    setNewEvent({ ...newEvent, dog_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dogs.map((dog) => (
                      <SelectItem key={dog.id} value={dog.id}>
                        <div className="flex items-center gap-2">
                          {dog.avatar_url && (
                            <img src={dog.avatar_url} alt={dog.name} className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span>{dog.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Type d'événement *</label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value: CalendarEvent["event_type"]) =>
                  setNewEvent({ ...newEvent, event_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Titre *</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Ex: Rappel vaccin"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date *</label>
              <Input
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Heure (optionnel)</label>
              <Input
                type="time"
                value={newEvent.event_time}
                onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description (optionnel)</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Détails supplémentaires..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex-1">
                Ajouter
              </Button>
              <Button
                onClick={() => setShowAddEventDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditEventDialog} onOpenChange={setShowEditEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
          </DialogHeader>
          {eventToEdit && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type d'événement *</label>
                <Select
                  value={eventToEdit.event_type}
                  onValueChange={(value: CalendarEvent["event_type"]) =>
                    setEventToEdit({ ...eventToEdit, event_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Titre *</label>
                <Input
                  value={eventToEdit.title}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, title: e.target.value })}
                  placeholder="Ex: Rappel vaccin"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Date *</label>
                <Input
                  type="date"
                  value={eventToEdit.event_date}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, event_date: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Heure (optionnel)</label>
                <Input
                  type="time"
                  value={eventToEdit.event_time || ""}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, event_time: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description (optionnel)</label>
                <Textarea
                  value={eventToEdit.description || ""}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, description: e.target.value })}
                  placeholder="Détails supplémentaires..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEditEvent} className="flex-1">
                  Enregistrer
                </Button>
                <Button
                  onClick={() => {
                    setShowEditEventDialog(false);
                    setEventToEdit(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'événement "{eventToDelete?.title}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" onClick={() => setEventToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="rounded-full bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
