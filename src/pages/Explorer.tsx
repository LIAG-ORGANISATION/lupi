import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Gift, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import kozooLogo from "@/assets/kozoo-logo-new.png";
import pennypetLogo from "@/assets/pennypet-logo-new.png";
import espritDogLogo from "@/assets/esprit-dog-logo.png";
import baladeXoldokogaina from "@/assets/balade-xoldokogaina.jpg";
import baladeGuethary from "@/assets/balade-guethary.jpg";
import baladeMondarrain from "@/assets/balade-mondarrain.jpg";
import baladeOssasSuhare from "@/assets/balade-ossas-suhare.jpg";
import baladeAdarra from "@/assets/balade-adarra.jpg";
import { SeasonalAllergies } from "@/components/SeasonalAllergies";
import { SeasonalRecipes } from "@/components/SeasonalRecipes";
import { useToast } from "@/hooks/use-toast";

const Explorer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);

  const handleCopyPromo = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    toast({
      title: "Code promo copié !",
      description: `Le code "${code}" a été copié dans votre presse-papiers`,
    });
    setTimeout(() => setCopiedPromo(null), 2000);
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#6B1C1C] to-[#4A0F0F] p-5 rounded-b-[3rem] shadow-card">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">Explorer</h1>
          <p className="text-sm text-white/80 mt-2">
            Découvrez nos recommandations et partenaires
          </p>
        </div>
      </div>

      <div className="p-2 space-y-3 max-w-4xl mx-auto mt-2">
        {/* Formation section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Formation coup de cœur</h2>
          <a href="https://www.espritdog.com/esprit-dog-1er-secours/" target="_blank" rel="noopener noreferrer" className="block">
            <div className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <img src={espritDogLogo} alt="Esprit Dog" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg leading-tight">Formation Premiers Secours</h3>
                  <p className="text-sm text-muted-foreground">Apprenez les gestes qui sauvent avec Esprit Dog</p>
                </div>
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Balades section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-title">Balades autour de vous</h2>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1 md:-ml-4">
              <CarouselItem className="pl-1 md:pl-4 basis-[65%] md:basis-1/3">
                <div 
                  className="lupi-card overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-xl"
                  onClick={() => navigate('/balade/xoldokogaina')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={baladeXoldokogaina}
                      alt="Lac de Xoldokogaina" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-title text-sm">Lac de Xoldokogaina</h3>
                    <p className="text-xs text-muted-foreground">Urrugne • 7,5 km • 3h</p>
                    <p className="text-xs text-primary">Moyens à grands chiens</p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="pl-1 md:pl-4 basis-[65%] md:basis-1/3">
                <div 
                  className="lupi-card overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-xl"
                  onClick={() => navigate('/balade/guethary')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={baladeGuethary}
                      alt="Sentier littoral" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-title text-sm">Sentier littoral</h3>
                    <p className="text-xs text-muted-foreground">Guéthary • 6 km • 2h</p>
                    <p className="text-xs text-primary">Tous gabarits</p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="pl-1 md:pl-4 basis-[65%] md:basis-1/3">
                <div 
                  className="lupi-card overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-xl"
                  onClick={() => navigate('/balade/mondarrain')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={baladeMondarrain}
                      alt="Boucle du Mondarrain" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-title text-sm">Boucle du Mondarrain</h3>
                    <p className="text-xs text-muted-foreground">Itxassou • 5 km • 2h</p>
                    <p className="text-xs text-primary">Petits à moyens chiens</p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="pl-1 md:pl-4 basis-[65%] md:basis-1/3">
                <div 
                  className="lupi-card overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-xl"
                  onClick={() => navigate('/balade/ossas-suhare')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={baladeOssasSuhare}
                      alt="Randonnée Ossas-Suhare" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-title text-sm">Randonnée Ossas-Suhare</h3>
                    <p className="text-xs text-muted-foreground">Forêt basque • 8 km • 3h</p>
                    <p className="text-xs text-primary">Moyens à grands chiens</p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="pl-1 md:pl-4 basis-[65%] md:basis-1/3">
                <div 
                  className="lupi-card overflow-hidden cursor-pointer hover:shadow-lg transition-all rounded-xl"
                  onClick={() => navigate('/balade/adarra')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={baladeAdarra}
                      alt="Mont Adarra" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-title text-sm">Mont Adarra</h3>
                    <p className="text-xs text-muted-foreground">Frontière basque • 10 km • 4h</p>
                    <p className="text-xs text-primary">Moyens à grands chiens</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        {/* Partners section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Nos partenaires</h2>
          <div className="space-y-2">
            <div className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4 flex items-center gap-4 relative">
              <a href="https://www.kozoo.eu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <img src={kozooLogo} alt="KOZOO" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg">KOZOO</h3>
                  <p className="text-sm text-muted-foreground">Assurance pour chien</p>
                </div>
              </a>
              <button onClick={e => handleCopyPromo('lupixkozoo', e)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all" title="Copier le code promo">
                {copiedPromo === 'lupixkozoo' ? <Check className="h-5 w-5 text-primary" /> : <Gift className="h-5 w-5 text-primary" />}
              </button>
            </div>

            <div className="lupi-card cursor-pointer hover:shadow-lg transition-all p-4 flex items-center gap-4 relative">
              <a href="https://pennypet.io/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 flex-shrink-0">
                  <img src={pennypetLogo} alt="PENNYPET" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-title text-lg">PENNYPET</h3>
                  <p className="text-sm text-muted-foreground">Cashback frais animaux</p>
                </div>
              </a>
              <button onClick={e => handleCopyPromo('lupixpennypet', e)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all" title="Copier le code promo">
                {copiedPromo === 'lupixpennypet' ? <Check className="h-5 w-5 text-primary" /> : <Gift className="h-5 w-5 text-primary" />}
              </button>
            </div>
          </div>
        </div>

        {/* Seasonal Allergies section */}
        <SeasonalAllergies />

        {/* Association du moment section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Association du moment</h2>
          <div className="lupi-card p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-title text-lg">SPA Bayonne</h3>
                  <p className="text-sm text-muted-foreground">Fourrière animale 64</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Soutenez une association sélectionnée par Lupi ! La SPA de Bayonne prend soin des animaux abandonnés et leur trouve une nouvelle famille.
                </p>
                <a href="https://fourriere-animale-64.fr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Faire un don
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Recipes section */}
        <div className="mt-6">
          <SeasonalRecipes />
        </div>
      </div>
    </div>
  );
};

export default Explorer;
