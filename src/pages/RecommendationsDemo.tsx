import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Utensils, Footprints, Puzzle, Stethoscope, Heart } from "lucide-react";
import oonaDemoImg from "@/assets/oona-demo.jpg";

const RecommendationsDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header avec retour */}
      <div className="p-6" style={{ backgroundColor: '#FF6B6B' }}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>
          
          <div className="flex items-center gap-6">
            <img 
              src={oonaDemoImg} 
              alt="Oona" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2 text-white">Recommandations personnalisées</h1>
              <p className="text-white/90">Exemple basé sur les résultats ADN</p>
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
        <Card className="p-6">
          <p className="text-foreground text-lg leading-relaxed">
            Une fois l'ADN de votre chien analysé, vous recevrez un ensemble complet de conseils personnalisés sur la nutrition, l'exercice et les soins adaptés à sa génétique unique.
          </p>
        </Card>

        {/* 1. Alimentation & Nutrition */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Plan alimentaire idéal pour Oona</h2>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Repas riches en protéines</span> - Les races de bergers actives nécessitent de l'énergie pour leurs muscles.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Ajout d'antioxydants</span> - Aide à soutenir les chiens de type colley sujets à la sensibilité oculaire.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Éviter les croquettes à base de blé</span> - Les lignées Border Collie présentent fréquemment des intolérances.
                </p>
              </div>
            </div>

            <div className="bg-gradient-card p-4 rounded-lg mt-4">
              <p className="text-sm font-semibold text-foreground mb-1">Régime recommandé :</p>
              <p className="text-sm text-muted-foreground">Croquettes hyperprotéinées + huile de poisson + faible teneur en céréales</p>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le plan nutritionnel personnalisé
            </Button>
          </Card>
        </section>

        {/* 2. Promenades & Activités */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
              <Footprints className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Meilleures activités pour la génétique d'Oona</h2>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Jeu extérieur quotidien ou agility</span> - Minimum 1h par jour.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Jeux de pistage et de recherche</span> - Instincts de berger et border naturels.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Jeux cérébraux à la maison</span> - Pour éviter l'ennui (côté Labrador = curiosité).
                </p>
              </div>
            </div>

            <div className="bg-accent/10 border-l-4 border-primary p-4 rounded-r-lg mt-4">
              <p className="text-sm text-foreground italic">
                Les chiens avec un mélange élevé de berger adorent résoudre des problèmes et travailler en équipe.
              </p>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le plan d'activités personnalisé
            </Button>
          </Card>
        </section>

        {/* 3. Jeux & Stimulation mentale */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
              <Puzzle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Idées de jeux pour Oona</h2>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">Gamelles interactives ou tapis de fouille</p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">Jouets de cache-cache</p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">Exercices d'obéissance de base avec friandises (renforcement positif)</p>
              </div>
            </div>

            <div className="bg-gradient-card p-4 rounded-lg mt-4">
              <p className="text-sm font-semibold text-foreground mb-1">Rotation hebdomadaire suggérée :</p>
              <p className="text-sm text-muted-foreground">Alterner entre jeux cérébraux et jeux d'énergie</p>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => navigate('/dna-kit')}
            >
              Voir les jeux adaptés
            </Button>
          </Card>
        </section>

        {/* 4. Santé & Prévention */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Surveillance santé basée sur la génétique</h2>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Excellente santé génétique globale</span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Surveiller les niveaux d'enzymes hépatiques (ALT)</span> - Une fois par an.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Suppléments articulaires réguliers recommandés</span> - Races de berger.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Exercice équilibré</span> - Éviter le surentraînement pendant la croissance.
                </p>
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => navigate('/dna-kit')}
            >
              Voir le résumé de santé personnalisé
            </Button>
          </Card>
        </section>

        {/* 5. Personnalité & Lien */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Comprendre le comportement d'Oona</h2>
          </div>

          <Card className="p-6 space-y-4">
            <p className="text-foreground text-lg italic leading-relaxed">
              Oona est intelligente, sensible et profondément attachée à ses humains. Elle s'épanouit lorsqu'elle se sent utile et aimée - typique de son mélange Border Collie et Labrador.
            </p>

            <div className="space-y-3 mt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Activités de lien suggérées :</span> Entraînement au clicker, travail olfactif, jeu social.
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="text-foreground">
                  <span className="font-semibold">Équilibre du tempérament :</span> Intelligent + affectueux + protecteur.
                </p>
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={() => navigate('/dna-kit')}
            >
              Voir les insights de personnalité
            </Button>
          </Card>
        </section>

        {/* CTA Final */}
        <Card className="p-8 bg-gradient-card border-2 border-primary/20 rounded-3xl">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-title">Apprenez à connaître votre chien comme jamais auparavant</h2>
            <p className="text-foreground text-lg">
              Votre test ADN débloque de véritables informations sur la nutrition, le comportement et le bien-être de votre chien.
            </p>
            <Button 
              size="lg"
              className="w-full sm:w-auto px-8 rounded-full"
              onClick={() => navigate('/dna-kit')}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Commander le test ADN de mon chien maintenant
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsDemo;
