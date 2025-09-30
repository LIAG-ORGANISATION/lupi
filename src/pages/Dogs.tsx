import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, TestTube2, FileText, Calendar, Stethoscope, Heart } from "lucide-react";
import QuickActionCard from "@/components/QuickActionCard";
import buddyImage from "@/assets/dog-buddy.jpg";
import lunaImage from "@/assets/dog-luna.jpg";

const Dogs = () => {
  const navigate = useNavigate();

  const dogs = [
    { 
      id: 1, 
      name: "Buddy", 
      status: "Test en cours",
      image: buddyImage,
      statusColor: "text-yellow-600"
    },
    { 
      id: 2, 
      name: "Luna", 
      status: "Test terminé",
      image: lunaImage,
      statusColor: "text-green-600"
    },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-title">Bienvenue</h1>
        <p className="text-muted-foreground">Gérez les profils de vos compagnons</p>
      </div>

      <Card className="bg-secondary p-6 rounded-3xl space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-title">
            Créez un profil pour votre compagnon
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            Suivez sa santé et son comportement
          </p>
        </div>
        <Button
          onClick={() => navigate("/dogs/add")}
          className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un chien
        </Button>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-title">Mes chiens</h2>
        {dogs.map((dog) => (
          <Card
            key={dog.id}
            className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/dogs/${dog.id}`)}
          >
            <div className="flex items-center gap-4">
              <img
                src={dog.image}
                alt={dog.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-title">{dog.name}</h3>
                <p className={`text-sm ${dog.statusColor}`}>{dog.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-title mb-4">Accès rapide</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard
            icon={TestTube2}
            label="Tests"
            onClick={() => navigate("/questionnaire")}
          />
          <QuickActionCard
            icon={Heart}
            label="Santé"
            onClick={() => navigate("/dogs/1")}
          />
          <QuickActionCard
            icon={FileText}
            label="Rapports"
            onClick={() => navigate("/dogs/1")}
          />
          <QuickActionCard
            icon={Stethoscope}
            label="RDV"
            onClick={() => navigate("/professionals")}
          />
          <QuickActionCard
            icon={Calendar}
            label="Calendrier"
            onClick={() => navigate("/dogs/1")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dogs;
