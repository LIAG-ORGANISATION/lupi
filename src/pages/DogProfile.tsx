import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, FileText, Syringe, Dog as DogIcon, Plus, ExternalLink, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dog, setDog] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vaccinationPassport, setVaccinationPassport] = useState<any>(null);
  const [uploadingPassport, setUploadingPassport] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchDog();
      fetchVaccinationPassport();
    }
  }, [id, user]);

  const fetchDog = async () => {
    try {
      console.log('[DogProfile] Fetching dog:', id);
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;
      console.log('[DogProfile] Dog data:', data);
      setDog(data);
    } catch (error) {
      console.error('[DogProfile] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccinationPassport = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_documents')
        .select('*')
        .eq('dog_id', id)
        .eq('title', 'Passeport Vaccinal')
        .maybeSingle();

      if (error) throw error;
      setVaccinationPassport(data);
    } catch (error) {
      console.error('[DogProfile] Error fetching vaccination passport:', error);
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
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 Mo.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPassport(true);

    try {
      const fileExt = 'pdf';
      const fileName = `vaccination-passport-${Date.now()}.${fileExt}`;
      const storagePath = `${user?.id}/${id}/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("dog-documents")
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from("dog_documents")
        .insert({
          dog_id: id,
          owner_id: user?.id,
          title: 'Passeport Vaccinal',
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Passeport vaccinal ajouté",
        description: "Le document a été enregistré avec succès.",
      });

      fetchVaccinationPassport();
    } catch (error) {
      console.error('Error uploading vaccination passport:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'ajouter le passeport vaccinal.",
        variant: "destructive",
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
      const { data, error } = await supabase.storage
        .from("dog-documents")
        .createSignedUrl(vaccinationPassport.storage_path, 300);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error) {
      console.error('Error opening passport:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document.",
        variant: "destructive",
      });
    }
  };

  const handleSharePassport = () => {
    toast({
      title: "Partage",
      description: "Fonction de partage à venir",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="min-h-screen p-4 space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dogs")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Card className="p-6 rounded-3xl text-center">
          <p className="text-muted-foreground">Chien introuvable</p>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-title">Profil de {dog.name}</h1>
      </div>

      <Card className="p-6 rounded-3xl text-center space-y-4">
        {dog.avatar_url ? (
          <img
            src={dog.avatar_url}
            alt={dog.name}
            className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <DogIcon className="h-16 w-16 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-title">{dog.name}</h2>
          {dog.breed && <p className="text-muted-foreground">{dog.breed}</p>}
          {dog.gender && (
            <p className="text-sm text-muted-foreground capitalize">{dog.gender === 'male' ? 'Mâle' : 'Femelle'}</p>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Résumé des tests</h3>
        
        {/* Test ADN - à compléter */}
        <Card className="p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-title">Analyse ADN</h4>
            <p className="text-sm text-muted-foreground">Non effectué</p>
          </div>
          <Button
            onClick={() => navigate("/dna-kit")}
            className="rounded-full"
          >
            Commander
          </Button>
        </Card>

        {/* Questionnaire comportemental - à compléter */}
        <Card className="p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-title">Questionnaire comportemental</h4>
            <p className="text-sm text-muted-foreground">Non effectué</p>
          </div>
          <Button 
            onClick={() => navigate("/questionnaire")}
            className="rounded-full"
          >
            Commencer
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Informations clés</h3>
        
        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Informations</h4>
              {dog.birth_date && (
                <p className="text-sm text-foreground">Né le {new Date(dog.birth_date).toLocaleDateString('fr-FR')}</p>
              )}
              {dog.weight && (
                <p className="text-sm text-foreground">Poids: {dog.weight} kg</p>
              )}
              {dog.medical_notes && (
                <p className="text-sm text-foreground mt-2">{dog.medical_notes}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all"
          onClick={() => navigate("/guardian/documents")}
        >
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

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Alertes santé</h4>
              <p className="text-sm text-green-600">Aucune anomalie détectée</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all"
          onClick={vaccinationPassport ? handleOpenPassport : handlePassportUpload}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Syringe className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Passeport vaccinal</h4>
              <p className="text-sm text-muted-foreground">
                {vaccinationPassport 
                  ? "Accès rapide aux vaccinations" 
                  : "Ajouter le passeport vaccinal"}
              </p>
            </div>
            {vaccinationPassport ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPassport();
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSharePassport();
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="rounded-full"
                disabled={uploadingPassport}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePassportUpload();
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                {uploadingPassport ? "Upload..." : "Ajouter"}
              </Button>
            )}
          </div>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Calendrier</h4>
              <p className="text-sm text-foreground">Rappels & rapports à venir</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DogProfile;
