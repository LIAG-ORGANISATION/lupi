import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRecipes, getCurrentPeriod } from "@/hooks/useRecipes";
import { Loader2 } from "lucide-react";

const ATTENTION_MESSAGE = "Les doses sont données à titre indicatif pour les chiens de 10-15 kilos. Pensez à ajuster les portions en fonction de la taille de votre chien. Toujours servir la nourriture tiède ou froide, avec un bol d'eau à disposition. Attention également si votre chien souffre d'allergie. En cas de doute, consultez votre vétérinaire. Si vous décidez de donner ce type d'alimentation à votre chien de manière constante, nous vous recommandons de vous rapprocher d'un professionnel afin de bien déterminer tous les apports nécessaires dans l'alimentation de votre chien.";

export const SeasonalRecipes = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { recipes, loading, error, hasMore, loadMore, currentPeriod } = useRecipes();

  const periodLabel = currentPeriod === 'hiver' ? 'hiver' : 'printemps';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-title">Recettes du moment</h2>
        </div>
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              Erreur lors du chargement des recettes : {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-title">Recettes du moment</h2>
        <p className="text-sm text-muted-foreground">
          Sélection de saison : {periodLabel}
        </p>
      </div>
      
      {loading && recipes.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recipes.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Aucune recette disponible pour cette période.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: Horizontal scroll */}
          {isMobile ? (
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="flex-shrink-0 w-[280px] snap-start overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-title text-base leading-tight">{recipe.title}</h3>
                      <p className="text-xs text-primary font-medium">{recipe.category}</p>
                    </div>
                    
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{recipe.total_time}</span>
                      <span>•</span>
                      <span>{recipe.portions}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recipe.ingredients}
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
              {recipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-title text-base leading-tight">{recipe.title}</h3>
                      <p className="text-xs text-primary font-medium">{recipe.category}</p>
                    </div>
                    
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{recipe.total_time}</span>
                      <span>•</span>
                      <span>{recipe.portions}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recipe.ingredients}
                    </p>
                    
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-foreground font-medium">{recipe.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  'Charger plus de recettes'
                )}
              </Button>
            </div>
          )}
        </>
      )}
      
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {ATTENTION_MESSAGE}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
