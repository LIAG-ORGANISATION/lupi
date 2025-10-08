import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Utensils, Footprints, Puzzle, Stethoscope, Heart } from "lucide-react";
import oonaDemoImg from "@/assets/oona-demo.jpg";

const RecommendationsDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header avec retour */}
      <div className="p-4 sm:p-6 bg-primary">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-foreground mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm sm:text-base">Retour</span>
          </button>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <img 
              src={oonaDemoImg} 
              alt="Oona" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary-foreground shadow-lg flex-shrink-0"
            />
            <div className="text-primary-foreground">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Recommandations</h1>
              <p className="text-sm sm:text-base text-primary-foreground/90">Basées sur l'ADN d'Oona</p>
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
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Alimentation</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Repas riches en protéines</span> - Races actives.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Ajout d'antioxydants</span> - Sensibilité oculaire.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Éviter le blé</span> - Intolérances fréquentes.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
              <p className="text-sm font-semibold text-foreground mb-1">Régime recommandé :</p>
              <p className="text-sm text-muted-foreground">Croquettes hyperprotéinées + huile de poisson</p>
            </div>

            <Button 
              className="w-full mt-4 text-sm sm:text-base"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le plan nutritionnel
            </Button>
          </Card>
        </section>

        {/* 2. Promenades & Activités */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Footprints className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Activités</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Jeu extérieur ou agility</span> - Min. 1h/jour.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Pistage et recherche</span> - Instincts naturels.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Jeux cérébraux</span> - Éviter l'ennui.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-4">
              <p className="text-sm text-foreground italic">
                Les bergers adorent résoudre des problèmes et travailler en équipe.
              </p>
            </div>

            <Button 
              className="w-full mt-4 text-sm sm:text-base"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le plan d'activités
            </Button>
          </Card>
        </section>

        {/* 3. Jeux & Stimulation mentale */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Puzzle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Jeux</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">Gamelles interactives ou tapis de fouille</p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">Jouets de cache-cache</p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">Exercices d'obéissance avec friandises</p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg mt-4 border border-primary/10">
              <p className="text-sm font-semibold text-foreground mb-1">Rotation suggérée :</p>
              <p className="text-sm text-muted-foreground">Alterner jeux cérébraux et jeux d'énergie</p>
            </div>

            <Button 
              className="w-full mt-4 text-sm sm:text-base"
              onClick={() => navigate('/dna-kit')}
            >
              Voir les jeux adaptés
            </Button>
          </Card>
        </section>

        {/* 4. Santé & Prévention */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Santé</h2>
          </div>

          <Card className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Excellente santé génétique</span>
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Enzymes hépatiques</span> - 1x/an.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Suppléments articulaires</span> - Recommandés.
                </p>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Exercice équilibré</span> - Éviter le surentraînement.
                </p>
              </div>
            </div>

            <Button 
              className="w-full mt-4 text-sm sm:text-base"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le résumé de santé
            </Button>
          </Card>
        </section>

        {/* 5. Personnalité & Lien */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-primary" />
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
                  <span className="font-semibold">Tempérament :</span> Intelligent + affectueux + protecteur.
                </p>
              </div>
            </div>

            <Button 
              className="w-full mt-4 text-sm sm:text-base"
              onClick={() => navigate('/dna-kit')}
            >
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
            <Button 
              size="lg"
              className="w-full sm:w-auto rounded-full"
              onClick={() => navigate('/dna-kit')}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Commander pour mon chien
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsDemo;
