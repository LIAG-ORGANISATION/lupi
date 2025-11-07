import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Utensils, Footprints, Puzzle, Stethoscope, Heart } from "lucide-react";
import noumeaDemoImg from "@/assets/noumea-demo.jpg";
const RecommendationsDemo = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen pb-24 bg-background">
      {/* Header avec retour */}
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm sm:text-base">Retour</span>
          </button>
          
          <div className="flex flex-col items-center text-center gap-6">
            <img src={noumeaDemoImg} alt="Nouméa" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-primary/20 shadow-lg" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-title">Recommandations personnalisées</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">Basées sur l'ADN de Nouméa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Badge Exemple */}
        <div className="text-center">
          <span className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
            Données d'exemple uniquement
          </span>
        </div>

        {/* Intro */}
        <Card className="p-4 sm:p-6">
          <p className="text-foreground text-sm sm:text-lg leading-relaxed">
            Une fois l'ADN de votre chien analysé, vous recevrez un ensemble complet de conseils personnalisés sur la nutrition, l'exercice et les soins adaptés à sa génétique unique.
          </p>
        </Card>

        {/* 1. Alimentation & Nutrition */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Utensils className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Alimentation</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Repas riches en protéines</span> - Nouméa est issue de races actives et endurantes, qui brûlent beaucoup d'énergie mentale et physique.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Ajout d'antioxydants naturels</span> - Les bergers peuvent présenter une sensibilité oculaire (notamment chez les merles) : les antioxydants soutiennent la santé visuelle.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Éviter le blé</span> - Certaines lignées de Bergers présentent des intolérances digestives modérées aux céréales raffinées.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
              <p className="text-sm font-semibold text-foreground mb-1">Régime recommandé :</p>
              <p className="text-sm text-muted-foreground">Croquettes hyperprotéinées (≥ 28% protéines animales) + huile de poisson (oméga 3) pour le poil et la vision.</p>
            </div>

            <Button className="w-full mt-4 text-sm sm:text-base" onClick={() => navigate('/dna-kit')}>
              Voir le plan nutritionnel
            </Button>
          </Card>
        </section>

        {/* 2. Promenades & Activités */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Footprints className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Activités</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Jeu extérieur ou agility</span> - Besoin minimum de 1h/jour d'exercice dynamique pour combler son drive naturel.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Pistage & recherche</span> - Son bagage de travail l'oriente vers des activités qui sollicitent son flair et sa capacité d'analyse.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Jeux cérébraux</span> - Sa lignée adore résoudre des problèmes et réfléchir en interaction avec son humain.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-4">
              <p className="text-sm text-foreground italic">
                Les Bergers adorent résoudre des problèmes et travailler en équipe.
              </p>
            </div>

            <Button className="w-full mt-4 text-sm sm:text-base" onClick={() => navigate('/dna-kit')}>
              Voir le plan d'activités
            </Button>
          </Card>
        </section>

        {/* 3. Jeux & Stimulation mentale */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Puzzle className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Jeux</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Gamelles interactives ou tapis de fouille</span> - Pour canaliser sa vivacité mentale pendant les temps calmes.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Jouets de cache-cache</span> - Idéal pour combiner flair et autonomie.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Exercices d'obéissance avec friandises</span> - Son intelligence + son besoin de stimulation font de l'apprentissage un jeu puissant.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
              <p className="text-sm font-semibold text-foreground mb-1">Rotation suggérée :</p>
              <p className="text-sm text-muted-foreground">Alterner jeux d'intelligence et jeux moteurs pour éviter l'hyperstimulation.</p>
            </div>

            <Button className="w-full mt-4 text-sm sm:text-base" onClick={() => navigate('/dna-kit')}>
              Voir les jeux adaptés
            </Button>
          </Card>
        </section>

        {/* 4. Santé & Prévention */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Stethoscope className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Santé</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Excellente santé génétique</span> - Aucun marqueur pathogène détecté dans le test ADN.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Enzymes hépatiques</span> - Contrôle recommandé 1x/an, certains bergers étant sujets à des variations.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Suppléments articulaires</span> - À envisager à partir de 6-7 ans pour soutenir l'activité physique prolongée.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Exercice équilibré</span> - Très active, Nouméa a besoin de repos mental et physique. Trop d'agitation = contre-productif.
                </p>
              </div>
            </div>

            <Button className="w-full mt-4 text-sm sm:text-base" onClick={() => navigate('/dna-kit')}>
              Voir le résumé de santé
            </Button>
          </Card>
        </section>

        {/* 5. Personnalité & Lien */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-container flex-shrink-0">
              <Heart className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Comportement</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <p className="text-foreground text-sm sm:text-base italic leading-relaxed">
              Intelligente, sensible et attachée à ses humains. S'épanouit en se sentant utile et aimée.
            </p>

            <div className="space-y-3 mt-4">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Activités de lien :</span> Clicker, olfactif, jeu social.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Tempérament :</span> Intelligent + affectueux + protecteur — typique des lignées de Berger Australien bien socialisées.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-4">
              <p className="text-xs text-muted-foreground italic">
                Ces conseils sont basés sur l'ADN de votre chien — une super base de départ ! Mais rien ne remplace l'avis d'un pro qui le connaît dans la vraie vie.
              </p>
            </div>

            <Button className="w-full mt-4 text-sm sm:text-base" onClick={() => navigate('/dna-kit')}>
              Voir les insights
            </Button>
          </Card>
        </section>

        {/* CTA Final */}
        <Card className="p-6 sm:p-8 bg-primary/5 border-2 border-primary/20 rounded-2xl">
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Découvrez l'ADN de votre chien</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Nutrition, comportement et bien-être personnalisés selon sa génétique unique.
            </p>
            <Button size="lg" className="w-full sm:w-auto rounded-full" onClick={() => navigate('/dna-kit')}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Commander pour mon chien
            </Button>
          </div>
        </Card>
      </div>
    </div>;
};
export default RecommendationsDemo;