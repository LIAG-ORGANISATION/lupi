import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, FileText, Syringe, Dog as DogIcon, Plus, ExternalLink, Share2, Camera, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { MedicationsManager } from "@/components/MedicationsManager";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editInfo, setEditInfo] = useState({
    breed: "",
    weight: "",
    birth_date: "",
    gender: "",
    medical_notes: ""
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "reminder" as 'vaccination' | 'veterinary' | 'grooming' | 'training' | 'reminder' | 'other',
    event_date: format(new Date(), "yyyy-MM-dd"),
    event_time: ""
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
        medical_notes: data.medical_notes || ""
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
      const {
        error
      } = await supabase.from("dogs").update({
        breed: editInfo.breed || null,
        weight: editInfo.weight ? parseFloat(editInfo.weight) : null,
        birth_date: editInfo.birth_date || null,
        gender: editInfo.gender || null,
        medical_notes: editInfo.medical_notes || null
      }).eq("id", id).eq("owner_id", user?.id);
      if (error) throw error;

      // Update local state
      setDog(prev => prev ? {
        ...prev,
        breed: editInfo.breed || null,
        weight: editInfo.weight ? parseFloat(editInfo.weight) : null,
        birth_date: editInfo.birth_date || null,
        gender: editInfo.gender || null,
        medical_notes: editInfo.medical_notes || null
      } : null);
      toast({
        title: "Informations mises à jour",
        description: "Les informations ont été modifiées avec succès"
      });
      setShowEditInfoDialog(false);
    } catch (error) {
      console.error("Error updating info:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive"
      });
    }
  };
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from("dog_calendar_events").insert({
        dog_id: id,
        owner_id: user?.id,
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time || null,
        event_type: newEvent.event_type,
        status: "upcoming"
      });
      if (error) throw error;
      toast({
        title: "Événement ajouté",
        description: "L'événement a été ajouté au calendrier"
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
        variant: "destructive"
      });
    }
  };

  const handleDeleteDog = async () => {
    if (!user || !id) return;

    try {
      const { error } = await supabase
        .from("dogs")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Profil supprimé",
        description: "Le profil de votre chien a été supprimé avec succès"
      });
      
      navigate("/guardian-dashboard");
    } catch (error) {
      console.error("Error deleting dog:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive"
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
  return <div className="min-h-screen animate-fade-in" style={{
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }}>
      {/* Hero Image with Overlay */}
      <div style={{
      position: 'relative',
      width: '100%',
      height: '280px',
      overflow: 'hidden'
    }}>
        <Button variant="ghost" size="icon" onClick={() => navigate('/dogs')} style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '12px'
      }}>
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowDeleteDialog(true)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '12px'
          }}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        
        {dog.avatar_url ? <img src={dog.avatar_url} alt={dog.name} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }} /> : <div style={{
        width: '100%',
        height: '100%',
        background: 'hsl(0 0% 96%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
            <DogIcon className="h-24 w-24" style={{
          color: 'hsl(240 6% 11%)'
        }} strokeWidth={1.5} />
          </div>}
        
        <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px'
      }}>
          <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
            {dog.name}
          </h1>
          <p style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#FFFFFF',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
            {dog.breed || 'Chien'}{dog.gender && ` • ${dog.gender === 'male' ? 'Mâle' : 'Femelle'}`}
          </p>
        </div>
        
        <label htmlFor="avatar-upload" style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        width: '48px',
        height: '48px',
        backgroundColor: '#5B9D8C',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
          <Camera className="h-5 w-5" strokeWidth={1.5} />
          <input id="avatar-upload" ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      <div style={{
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'hsl(240 6% 11%)'
        }}>Résumé des tests</h4>
        
        {/* Test ADN - à compléter */}
        <Card className="n26-card">
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container flex-shrink-0">
              <CheckCircle2 strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'hsl(240 6% 11%)'
              }}>Analyse ADN</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(240 3% 57%)'
              }}>Non effectué</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => navigate("/dna-kit")} className="btn-action">
                Commander
              </Button>
              <Button onClick={() => navigate("/dna-demo")} variant="outline" style={{
                borderRadius: '12px'
              }}>
                Voir une démo
              </Button>
            </div>
            <Button onClick={() => navigate("/recommendations-demo")} variant="outline" className="w-full" style={{
              borderRadius: '12px'
            }}>
              Voir recommandations personnalisées
            </Button>
          </div>
        </Card>

        {/* Questionnaire comportemental */}
        <Card className="n26-card">
          <div className="flex items-center gap-4">
            <div className="icon-container flex-shrink-0">
              <CheckCircle2 strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'hsl(240 6% 11%)'
              }}>Questionnaire comportemental</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(240 3% 57%)'
              }}>{hasQuestionnaire ? 'Effectué' : 'Non effectué'}</p>
            </div>
            {hasQuestionnaire ? <div className="flex gap-2">
                <Button onClick={() => navigate(`/questionnaire-results/${id}`)} variant="outline" style={{
                borderRadius: '12px'
              }} size="sm">
                  Voir
                </Button>
                <Button onClick={() => navigate(`/questionnaire?dogId=${id}`)} style={{
                borderRadius: '12px'
              }} size="sm">
                  Modifier
                </Button>
              </div> : <Button onClick={() => navigate(`/questionnaire?dogId=${id}`)} className="btn-action">
                Commencer
              </Button>}
          </div>
        </Card>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 500,
          color: 'hsl(240 6% 11%)'
        }}>Informations clés</h3>
        
        <Card className="n26-card">
          <div className="flex items-start gap-3">
            <div className="icon-container flex-shrink-0">
              <FileText strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: 'hsl(240 6% 11%)'
                }}>Informations</h4>
                <Button size="sm" variant="outline" style={{
                  borderRadius: '16px'
                }} onClick={() => setShowEditInfoDialog(true)}>
                  Modifier
                </Button>
              </div>
              {dog.breed && <p style={{
                fontSize: '14px',
                color: 'hsl(240 6% 11%)'
              }}>Race: {dog.breed}</p>}
              {dog.gender && <p style={{
                fontSize: '14px',
                color: 'hsl(240 6% 11%)'
              }}>Sexe: {dog.gender === 'male' ? 'Mâle' : 'Femelle'}</p>}
              {dog.birth_date && <p style={{
                fontSize: '14px',
                color: 'hsl(240 6% 11%)'
              }}>Né le {new Date(dog.birth_date).toLocaleDateString('fr-FR')}</p>}
              {dog.weight && <p style={{
                fontSize: '14px',
                color: 'hsl(240 6% 11%)'
              }}>Poids: {dog.weight} kg</p>}
              {dog.medical_notes && <p className="mt-2" style={{
                fontSize: '14px',
                color: 'hsl(240 6% 11%)'
              }}>{dog.medical_notes}</p>}
            </div>
          </div>
        </Card>

        <Card className="n26-card cursor-pointer hover:border-primary transition-all" onClick={() => navigate("/guardian/documents")}>
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <FileText strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
                color: 'hsl(240 6% 11%)'
              }}>Documents</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(240 3% 57%)'
              }}>Ordonnances, analyses, certificats</p>
            </div>
            <Button size="sm" variant="outline" style={{
              borderRadius: '16px'
            }}>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </Card>

        <Card className="n26-card cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/health-alerts/${id}`)}>
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <CheckCircle2 strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
                color: 'hsl(240 6% 11%)'
              }}>Alertes santé</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: healthAlertsCount === 0 ? 'hsl(166 44% 48%)' : 'hsl(9 48% 56%)'
              }}>
                {healthAlertsCount === 0 ? 'Aucune anomalie détectée' : `${healthAlertsCount} ${healthAlertsCount === 1 ? 'alerte' : 'alertes'}`}
              </p>
            </div>
            <Button size="sm" variant="outline" style={{
              borderRadius: '16px'
            }}>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </Card>

        <Card className="n26-card cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/dogs/${id}/vaccination-passport`)}>
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Syringe strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
                color: 'hsl(240 6% 11%)'
              }}>Passeport vaccinal</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(240 3% 57%)'
              }}>
                {vaccinationDocsCount === 0 ? "Aucun document" : `${vaccinationDocsCount} ${vaccinationDocsCount === 1 ? 'document' : 'documents'}`}
              </p>
            </div>
            <Button size="sm" variant="outline" style={{
              borderRadius: '16px'
            }}>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </Card>

        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />

        <Card className="n26-card cursor-pointer hover:border-primary transition-all" onClick={() => navigate(`/dogs/${id}/calendar`)}>
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Calendar strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '4px',
                color: 'hsl(240 6% 11%)'
              }}>Calendrier</h4>
              <p style={{
                fontSize: '12px',
                fontWeight: 300,
                color: 'hsl(240 3% 57%)'
              }}>Rappels, rendez-vous & événements</p>
            </div>
            <Button size="sm" variant="outline" style={{
              borderRadius: '16px'
            }}>
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </Card>
      </div>

      </div>

      {/* Medications Manager */}
      {user && <MedicationsManager dogId={id!} ownerId={user.id} className="mx-[21px]" />}

      {/* Dialog pour modifier les informations */}
      <Dialog open={showEditInfoDialog} onOpenChange={setShowEditInfoDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier les informations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Race</label>
              <Input value={editInfo.breed} onChange={e => setEditInfo({
              ...editInfo,
              breed: e.target.value
            })} placeholder="Ex: Labrador" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Sexe</label>
              <Select value={editInfo.gender} onValueChange={value => setEditInfo({
              ...editInfo,
              gender: value
            })}>
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
              <Input type="date" value={editInfo.birth_date} onChange={e => setEditInfo({
              ...editInfo,
              birth_date: e.target.value
            })} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Poids (kg)</label>
              <Input type="number" step="0.1" value={editInfo.weight} onChange={e => setEditInfo({
              ...editInfo,
              weight: e.target.value
            })} placeholder="Ex: 25.5" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notes médicales</label>
              <Textarea value={editInfo.medical_notes} onChange={e => setEditInfo({
              ...editInfo,
              medical_notes: e.target.value
            })} placeholder="Informations médicales importantes..." rows={4} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateInfo} className="flex-1 btn-action">
                Enregistrer
              </Button>
              <Button onClick={() => setShowEditInfoDialog(false)} variant="outline" className="flex-1" style={{
              borderRadius: '12px'
            }}>
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
              <Select value={newEvent.event_type} onValueChange={(value: typeof newEvent.event_type) => setNewEvent({
              ...newEvent,
              event_type: value
            })}>
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
              <Input value={newEvent.title} onChange={e => setNewEvent({
              ...newEvent,
              title: e.target.value
            })} placeholder="Ex: Rappel vaccin" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Date *</label>
              <Input type="date" value={newEvent.event_date} onChange={e => setNewEvent({
              ...newEvent,
              event_date: e.target.value
            })} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Heure (optionnel)</label>
              <Input type="time" value={newEvent.event_time} onChange={e => setNewEvent({
              ...newEvent,
              event_time: e.target.value
            })} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description (optionnel)</label>
              <Textarea value={newEvent.description} onChange={e => setNewEvent({
              ...newEvent,
              description: e.target.value
            })} placeholder="Détails supplémentaires..." rows={3} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex-1">
                Ajouter
              </Button>
              <Button onClick={() => setShowAddEventDialog(false)} variant="outline" className="flex-1">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le profil de {dog?.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce chien (documents, rendez-vous, historique médical) seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default DogProfile;