import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export type RecipePeriod = 'hiver' | 'printemps';

const RECIPES_PER_PAGE = 10;

/**
 * Determine the current recipe period based on the date
 * Hiver: December 1st to March 1st (inclusive)
 * Printemps: March 2nd to June 1st (inclusive)
 */
export const getCurrentPeriod = (): RecipePeriod => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Hiver: Dec (12), Jan (1), Feb (2), or March 1st
  if (month === 12 || month === 1 || month === 2 || (month === 3 && day === 1)) {
    return 'hiver';
  }
  
  // Printemps: March 2nd to June 1st
  if ((month === 3 && day > 1) || month === 4 || month === 5 || (month === 6 && day === 1)) {
    return 'printemps';
  }

  // Default to hiver for other months (fallback)
  return 'hiver';
};

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  const currentPeriod = getCurrentPeriod();

  const fetchRecipes = useCallback(async (page: number, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const from = page * RECIPES_PER_PAGE;
      const to = from + RECIPES_PER_PAGE - 1;

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('period', currentPeriod)
        .order('created_at', { ascending: true })
        .range(from, to);

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        if (reset) {
          setRecipes(data);
        } else {
          setRecipes(prev => [...prev, ...data]);
        }
        
        // Check if there are more recipes to load
        setHasMore(data.length === RECIPES_PER_PAGE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPeriod]);

  // Load initial recipes
  useEffect(() => {
    setRecipes([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchRecipes(0, true);
  }, [currentPeriod, fetchRecipes]); // Re-fetch when period changes

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecipes(nextPage, false);
    }
  }, [loading, hasMore, currentPage, fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    hasMore,
    loadMore,
    currentPeriod,
  };
};

