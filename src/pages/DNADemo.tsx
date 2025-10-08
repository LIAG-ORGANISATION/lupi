import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TestTube2, Heart, Activity, Sparkles, Globe, TrendingUp, Lightbulb } from "lucide-react";
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
    { label: "Type de pelage", value: "Long et lisse" },
    { label: "Couleur principale", value: "Noire et blanche" },
    { label: "Motifs", value: "Zones blanches sur poitrail et pattes" },
    { label: "Mue", value: "Saisonnière et abondante" },
    { label: "Museau", value: "Moyenne à longue" },
    { label: "Queue", value: "Longue" },
    { label: "Taille", value: "Moyenne à grande (22 kg)" },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
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
        <Card className="p-6 rounded-xl shadow-lg border-2 border-primary/20">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={oonaImage}
                alt="Oona"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/30"
              />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
                Démo
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-title">Oona</h2>
              <p className="text-sm text-muted-foreground mt-1">Test ADN effectué le 4 juin 2024</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">22 kg</div>
                <div className="text-xs text-muted-foreground">Poids adulte</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">0,9%</div>
                <div className="text-xs text-muted-foreground">Niveau de loup</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">Jeune</div>
                <div className="text-xs text-muted-foreground">Adulte</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Composition génétique */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TestTube2 className="h-5 w-5 text-primary" />
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

          <p className="text-sm text-muted-foreground mt-4 p-4 bg-secondary/30 rounded-lg">
            Grâce à l'analyse de ses chromosomes, on sait exactement de quelles races Oona tient ses traits physiques et comportementaux.
          </p>
        </Card>

        {/* 3. Arbre généalogique */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Arbre généalogique</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block bg-primary/10 px-6 py-3 rounded-lg">
                <div className="font-bold text-title">Oona</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Mère</div>
                <div className="text-xs text-muted-foreground mt-1">Labrador mix</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Père</div>
                <div className="text-xs text-muted-foreground mt-1">Border Collie mix</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {["Collie", "Berger Allemand", "Australian Shepherd", "Labrador"].map((ancestor) => (
                <div key={ancestor} className="bg-muted/50 p-2 rounded text-xs">
                  {ancestor}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Santé & Prédispositions */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Santé et Prédispositions</h3>
          </div>

          <div className="space-y-3">
            <div className="bg-secondary/30 border-2 border-primary/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="font-semibold text-primary">Bonne santé globale</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sur 265 maladies génétiques testées, Oona n'en présente aucune à risque élevé.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="item-1" className="border rounded-lg px-4 bg-accent/10">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="font-semibold text-accent-foreground">Facteurs à surveiller (2)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="font-semibold text-sm text-foreground">ALT Activity</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Taux d'enzymes hépatiques naturellement plus bas. À surveiller par le vétérinaire lors des bilans sanguins.
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="font-semibold text-sm text-foreground">Dégénérescence Myélinique (DM)</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Porteuse saine, sans risque de développement de la maladie.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="font-semibold text-sm text-primary mb-1">Diversité génétique</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
                <span className="text-sm font-bold text-primary">98%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Très bonne diversité génétique, faible consanguinité (2% seulement).
              </p>
            </div>
          </div>
        </Card>

        {/* 5. Apparence & Traits physiques */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Apparence et Traits physiques</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {appearanceTraits.map((trait) => (
              <div key={trait.label} className="bg-secondary/30 p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{trait.label}</div>
                <div className="text-sm font-semibold text-title">{trait.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. Tempérament & comportement */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Tempérament et comportement</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed">
              Oona est issue de races très vives et intelligentes (Border Collie, Berger Australien) associées à des lignées calmes et loyales (Labrador, Collie).
              Elle a besoin d'activité physique et mentale quotidienne. Très attachée à ses humains, elle peut se montrer sensible à la solitude et adore avoir une mission à accomplir.
            </p>

            <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-sm font-medium text-title">
                Curieuse, énergique et fidèle - un combo parfait pour les randonnées et les jeux d'intelligence
              </p>
            </div>
          </div>
        </Card>

        {/* 7. Ligne maternelle */}
        <Card className="p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Ligne maternelle (ADN mitochondrial)</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-primary">
              <div className="font-semibold text-sm text-title mb-2">Lignée A1a</div>
              <p className="text-sm text-muted-foreground">
                Issue des premières lignées de chiens domestiqués d'Asie centrale. Très présente chez les Labradors et Golden Retrievers.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-4 text-sm font-medium text-foreground">
                <span>Asie centrale</span>
                <span className="text-2xl">→</span>
                <span>Europe</span>
                <span className="text-2xl">→</span>
                <span className="text-primary font-bold">Oona</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 8. Résumé global */}
        <Card className="p-6 rounded-xl bg-gradient-card shadow-xl border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-title">Résumé global</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <TestTube2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Analyse complète</div>
                <div className="text-xs text-muted-foreground">265 maladies testées</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Santé globale</div>
                <div className="text-xs text-muted-foreground">Excellente</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Traits dominants</div>
                <div className="text-xs text-muted-foreground">Pelage long, noir et blanc</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Personnalité</div>
                <div className="text-xs text-muted-foreground">Intelligente, active, affectueuse</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Diversité génétique</div>
                <div className="text-xs text-muted-foreground">Très élevée</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA vers recommandations */}
        <Card className="p-6 rounded-xl shadow-lg text-center bg-gradient-card">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-title mb-2">
            Découvrez les recommandations personnalisées
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Voyez comment le test ADN vous permet d'obtenir des conseils adaptés au mode de vie de votre chien
          </p>
          <Button
            onClick={() => navigate("/recommendations-demo")}
            variant="outline"
            className="w-full rounded-full"
            size="lg"
          >
            <Lightbulb className="h-5 w-5 mr-2" />
            Voir les recommandations
          </Button>
        </Card>

        {/* CTA Final */}
        <Card className="p-6 rounded-xl shadow-lg text-center border-2 border-primary/20">
          <h3 className="text-xl font-bold text-title mb-2">
            Vous voulez découvrir le profil génétique de votre chien ?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Commandez votre test ADN et accédez à une analyse complète comme celle-ci
          </p>
          <Button
            onClick={() => navigate("/dna-kit")}
            className="w-full rounded-full"
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
