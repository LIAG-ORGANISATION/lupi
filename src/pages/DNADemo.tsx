import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TestTube2, Heart, Activity, Sparkles, Globe, TrendingUp } from "lucide-react";
import oonaImage from "@/assets/oona-demo.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DNADemo = () => {
  const navigate = useNavigate();

  const breedData = [
    { breed: "Border Collie", percentage: 45.2, color: "#10b981" },
    { breed: "Labrador Retriever", percentage: 25.8, color: "#3b82f6" },
    { breed: "Australian Shepherd", percentage: 11.3, color: "#8b5cf6" },
    { breed: "German Shepherd", percentage: 9.7, color: "#f59e0b" },
    { breed: "Collie", percentage: 8.0, color: "#ec4899" },
  ];

  const appearanceTraits = [
    { icon: "🐶", label: "Type de pelage", value: "Long et lisse" },
    { icon: "🎨", label: "Couleur principale", value: "Noire et blanche" },
    { icon: "✨", label: "Motifs", value: "Zones blanches sur poitrail et pattes" },
    { icon: "💨", label: "Mue", value: "Saisonnière et abondante" },
    { icon: "📏", label: "Museau", value: "Moyenne à longue" },
    { icon: "🦴", label: "Queue", value: "Longue" },
    { icon: "⚖️", label: "Taille", value: "Moyenne à grande (22 kg)" },
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-emerald-50/30 to-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-title">Résultats ADN - Exemple</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 1. Identification */}
        <Card className="p-6 rounded-xl bg-white shadow-lg border-2 border-emerald-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={oonaImage}
                alt="Oona"
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-200"
              />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Démo
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-title">Oona</h2>
              <p className="text-sm text-muted-foreground mt-1">Test ADN effectué le 4 juin 2024</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-emerald-600">22 kg</div>
                <div className="text-xs text-muted-foreground">Poids adulte</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-emerald-600">0,9%</div>
                <div className="text-xs text-muted-foreground">Niveau de loup</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-emerald-600">Jeune</div>
                <div className="text-xs text-muted-foreground">Adulte</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Composition génétique */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TestTube2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Composition génétique</h3>
          </div>
          
          <div className="space-y-3">
            {breedData.map((breed) => (
              <div key={breed.breed} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-title">{breed.breed}</span>
                  <span className="text-sm font-bold" style={{ color: breed.color }}>
                    {breed.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${breed.percentage}%`,
                      backgroundColor: breed.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4 p-4 bg-emerald-50 rounded-lg">
            Grâce à l'analyse de ses chromosomes, on sait exactement de quelles races Oona tient ses traits physiques et comportementaux.
          </p>
        </Card>

        {/* 3. Arbre généalogique */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Arbre généalogique</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block bg-emerald-100 px-6 py-3 rounded-lg">
                <div className="font-bold text-title">Oona</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Mère</div>
                <div className="text-xs text-muted-foreground mt-1">Labrador mix</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Père</div>
                <div className="text-xs text-muted-foreground mt-1">Border Collie mix</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {["Collie", "Berger Allemand", "Australian Shepherd", "Labrador"].map((ancestor) => (
                <div key={ancestor} className="bg-gray-50 p-2 rounded text-xs">
                  {ancestor}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Santé & Prédispositions */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Santé et Prédispositions</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="font-semibold text-emerald-700">Bonne santé globale</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sur 265 maladies génétiques testées, Oona n'en présente aucune à risque élevé.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="item-1" className="border rounded-lg px-4 bg-yellow-50">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-semibold text-yellow-700">Facteurs à surveiller (2)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="font-medium text-sm text-title">ALT Activity</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Taux d'enzymes hépatiques naturellement plus bas. À surveiller par le vétérinaire lors des bilans sanguins.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="font-medium text-sm text-title">Dégénérescence Myélinique (DM)</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Porteuse saine, sans risque de développement de la maladie.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-semibold text-sm text-blue-700 mb-1">Diversité génétique</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
                <span className="text-sm font-bold text-blue-600">98%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Très bonne diversité génétique, faible consanguinité (2% seulement).
              </p>
            </div>
          </div>
        </Card>

        {/* 5. Apparence & Traits physiques */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Apparence et Traits physiques</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {appearanceTraits.map((trait) => (
              <div key={trait.label} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">{trait.icon}</div>
                <div className="text-xs text-muted-foreground mb-1">{trait.label}</div>
                <div className="text-sm font-semibold text-title">{trait.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. Tempérament & comportement */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Tempérament et comportement</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              Oona est issue de races très vives et intelligentes (Border Collie, Berger Australien) associées à des lignées calmes et loyales (Labrador, Collie).
              Elle a besoin d'activité physique et mentale quotidienne. Très attachée à ses humains, elle peut se montrer sensible à la solitude et adore avoir une mission à accomplir.
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <p className="text-sm font-medium text-title">
                Curieuse, énergique et fidèle - un combo parfait pour les randonnées et les jeux d'intelligence
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs font-medium">Énergique</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">🧠</div>
                <div className="text-xs font-medium">Intelligente</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-xs font-medium">Affectueuse</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 7. Ligne maternelle */}
        <Card className="p-6 rounded-xl bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-title">Ligne maternelle (ADN mitochondrial)</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <div className="font-semibold text-sm text-amber-900 mb-2">Lignée A1a</div>
              <p className="text-sm text-muted-foreground">
                Issue des premières lignées de chiens domestiqués d'Asie centrale. Très présente chez les Labradors et Golden Retrievers.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-emerald-100 p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-4 text-sm font-medium">
                <span>Asie centrale</span>
                <span className="text-2xl">→</span>
                <span>Europe</span>
                <span className="text-2xl">→</span>
                <span className="text-emerald-600 font-bold">Oona</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 8. Résumé global */}
        <Card className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h3 className="text-xl font-bold">Résumé global</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <TestTube2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Analyse complète</div>
                <div className="text-xs text-white/80">265 maladies testées</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Santé globale</div>
                <div className="text-xs text-white/80">Excellente</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Traits dominants</div>
                <div className="text-xs text-white/80">Pelage long, noir et blanc</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Personnalité</div>
                <div className="text-xs text-white/80">Intelligente, active, affectueuse</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Diversité génétique</div>
                <div className="text-xs text-white/80">Très élevée</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Final */}
        <Card className="p-6 rounded-xl bg-white shadow-lg text-center">
          <h3 className="text-xl font-bold text-title mb-2">
            Vous voulez découvrir le profil génétique de votre chien ?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Commandez votre test ADN et accédez à une analyse complète comme celle-ci
          </p>
          <Button
            onClick={() => navigate("/dna-kit")}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
            size="lg"
          >
            <TestTube2 className="h-5 w-5 mr-2" />
            Je veux tester mon chien aussi
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DNADemo;
