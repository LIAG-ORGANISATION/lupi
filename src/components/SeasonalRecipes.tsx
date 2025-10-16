import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
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
}

const recipes: Recipe[] = [
  {
    id: "1",
    image: chickenSweetPotato,
    title: "Ragout de poulet, patate douce et carottes",
    subtitle: "Douceur d'automne",
    ingredients: ["poulet", "patate douce", "carottes", "huile de colza", "persil"],
    benefits: "Riche en fibres et beta-carotene",
    season: "autumn-winter"
  },
  {
    id: "2",
    image: applePearOatmeal,
    title: "Compotee pomme-poire et flocons d'avoine",
    subtitle: "Douceur digestive",
    ingredients: ["pommes", "poires", "flocons d'avoine", "yaourt nature"],
    benefits: "Douceur digestive et apport en fibres",
    season: "autumn-winter"
  },
  {
    id: "3",
    image: beefPumpkinLentils,
    title: "Boeuf, potiron et lentilles vertes",
    subtitle: "Force et vitalite",
    ingredients: ["viande de boeuf maigre", "potiron", "lentilles vertes", "huile d'olive"],
    benefits: "Riche en proteines et fer",
    season: "autumn-winter"
  },
  {
    id: "4",
    image: turkeySweetPotatoPuree,
    title: "Puree de patate douce, dinde et courgette",
    subtitle: "Anti-inflammatoire naturel",
    ingredients: ["filet de dinde", "patate douce", "courgette", "curcuma doux"],
    benefits: "Anti-inflammatoire, leger et nourrissant",
    season: "autumn-winter"
  },
  {
    id: "5",
    image: salmonRiceSpinach,
    title: "Filet de saumon, riz complet et epinards",
    subtitle: "Eclat printanier",
    ingredients: ["saumon", "riz complet", "epinards frais", "huile de lin"],
    benefits: "Omega-3, peau et poil brillants",
    season: "spring-summer"
  },
  {
    id: "6",
    image: chickenCarrotsGreenBeans,
    title: "Poulet, carottes et haricots verts vapeur",
    subtitle: "Fraicheur digestive",
    ingredients: ["poulet", "carottes", "haricots verts", "huile de tournesol"],
    benefits: "Repas digeste et hydratant",
    season: "spring-summer"
  },
  {
    id: "7",
    image: blueberrySmoothie,
    title: "Smoothie rafraichissant myrtilles et yaourt",
    subtitle: "Energie douce",
    ingredients: ["myrtilles", "yaourt nature", "flocons d'avoine", "miel"],
    benefits: "Antioxydants, energie douce",
    season: "spring-summer"
  },
  {
    id: "8",
    image: beefRiceBalls,
    title: "Boulettes de boeuf et riz au persil",
    subtitle: "Proteines faciles",
    ingredients: ["boeuf hache", "riz", "persil", "huile d'olive"],
    benefits: "Proteines faciles a digerer, vitamine C",
    season: "spring-summer"
  },
  {
    id: "9",
    image: greenOmelette,
    title: "Omelette de legumes verts et flocons d'avoine",
    subtitle: "Legerete estivale",
    ingredients: ["oeufs", "courgette", "petits pois", "avoine", "persil"],
    benefits: "Fibres et proteines, legere pour l'ete",
    season: "spring-summer"
  },
  {
    id: "10",
    image: bananaBites,
    title: "Friandises Banana Bites",
    subtitle: "Douceur naturelle",
    ingredients: ["banane mure", "beurre de cacahuete naturel", "farine d'avoine"],
    benefits: "Friandises maison saines, faciles a emporter",
    season: "spring-summer"
  }
];

export const SeasonalRecipes = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Determine current season (simplified: Oct-Mar = autumn-winter, Apr-Sep = spring-summer)
  const currentMonth = new Date().getMonth();
  const isAutumnWinter = currentMonth >= 9 || currentMonth <= 2; // Oct, Nov, Dec, Jan, Feb, Mar
  
  const currentSeasonRecipes = recipes.filter(recipe => 
    recipe.season === (isAutumnWinter ? "autumn-winter" : "spring-summer")
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-title">Recettes du moment</h2>
        <p className="text-sm text-muted-foreground">
          Selection de saison : {isAutumnWinter ? "automne-hiver" : "printemps-ete"}
        </p>
      </div>
      
      {/* Mobile: Horizontal scroll */}
      {isMobile ? (
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentSeasonRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="flex-shrink-0 w-[280px] snap-start overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-title text-base leading-tight">{recipe.title}</h3>
                  <p className="text-xs text-primary font-medium">{recipe.subtitle}</p>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {recipe.ingredients.join(", ")}
                </p>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-foreground font-medium">{recipe.benefits}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop: Grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSeasonRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-title text-base leading-tight">{recipe.title}</h3>
                  <p className="text-xs text-primary font-medium">{recipe.subtitle}</p>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {recipe.ingredients.join(", ")}
                </p>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-foreground font-medium">{recipe.benefits}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Ces recettes sont donnees a titre indicatif. Consultez votre veterinaire pour adapter l'alimentation de votre chien.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
