import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, FileText, Syringe } from "lucide-react";
import buddyImage from "@/assets/dog-buddy.jpg";

const DogProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
        <h1 className="text-2xl font-bold text-title">Profil de Buddy</h1>
      </div>

      <Card className="p-6 rounded-3xl text-center space-y-4">
        <img
          src={buddyImage}
          alt="Buddy"
          className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-title">Buddy</h2>
          <p className="text-muted-foreground">Golden Retriever</p>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-title">Résumé des tests</h3>
        <Card className="p-4 rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div className="flex-1">
            <h4 className="font-semibold text-title">Test ADN</h4>
            <p className="text-sm text-muted-foreground">Terminé</p>
          </div>
          <Button
            onClick={() => navigate(`/dogs/${id}/dna-results`)}
            variant="outline"
            className="rounded-full"
          >
            Voir
          </Button>
        </Card>

        <Card className="p-4 rounded-2xl flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div className="flex-1">
            <h4 className="font-semibold text-title">Test Comportement</h4>
            <p className="text-sm text-muted-foreground">Terminé</p>
          </div>
          <Button variant="outline" className="rounded-full">
            Voir
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
              <h4 className="font-semibold text-title mb-1">Composition de race</h4>
              <p className="text-sm text-foreground">50% Golden Retriever, 50% Labrador</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Alertes santé</h4>
              <p className="text-sm text-green-600">Aucune anomalie détectée</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Profil comportemental</h4>
              <p className="text-sm text-foreground">Confiant et joueur</p>
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

        <Card className="p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Syringe className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-title mb-1">Passeport vaccinal</h4>
              <p className="text-sm text-foreground">Accès rapide aux vaccinations</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DogProfile;
