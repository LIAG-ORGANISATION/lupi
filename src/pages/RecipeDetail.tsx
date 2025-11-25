import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, ChefHat, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Recipe = Database['public']['Tables']['recipes']['Row'];

const ATTENTION_MESSAGE = "Ces recettes sont données à titre indicatif. Consultez votre vétérinaire pour adapter l'alimentation de votre chien selon son âge, sa race et ses besoins spécifiques.";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("ID de recette manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error("Recette introuvable");
        }

        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la recette");
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de la recette...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-title">Recette introuvable</h2>
          <p className="text-muted-foreground">{error || "La recette demandée n'existe pas."}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Parse preparation steps from text (numbered list format)
  const parsePreparationSteps = (preparation: string): string[] => {
    // Split by numbered steps (1., 2., etc.) or by newlines
    const steps = preparation
      .split(/\d+\.\s+/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());
    
    // If no numbered steps found, split by newlines
    if (steps.length <= 1) {
      return preparation
        .split('\n')
        .filter(step => step.trim().length > 0)
        .map(step => step.trim());
    }
    
    return steps;
  };

  const preparationSteps = parsePreparationSteps(recipe.preparation);

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-32 md:h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
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
        <div className="text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-title">
            {recipe.title}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <p className="text-lg text-primary font-medium">{recipe.category}</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-foreground">{recipe.total_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-foreground">{recipe.portions}</span>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ChefHat className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-title mb-1">Bénéfices</h3>
                <p className="text-sm text-foreground">{recipe.benefits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Ingrédients</h2>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-foreground whitespace-pre-line">{recipe.ingredients}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-title">Préparation</h2>
          <Card>
            <CardContent className="p-4">
              <ol className="space-y-3">
                {preparationSteps.map((instruction, index) => (
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
              {ATTENTION_MESSAGE}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
