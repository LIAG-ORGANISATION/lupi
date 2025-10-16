import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, FileText, Syringe, Dog as DogIcon, Plus, ExternalLink, Share2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
interface DogData {
  id: string;
  name: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  weight: number | null;
  avatar_url: string | null;
  medical_notes: string | null;
}
const DogProfile = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [dog, setDog] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vaccinationPassport, setVaccinationPassport] = useState<any>(null);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [healthAlertsCount, setHealthAlertsCount] = useState(0);
  const [vaccinationDocsCount, setVaccinationDocsCount] = useState(0);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showEditInfoDialog, setShowEditInfoDialog] = useState(false);
  const [editInfo, setEditInfo] = useState({
    breed: "",
    weight: "",
    birth_date: "",
    gender: "",
    medical_notes: "",
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "reminder" as 'vaccination' | 'veterinary' | 'grooming' | 'training' | 'reminder' | 'other',
    event_date: format(new Date(), "yyyy-MM-dd"),
    event_time: "",
  });
  useEffect(() => {
    if (id && user) {
      fetchDog();
      fetchVaccinationPassport();
      fetchQuestionnaire();
      fetchHealthAlertsCount();
      fetchVaccinationDocsCount();
    }
  }, [id, user]);
  const fetchDog = async () => {
    try {
      console.log('[DogProfile] Fetching dog:', id);
      const {
        data,
        error
      } = await supabase.from('dogs').select('*').eq('id', id).eq('owner_id', user?.id).single();
      if (error) throw error;
      console.log('[DogProfile] Dog data:', data);
      setDog(data);
      setEditInfo({
        breed: data.breed || "",
        weight: data.weight?.toString() || "",
        birth_date: data.birth_date || "",
        gender: data.gender || "",
        medical_notes: data.medical_notes || "",
      });
    } catch (error) {
      console.error('[DogProfile] Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVaccinationPassport = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('dog_documents').select('*').eq('dog_id', id).eq('title', 'Passeport Vaccinal').maybeSingle();
      if (error) throw error;
      setVaccinationPassport(data);
    } catch (error) {
      console.error('[DogProfile] Error fetching vaccination passport:', error);
    }
  };
  const fetchQuestionnaire = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('dog_questionnaires').select('*').eq('dog_id', id).maybeSingle();
      if (error) throw error;
      setHasQuestionnaire(!!data);
      if (data) {
        setQuestionnaireData(data.questionnaire_data);
      }
    } catch (error) {
      console.error('[DogProfile] Error fetching questionnaire:', error);
    }
  };
  const fetchHealthAlertsCount = async () => {
    try {
      const {
        count,
        error
      } = await supabase.from('dog_health_alerts').select('*', {
        count: 'exact',
        head: true
      }).eq('dog_id', id);
      if (error) throw error;
      setHealthAlertsCount(count || 0);
    } catch (error) {
      console.error('[DogProfile] Error fetching health alerts count:', error);
    }
  };
  const fetchVaccinationDocsCount = async () => {
    try {
      const {
        count,
        error
      } = await supabase.from('dog_documents').select('*', {
        count: 'exact',
        head: true
      }).eq('dog_id', id);
      if (error) throw error;
      setVaccinationDocsCount(count || 0);
    } catch (error) {
      console.error('[DogProfile] Error fetching vaccination docs count:', error);
    }
  };
  const handlePassportUpload = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({
        title: "Format non supporté",
        description: "Veuillez uploader un fichier PDF.",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 Mo.",
        variant: "destructive"
      });
      return;
    }
    setUploadingPassport(true);
    try {
      const fileExt = 'pdf';
      const fileName = `vaccination-passport-${Date.now()}.${fileExt}`;
      const storagePath = `${user?.id}/${id}/${fileName}`;

      // Upload to Storage
      const {
        error: uploadError
      } = await supabase.storage.from("dog-documents").upload(storagePath, file);
      if (uploadError) throw uploadError;

      // Save metadata to database
      const {
        error: dbError
      } = await supabase.from("dog_documents").insert({
        dog_id: id,
        owner_id: user?.id,
        title: 'Passeport Vaccinal',
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath
      });
      if (dbError) throw dbError;
      toast({
        title: "Passeport vaccinal ajouté",
        description: "Le document a été enregistré avec succès."
      });
      fetchVaccinationPassport();
    } catch (error) {
      console.error('Error uploading vaccination passport:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'ajouter le passeport vaccinal.",
        variant: "destructive"
      });
    } finally {
      setUploadingPassport(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleOpenPassport = async () => {
    if (!vaccinationPassport) return;
    try {
      const {
        data,
        error
      } = await supabase.storage.from("dog-documents").createSignedUrl(vaccinationPassport.storage_path, 300);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error('Error opening passport:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document.",
        variant: "destructive"
      });
    }
  };
  const handleSharePassport = () => {
    toast({
      title: "Partage",
      description: "Fonction de partage à venir"
    });
  };
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez uploader une image (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 Mo.",
        variant: "destructive"
      });
      return;
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const storagePath = `${user.id}/${id}/${fileName}`;

      // Upload to Storage
      const {
        error: uploadError
      } = await supabase.storage.from('dog-documents').upload(storagePath, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('dog-documents').getPublicUrl(storagePath);

      // Update dog avatar_url in database
      const {
        error: updateError
      } = await supabase.from('dogs').update({
        avatar_url: publicUrl
      }).eq('id', id).eq('owner_id', user.id);
      if (updateError) throw updateError;

      // Update local state
      setDog(prev => prev ? {
        ...prev,
        avatar_url: publicUrl
      } : null);
      toast({
        title: "Photo mise à jour",
        description: "La photo de profil a été modifiée avec succès."
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible de mettre à jour la photo.",
        variant: "destructive"
      });
    } finally {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };
  
  const handleUpdateInfo = async () => {
    try {
      const { error } = await supabase
        .from("dogs")
        .update({
          breed: editInfo.breed || null,
          weight: editInfo.weight ? parseFloat(editInfo.weight) : null,
          birth_date: editInfo.birth_date || null,
          gender: editInfo.gender || null,
          medical_notes: editInfo.medical_notes || null,
        })
        .eq("id", id)
        .eq("owner_id", user?.id);

      if (error) throw error;

      // Update local state
      setDog((prev) =>
        prev
          ? {
              ...prev,
              breed: editInfo.breed || null,
              weight: editInfo.weight ? parseFloat(editInfo.weight) : null,
              birth_date: editInfo.birth_date || null,
              gender: editInfo.gender || null,
              medical_notes: editInfo.medical_notes || null,
            }
          : null
      );

      toast({
        title: "Informations mises à jour",
        description: "Les informations ont été modifiées avec succès",
      });

      setShowEditInfoDialog(false);
    } catch (error) {
      console.error("Error updating info:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("dog_calendar_events").insert({
        dog_id: id,
        owner_id: user?.id,
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
        event_time: "" 
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'événement",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!dog) {
    return <div className="min-h-screen p-4 space-y-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card className="p-6 rounded-3xl text-center">
          <p className="text-muted-foreground">Chien introuvable</p>
        </Card>
      </div>;
  }
  return <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Profil de {dog.name}</h1>
      </div>

      <Card className="lupi-card text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          {dog.avatar_url ? <img src={dog.avatar_url} alt={dog.name} className="w-32 h-32 rounded-full object-cover shadow-lg" /> : <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <DogIcon className="h-16 w-16 text-primary" />
            </div>}
          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
            <Camera className="h-5 w-5" />
            <input id="avatar-upload" ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-title">{dog.name}</h2>
          {dog.breed && <p className="text-muted-foreground">{dog.breed}</p>}
          {dog.gender && <p className="text-sm text-muted-foreground capitalize">{dog.gender === 'male' ? 'Mâle' : 'Femelle'}</p>}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Résumé des tests</h3>
        
        {/* Test ADN - à compléter */}
        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title">Analyse ADN</h4>
              <p className="text-sm text-muted-foreground">Non effectué</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => navigate("/dna-kit")} className="rounded-full">
                Commander
              </Button>
              <Button onClick={() => navigate("/dna-demo")} variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                Voir une démo
              </Button>
            </div>
            <Button onClick={() => navigate("/recommendations-demo")} variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/10">
              Voir recommandations personnalisées
            </Button>
          </div>
        </Card>

        {/* Questionnaire comportemental */}
        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${hasQuestionnaire ? 'bg-green-100' : 'bg-orange-100'} flex items-center justify-center flex-shrink-0`}>
              <CheckCircle2 className={`h-6 w-6 ${hasQuestionnaire ? 'text-green-500' : 'text-orange-500'}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title">Questionnaire comportemental</h4>
              <p className="text-sm text-muted-foreground">{hasQuestionnaire ? 'Effectué' : 'Non effectué'}</p>
            </div>
            {hasQuestionnaire ? (
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate(`/questionnaire-results/${id}`)} 
                  variant="outline" 
                  className="rounded-full"
                  size="sm"
                >
                  Voir
                </Button>
                <Button 
                  onClick={() => navigate(`/questionnaire?dogId=${id}`)} 
                  className="rounded-full"
                  size="sm"
                >
                  Modifier
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate(`/questionnaire?dogId=${id}`)} 
                className="rounded-full"
              >
                Commencer
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Informations clés</h3>
        
        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-yellow-100">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-title">Informations</h4>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => setShowEditInfoDialog(true)}
                >
                  Modifier
                </Button>
              </div>
              {dog.breed && <p className="text-sm text-foreground">Race: {dog.breed}</p>}
              {dog.gender && <p className="text-sm text-foreground">Sexe: {dog.gender === 'male' ? 'Mâle' : 'Femelle'}</p>}
              {dog.birth_date && <p className="text-sm text-foreground">Né le {new Date(dog.birth_date).toLocaleDateString('fr-FR')}</p>}
              {dog.weight && <p className="text-sm text-foreground">Poids: {dog.weight} kg</p>}
              {dog.medical_notes && <p className="text-sm text-foreground mt-2">{dog.medical_notes}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/guardian/documents")}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Documents</h4>
              <p className="text-sm text-muted-foreground">Ordonnances, analyses, certificats</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/health-alerts/${id}`)}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Alertes santé</h4>
              <p className={`text-sm ${healthAlertsCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {healthAlertsCount === 0 ? 'Aucune anomalie détectée' : `${healthAlertsCount} ${healthAlertsCount === 1 ? 'alerte' : 'alertes'}`}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/dogs/${id}/vaccination-passport`)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Syringe className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Passeport vaccinal</h4>
              <p className="text-sm text-muted-foreground">
                {vaccinationDocsCount === 0 ? "Aucun document" : `${vaccinationDocsCount} ${vaccinationDocsCount === 1 ? 'document' : 'documents'}`}
              </p>
            </div>
            <Button size="sm" variant="outline" className="rounded-full">
              Ouvrir
            </Button>
          </div>
        </Card>

        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/dogs/${id}/calendar`)}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Calendrier</h4>
              <p className="text-sm text-foreground">Rappels, rendez-vous & événements</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddEventDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </Card>
      </div>

      {/* Dialog pour modifier les informations */}
      <Dialog open={showEditInfoDialog} onOpenChange={setShowEditInfoDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier les informations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Race</label>
              <Input
                value={editInfo.breed}
                onChange={(e) => setEditInfo({ ...editInfo, breed: e.target.value })}
                placeholder="Ex: Labrador"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Sexe</label>
              <Select
                value={editInfo.gender}
                onValueChange={(value) => setEditInfo({ ...editInfo, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Mâle</SelectItem>
                  <SelectItem value="female">Femelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date de naissance</label>
              <Input
                type="date"
                value={editInfo.birth_date}
                onChange={(e) => setEditInfo({ ...editInfo, birth_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Poids (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={editInfo.weight}
                onChange={(e) => setEditInfo({ ...editInfo, weight: e.target.value })}
                placeholder="Ex: 25.5"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notes médicales</label>
              <Textarea
                value={editInfo.medical_notes}
                onChange={(e) => setEditInfo({ ...editInfo, medical_notes: e.target.value })}
                placeholder="Informations médicales importantes..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateInfo} className="flex-1 rounded-full">
                Enregistrer
              </Button>
              <Button
                onClick={() => setShowEditInfoDialog(false)}
                variant="outline"
                className="flex-1 rounded-full"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un événement */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Type d'événement *</label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value: typeof newEvent.event_type) =>
                  setNewEvent({ ...newEvent, event_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="veterinary">Vétérinaire</SelectItem>
                  <SelectItem value="grooming">Toilettage</SelectItem>
                  <SelectItem value="training">Éducation</SelectItem>
                  <SelectItem value="reminder">Rappel</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
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
    </div>;
};
export default DogProfile;