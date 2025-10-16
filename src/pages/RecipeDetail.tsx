import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import chickenSweetPotato from "@/assets/recipe-chicken-sweet-potato.jpg";
import applePearOatmeal from "@/assets/recipe-apple-pear-oatmeal.jpg";
import beefPumpkinLentils from "@/assets/recipe-beef-pumpkin-lentils.jpg";
import turkeySweetPotatoPuree from "@/assets/recipe-turkey-sweet-potato-puree.jpg";
import salmonRiceSpinach from "@/assets/recipe-salmon-rice-spinach.jpg";
import chickenCarrotsGreenBeans from "@/assets/recipe-chicken-carrots-green-beans.jpg";
import blueberrySmoothie from "@/assets/recipe-blueberry-smoothie.jpg";
import beefRiceBalls from "@/assets/recipe-beef-rice-balls.jpg";
import greenOmelette from "@/assets/recipe-green-omelette.jpg";
import bananaBites from "@/assets/recipe-banana-bites.jpg";

interface Recipe {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ingredients: string[];
  benefits: string;
  season: "autumn-winter" | "spring-summer";
  prepTime: string;
  servings: string;
  instructions: string[];
}

const recipes: Recipe[] = [
  {
    id: "1",
    image: chickenSweetPotato,
    title: "Ragout de poulet, patate douce et carottes",
    subtitle: "Douceur d'automne",
    ingredients: ["300g de poulet", "200g de patate douce", "150g de carottes", "1 c. a soupe d'huile de colza", "Persil frais"],
    benefits: "Riche en fibres et beta-carotene",
    season: "autumn-winter",
    prepTime: "30 min",
    servings: "2-3 portions",
    instructions: [
      "Coupez le poulet en morceaux moyens",
      "Pelez et coupez la patate douce et les carottes en des",
      "Faites cuire le poulet a feu moyen dans l'huile de colza",
      "Ajoutez les legumes et couvrez d'eau",
      "Laissez mijoter 20 minutes jusqu'a ce que tout soit tendre",
      "Parsemez de persil frais avant de servir tiede"
    ]
  },
  {
    id: "2",
    image: applePearOatmeal,
    title: "Compotee pomme-poire et flocons d'avoine",
    subtitle: "Douceur digestive",
    ingredients: ["2 pommes", "2 poires", "50g de flocons d'avoine", "100g de yaourt nature"],
    benefits: "Douceur digestive et apport en fibres",
    season: "autumn-winter",
    prepTime: "20 min",
    servings: "2 portions",
    instructions: [
      "Pelez et coupez les pommes et poires en morceaux",
      "Faites compoter les fruits a feu doux avec un peu d'eau",
      "Ajoutez les flocons d'avoine et melangez",
      "Laissez refroidir completement",
      "Incorporez le yaourt nature avant de servir"
    ]
  },
  {
    id: "3",
    image: beefPumpkinLentils,
    title: "Boeuf, potiron et lentilles vertes",
    subtitle: "Force et vitalite",
    ingredients: ["250g de viande de boeuf maigre", "200g de potiron", "100g de lentilles vertes", "1 c. a soupe d'huile d'olive"],
    benefits: "Riche en proteines et fer",
    season: "autumn-winter",
    prepTime: "40 min",
    servings: "3 portions",
    instructions: [
      "Faites cuire les lentilles vertes selon les instructions",
      "Coupez le boeuf en morceaux et faites-le revenir",
      "Ajoutez le potiron coupe en cubes",
      "Melangez avec les lentilles cuites",
      "Arrosez d'huile d'olive et servez tiede"
    ]
  },
  {
    id: "4",
    image: turkeySweetPotatoPuree,
    title: "Puree de patate douce, dinde et courgette",
    subtitle: "Anti-inflammatoire naturel",
    ingredients: ["250g de filet de dinde", "300g de patate douce", "150g de courgette", "Une pincee de curcuma"],
    benefits: "Anti-inflammatoire, leger et nourrissant",
    season: "autumn-winter",
    prepTime: "35 min",
    servings: "2-3 portions",
    instructions: [
      "Faites cuire la patate douce jusqu'a ce qu'elle soit tendre",
      "Cuisez la dinde et la courgette separement",
      "Ecrasez la patate douce en puree",
      "Ajoutez le curcuma",
      "Incorporez la dinde et la courgette coupees en morceaux"
    ]
  },
  {
    id: "5",
    image: salmonRiceSpinach,
    title: "Filet de saumon, riz complet et epinards",
    subtitle: "Eclat printanier",
    ingredients: ["200g de saumon", "100g de riz complet", "100g d'epinards frais", "1 c. a cafe d'huile de lin"],
    benefits: "Omega-3, peau et poil brillants",
    season: "spring-summer",
    prepTime: "25 min",
    servings: "2 portions",
    instructions: [
      "Faites cuire le riz complet selon les instructions",
      "Cuisez le saumon a la vapeur ou au four",
      "Faites revenir brievement les epinards",
      "Melangez tous les ingredients",
      "Ajoutez l'huile de lin avant de servir"
    ]
  },
  {
    id: "6",
    image: chickenCarrotsGreenBeans,
    title: "Poulet, carottes et haricots verts vapeur",
    subtitle: "Fraicheur digestive",
    ingredients: ["300g de poulet", "150g de carottes", "150g de haricots verts", "1 c. a soupe d'huile de tournesol"],
    benefits: "Repas digeste et hydratant",
    season: "spring-summer",
    prepTime: "25 min",
    servings: "2-3 portions",
    instructions: [
      "Faites cuire le poulet a la vapeur",
      "Coupez les carottes en rondelles",
      "Cuisez les legumes a la vapeur",
      "Melangez avec le poulet coupe en morceaux",
      "Arrosez d'huile de tournesol"
    ]
  },
  {
    id: "7",
    image: blueberrySmoothie,
    title: "Smoothie rafraichissant myrtilles et yaourt",
    subtitle: "Energie douce",
    ingredients: ["100g de myrtilles", "150g de yaourt nature", "30g de flocons d'avoine", "1 c. a cafe de miel"],
    benefits: "Antioxydants, energie douce",
    season: "spring-summer",
    prepTime: "5 min",
    servings: "1-2 portions",
    instructions: [
      "Mixez les myrtilles avec le yaourt",
      "Ajoutez les flocons d'avoine",
      "Incorporez le miel",
      "Mixez jusqu'a obtenir une texture lisse",
      "Servez frais"
    ]
  },
  {
    id: "8",
    image: beefRiceBalls,
    title: "Boulettes de boeuf et riz au persil",
    subtitle: "Proteines faciles",
    ingredients: ["250g de boeuf hache", "100g de riz cuit", "Persil frais", "1 c. a soupe d'huile d'olive"],
    benefits: "Proteines faciles a digerer, vitamine C",
    season: "spring-summer",
    prepTime: "30 min",
    servings: "2-3 portions",
    instructions: [
      "Melangez le boeuf hache avec le riz cuit",
      "Ajoutez le persil hache finement",
      "Formez des petites boulettes",
      "Faites cuire les boulettes a la poele",
      "Servez tiede avec un filet d'huile d'olive"
    ]
  },
  {
    id: "9",
    image: greenOmelette,
    title: "Omelette de legumes verts et flocons d'avoine",
    subtitle: "Legerete estivale",
    ingredients: ["2 oeufs", "100g de courgette", "50g de petits pois", "30g de flocons d'avoine", "Persil frais"],
    benefits: "Fibres et proteines, legere pour l'ete",
    season: "spring-summer",
    prepTime: "15 min",
    servings: "1-2 portions",
    instructions: [
      "Battez les oeufs avec les flocons d'avoine",
      "Coupez la courgette en petits des",
      "Faites revenir les legumes",
      "Versez le melange d'oeufs sur les legumes",
      "Cuisez jusqu'a ce que l'omelette soit ferme"
    ]
  },
  {
    id: "10",
    image: bananaBites,
    title: "Friandises Banana Bites",
    subtitle: "Douceur naturelle",
    ingredients: ["2 bananes mures", "100g de beurre de cacahuete naturel", "150g de farine d'avoine"],
    benefits: "Friandises maison saines, faciles a emporter",
    season: "spring-summer",
    prepTime: "25 min",
    servings: "15-20 bouchees",
    instructions: [
      "Ecrasez les bananes en puree",
      "Melangez avec le beurre de cacahuete",
      "Incorporez la farine d'avoine progressivement",
      "Formez de petites boulettes",
      "Faites cuire au four a 180C pendant 15 minutes",
      "Laissez refroidir completement avant de servir"
    ]
  }
];

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-title">Recette introuvable</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-64 md:h-80">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="secondary"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-title leading-tight">
            {recipe.title}
          </h1>
          <p className="text-lg text-primary font-medium">{recipe.subtitle}</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-foreground">{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-foreground">{recipe.servings}</span>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ChefHat className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-title mb-1">Benefices</h3>
                <p className="text-sm text-foreground">{recipe.benefits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Ingredients</h2>
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Preparation</h2>
          <Card>
            <CardContent className="p-4">
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground flex-1 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50 border-dashed">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ces recettes sont donnees a titre indicatif. Consultez votre veterinaire pour adapter l'alimentation de votre chien selon son age, sa race et ses besoins specifiques.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
