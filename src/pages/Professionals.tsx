import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

const Professionals = () => {
  const navigate = useNavigate();

  const professionals = [
    {
      id: 1,
      name: "Dr. Emily Carter",
      profession: "Vétérinaire",
      specialties: ["Médecine générale", "Chirurgie"],
      rate: "60€/consultation",
    },
    {
      id: 2,
      name: "Liam Bennett",
      profession: "Éducateur canin",
      specialties: ["Dressage chiots", "Comportement"],
      rate: "50€/séance",
    },
    {
      id: 3,
      name: "Sophia Clark",
      profession: "Pet sitter",
      specialties: ["Garde à domicile", "Promenades"],
      rate: "25€/jour",
    },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-title mb-2">Annuaire Pros</h1>
        <p className="text-sm text-muted-foreground">
          Trouvez des professionnels vérifiés près de chez vous
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher un professionnel..."
          className="pl-10 rounded-2xl"
        />
      </div>

      <div className="space-y-4">
        {professionals.map((pro) => (
          <Card
            key={pro.id}
            className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-title">{pro.name}</h3>
                  <p className="text-sm text-primary">{pro.profession}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {pro.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-xs rounded-full text-foreground"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-title">{pro.rate}</span>
                <Button
                  onClick={() => navigate(`/professional/${pro.id}`)}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  Voir profil
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Professionals;
