import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Dog } from "lucide-react";
import baladeXoldokogaina from "@/assets/balade-xoldokogaina.jpg";
import baladeGuethary from "@/assets/balade-guethary.jpg";
import baladeMondarrain from "@/assets/balade-mondarrain.jpg";
import baladeOssasSuhare from "@/assets/balade-ossas-suhare.jpg";
import baladeAdarra from "@/assets/balade-adarra.jpg";

interface BaladeData {
  id: string;
  name: string;
  location: string;
  distance: string;
  duration: string;
  dogType: string;
  description: string;
  image: string;
  mapsUrl: string;
  ambiance: string;
}

const balades: BaladeData[] = [
  {
    id: "xoldokogaina",
    name: "Lac de Xoldokogaina",
    location: "Urrugne (Col d'Ibardin)",
    distance: "7,5 km",
    duration: "3h",
    dogType: "Moyens à grands chiens",
    description: "Une boucle magique entre forêt et montagne, qui grimpe doucement jusqu'au lac de Xoldokogaina. Ton chien marchera dans les sous-bois, entre fougères et sentiers pierreux, avant de découvrir la vue spectaculaire sur l'océan.",
    ambiance: "Sauvage, panoramique, ambiance brume du matin",
    image: baladeXoldokogaina,
    mapsUrl: "https://www.google.com/maps/search/Lac+Xoldokogaina+Urrugne"
  },
  {
    id: "guethary",
    name: "Sentier littoral",
    location: "Guéthary → Saint-Jean-de-Luz",
    distance: "6 km",
    duration: "2h",
    dogType: "Tous gabarits",
    description: "Un sentier côtier spectaculaire longeant l'océan, alternant falaises et criques sauvages. Parfait pour une balade rythmée au grand air, avec une vue imprenable sur l'Atlantique et des arrêts baignade.",
    ambiance: "Mer bleue, vent doux, horizon dégagé",
    image: baladeGuethary,
    mapsUrl: "https://www.google.com/maps/search/Sentier+littoral+Guéthary"
  },
  {
    id: "mondarrain",
    name: "Boucle du Mondarrain",
    location: "Itxassou",
    distance: "5 km",
    duration: "2h",
    dogType: "Petits à moyens chiens",
    description: "Une montée douce vers le sommet du Mondarrain, entre pâturages et collines verdoyantes. Une balade courte mais spectaculaire, parfaite pour les chiens plus calmes ou les familles.",
    ambiance: "Herbes hautes, crêtes verdoyantes, ciel pastel",
    image: baladeMondarrain,
    mapsUrl: "https://www.google.com/maps/search/Mondarrain+Itxassou"
  },
  {
    id: "ossas-suhare",
    name: "Randonnée Ossas-Suhare",
    location: "Forêt basque",
    distance: "8 km",
    duration: "3h",
    dogType: "Moyens à grands chiens",
    description: "Immersion totale dans la forêt basque. Sentiers moussus, ruisseaux et clairières : le rêve des chiens explorateurs. Parfait pour les journées calmes à l'ombre des arbres.",
    ambiance: "Sous-bois, lumière filtrée, mousse verte, calme absolu",
    image: baladeOssasSuhare,
    mapsUrl: "https://www.google.com/maps/search/Ossas+Suhare+Foret+Basque"
  },
  {
    id: "adarra",
    name: "Mont Adarra",
    location: "Frontière basque",
    distance: "10 km",
    duration: "4h",
    dogType: "Moyens à grands chiens",
    description: "Un itinéraire panoramique au-dessus des nuages. Ton chien t'accompagne jusqu'au sommet rocheux du mont Adarra, d'où la vue s'étend jusqu'à l'océan.",
    ambiance: "Altitude, roche, horizon bleu, air pur",
    image: baladeAdarra,
    mapsUrl: "https://www.google.com/maps/search/Mont+Adarra+Pays+Basque"
  }
];

const BaladeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const balade = balades.find(b => b.id === id);

  if (!balade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-title mb-4">Balade non trouvée</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80">
        <img 
          src={balade.image} 
          alt={balade.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="lupi-card p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-title mb-2">{balade.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{balade.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{balade.distance}</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{balade.duration}</div>
              <div className="text-xs text-muted-foreground">Durée</div>
            </div>
            <div className="text-center">
              <Dog className="w-6 h-6 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">Adapté à</div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Dog className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-title">Type de chien</span>
            </div>
            <p className="text-sm text-foreground">{balade.dogType}</p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-title">Description</h2>
            <p className="text-foreground leading-relaxed">{balade.description}</p>
          </div>

          {/* Ambiance */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-title">Ambiance</h2>
            <p className="text-foreground leading-relaxed">{balade.ambiance}</p>
          </div>

          {/* CTA */}
          <Button 
            className="w-full"
            size="lg"
            onClick={() => window.open(balade.mapsUrl, '_blank')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Voir l'itinéraire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BaladeDetail;
