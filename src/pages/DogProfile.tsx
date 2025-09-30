import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, FileText, Syringe, Dog as DogIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  const [dog, setDog] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchDog();
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

        <Card className="p-4 rounded-2xl cursor-pointer hover:border-primary transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Syringe className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Passeport vaccinal</h4>
              <p className="text-sm text-muted-foreground">Accès rapide aux vaccinations</p>
            </div>
          </div>
        </Card>

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
