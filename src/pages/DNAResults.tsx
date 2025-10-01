import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BreedComposition {
  name: string;
  percentage: number;
  emoji: string;
  color: string;
}

interface HealthInfo {
  marker: string;
  status: string;
  description: string;
}

interface GeneticInfo {
  gene: string;
  status: string;
  description: string;
}

const DNAResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { id: dogId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dogData, setDogData] = useState<any>(null);

  // Example data - replace with actual data from database
  const breedComposition: BreedComposition[] = [
    { name: "Border Collie", percentage: 45, emoji: "🐕", color: "bg-blue-500" },
    { name: "Labrador", percentage: 26, emoji: "🦮", color: "bg-yellow-500" },
    { name: "Aussie", percentage: 11, emoji: "🐕‍🦺", color: "bg-purple-500" },
    { name: "Berger Allemand", percentage: 9.7, emoji: "🐺", color: "bg-green-500" },
    { name: "Collie", percentage: 8, emoji: "🦴", color: "bg-orange-500" },
  ];

  const healthInfo: HealthInfo[] = [
    {
      marker: "ALT",
      status: "Bas de référence",
      description: "Prévenez votre véto que ses valeurs de base peuvent être plus basses que la norme.",
    },
  ];

  const geneticInfo: GeneticInfo[] = [
    {
      gene: "DM (Myélopathie Dégénérative)",
      status: "Porteur sain",
      description: "1 copie → pas de symptômes attendus ; info utile pour l'élevage / conseil vétérinaire.",
    },
  ];

  useEffect(() => {
    const fetchDogData = async () => {
      if (!dogId || !user) return;

      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('*')
          .eq('id', dogId)
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setDogData(data);
      } catch (error) {
        console.error('Error fetching dog data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du chien.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDogData();
  }, [dogId, user]);

  const handleDownloadReport = () => {
    toast({
      title: "Bientôt disponible",
      description: "Le téléchargement du rapport PDF sera disponible prochainement.",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Bientôt disponible",
      description: "Le partage du rapport sera disponible prochainement.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dogData) {
    return (
      <div className="min-h-screen p-4">
        <p className="text-center text-muted-foreground">Chien non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-24">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/dogs/${dogId}`)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-title">Résultats ADN</h1>
          <p className="text-sm text-muted-foreground">{dogData.name}</p>
        </div>
      </div>

      {/* Composition de race */}
      <Card className="p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-title">Composition de race</h2>
        <p className="text-sm text-muted-foreground">
          Analyse génétique des races détectées
        </p>
        
        <div className="space-y-3">
          {breedComposition.map((breed, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-3xl">{breed.emoji}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-title">{breed.name}</span>
                  <span className="font-bold text-primary">{breed.percentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${breed.color} rounded-full transition-all duration-500`}
                    style={{ width: `${breed.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Santé */}
      <Card className="p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-title">Santé</h2>
        <p className="text-sm text-muted-foreground">
          Marqueurs génétiques de santé
        </p>
        
        <div className="space-y-3">
          {healthInfo.map((info, index) => (
            <Card key={index} className="p-4 rounded-2xl bg-secondary/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-title">{info.marker}</h3>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    {info.status}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{info.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Génétique */}
      <Card className="p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-title">Génétique</h2>
        <p className="text-sm text-muted-foreground">
          Mutations génétiques détectées
        </p>
        
        <div className="space-y-3">
          {geneticInfo.map((info, index) => (
            <Card key={index} className="p-4 rounded-2xl bg-secondary/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-title">{info.gene}</h3>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-medium">
                    {info.status}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{info.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Rapport PDF */}
      <Card className="p-6 rounded-3xl space-y-4 bg-gradient-to-br from-primary/10 to-secondary">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 mx-auto text-primary" />
          <div>
            <h3 className="text-lg font-bold text-title">Rapport complet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Téléchargez ou partagez le rapport PDF détaillé
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Fichier volumineux (environ 10 Mo)
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadReport}
              className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button 
              onClick={handleShareReport}
              variant="outline"
              className="flex-1 rounded-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>
      </Card>

      {/* Passeport vaccinal */}
      <Card className="p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-title">Passeport vaccinal</h2>
            <p className="text-sm text-muted-foreground">
              Documents de vaccination
            </p>
          </div>
          <Button
            onClick={() => navigate(`/dogs/${dogId}/vaccination-passport`)}
            size="sm"
            className="rounded-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Ouvrir
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DNAResults;
