import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TestTube2, Heart, Activity, Sparkles, Globe, TrendingUp, Lightbulb } from "lucide-react";
import noumeaImage from "@/assets/noumea-demo.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const DNADemo = () => {
  const navigate = useNavigate();
  const breedData = [{
    breed: "Berger Américain Miniature",
    percentage: 93.4,
    color: "#10b981"
  }, {
    breed: "Chien-loup tchécoslovaque",
    percentage: 5.0,
    color: "#8b5cf6"
  }, {
    breed: "Terrier Lakeland",
    percentage: 1.3,
    color: "#f59e0b"
  }, {
    breed: "Terrier Sealyham",
    percentage: 0.3,
    color: "#ec4899"
  }];
  const appearanceTraits = [{
    label: "Type de pelage",
    value: "Non frisé"
  }, {
    label: "Couleur principale",
    value: "Fauve / Chocolat, points feu"
  }, {
    label: "Motifs",
    value: "Motif merle, masque sombre"
  }, {
    label: "Oreilles",
    value: "Tombantes, repliées"
  }, {
    label: "Museau",
    value: "Moyen à long"
  }, {
    label: "Queue",
    value: "Courte"
  }, {
    label: "Taille",
    value: "Moyenne"
  }];
  return <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-title">Résultats ADN</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 1. Identification */}
        <Card className="p-6 rounded-xl shadow-lg border-2 border-primary/20">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img src={noumeaImage} alt="Nouméa" className="w-32 h-32 rounded-full object-cover border-4 border-primary/30" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-title">Nouméa</h2>
              <p className="text-sm text-muted-foreground mt-1">Test ADN effectué le 6 novembre 2025</p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">Moyenne</div>
                <div className="text-xs text-muted-foreground">Taille</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">9-18 kg</div>
                <div className="text-xs text-muted-foreground">Poids idéal adulte</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">93%</div>
                <div className="text-xs text-muted-foreground">Berger Américain</div>
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
            {breedData.map(breed => <div key={breed.breed} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-title">{breed.breed}</span>
                  <span className="text-sm font-bold" style={{
                color: breed.color
              }}>
                    {breed.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full transition-all duration-500" style={{
                width: `${breed.percentage}%`,
                backgroundColor: breed.color
              }} />
                </div>
              </div>)}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-4">
            <p className="text-sm text-foreground font-medium mb-2">Petit rappel</p>
            <p className="text-xs text-muted-foreground">
              Parfois, un trait bien visible chez votre chien n'apparaît pas dans le test. Pourquoi ? Parce que l'ordinateur calcule les probabilités les plus élevées à partir de l'ADN analysé, mais certains traits dépendent de plusieurs gènes, ou de variantes encore peu documentées. Bref, la connaissance de la génétique canine progresse tous les jours. Et entre nous… votre chien est canon dans tous les cas.
            </p>
          </div>
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
                <div className="font-bold text-title">Nouméa</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Père</div>
                <div className="text-xs text-muted-foreground mt-1">Berger Australien Miniature</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg text-center">
                <div className="font-semibold text-sm text-title">Mère</div>
                <div className="text-xs text-muted-foreground mt-1">Berger Australien Standard</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {["Berger Australien Miniature", "Berger Australien Miniature", "Berger Australien Miniature", "Berger Australien"].map((ancestor, idx) => <div key={`${ancestor}-${idx}`} className="bg-muted/50 p-2 rounded text-xs">
                  {ancestor}
                </div>)}
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
            <div className="bg-secondary/30 border-2 border-green-500/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-600 dark:text-green-400">Excellente santé génétique</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sur +150 gènes testés, Nouméa ne présente aucune variante à risque détectée.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Aucune anomalie détectée :</span> pas de myélopathie dégénérative, de maladie de von Willebrand, ni de déficiences enzymatiques. Pas de sensibilité connue aux médicaments (ABCB1/MDR1 négatif).
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
            {appearanceTraits.map(trait => <div key={trait.label} className="bg-secondary/30 p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{trait.label}</div>
                <div className="text-sm font-semibold text-title">{trait.value}</div>
              </div>)}
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
              Nouméa est issue à plus de 90% de Berger Australien (miniature et standard) — une race reconnue pour son intelligence, sa vivacité et son besoin de lien avec ses humains.
              Elle a probablement un tempérament curieux, sensible et actif, avec une forte capacité d'apprentissage et un besoin de stimulation mentale quotidienne.
            </p>

            <div className="bg-secondary/30 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-sm font-medium text-title">
                Un environnement structurant, du jeu, et de l'exercice régulier lui conviendront parfaitement.
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
              <div className="font-semibold text-sm text-title mb-2">Lignée de berger</div>
              <p className="text-sm text-muted-foreground">
                Son ADN mitochondrial, transmis uniquement par la lignée maternelle, est typique des races de berger. Cela signifie que sa lignée maternelle appartient à un groupe génétique ancien souvent retrouvé chez des races élevées pour le travail et la coopération avec l'humain.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-4 text-sm font-medium text-foreground">
                <span>Lignée ancienne</span>
                <span className="text-2xl">→</span>
                <span>Races de travail</span>
                <span className="text-2xl">→</span>
                <span className="text-primary font-bold">Nouméa</span>
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
                <div className="text-xs text-muted-foreground">+150 gènes testés</div>
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
                <div className="text-xs text-muted-foreground">Fauve/Chocolat, points feu, motif merle</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-sm text-title">Personnalité</div>
                <div className="text-xs text-muted-foreground">Intelligente, active, affectueuse</div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA vers recommandations */}
        <Card className="n26-card text-center" style={{ background: 'hsl(0 0% 96%)' }}>
          <div className="icon-container mx-auto" style={{ width: '48px', height: '48px' }}>
            <Lightbulb style={{ width: '48px', height: '48px' }} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'hsl(240 6% 11%)', marginTop: '16px' }}>
            Découvrez les recommandations personnalisées
          </h3>
          <p style={{ fontSize: '14px', color: 'hsl(240 3% 57%)', marginTop: '8px' }}>
            Voyez comment le test ADN vous permet d'obtenir des conseils adaptés au mode de vie de votre chien
          </p>
          <Button onClick={() => navigate("/recommendations-demo")} variant="outline" className="w-full mt-4" style={{ borderRadius: '16px' }} size="lg">
            <Lightbulb className="h-5 w-5 mr-2" strokeWidth={1.5} />
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
          <Button onClick={() => navigate("/dna-kit")} className="w-full rounded-full" size="lg">
            <TestTube2 className="h-5 w-5 mr-2" />
            Je veux tester mon chien aussi
          </Button>
        </Card>
      </div>
    </div>;
};
export default DNADemo;