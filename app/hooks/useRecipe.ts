import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { calculateRecipe } from '../domain/recipe/calculate';
import { recipeDefaults } from '../domain/recipe/defaults';
import type { RecipeInput } from '../domain/recipe/types';
import {
  isRecipeValueValid,
  parseRecipeSearchParams,
  serializeRecipeSearchParams,
} from '../lib/recipeSearchParams';

export type RecipeField = keyof RecipeInput;
export type RecipeDraft = Record<RecipeField, string>;

const completeNumber = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i;

function toDraft(recipe: RecipeInput): RecipeDraft {
  return {
    weight: String(recipe.weight),
    hydration: String(recipe.hydration),
    starter: String(recipe.starter),
    salt: String(recipe.salt),
  };
}

function parseDraft(value: string): number | null {
  const trimmed = value.trim();

  if (!completeNumber.test(trimmed)) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}

export function useRecipe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const urlRecipe = useMemo(() => parseRecipeSearchParams(search), [search]);
  const [recipe, setRecipe] = useState<RecipeInput>(recipeDefaults);
  const [draft, setDraft] = useState<RecipeDraft>(() =>
    toDraft(recipeDefaults),
  );

  useEffect(() => {
    setRecipe(urlRecipe);
    setDraft(toDraft(urlRecipe));
  }, [urlRecipe]);

  function updateDraft(field: RecipeField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));

    const committed = parseDraft(value);

    if (committed === null || !isRecipeValueValid(field, committed)) {
      return;
    }

    const next = { ...recipe, [field]: committed };

    setRecipe(next);
    setSearchParams(serializeRecipeSearchParams(next), {
      preventScrollReset: true,
      replace: true,
    });
  }

  const result = useMemo(() => calculateRecipe(recipe), [recipe]);
  const isComplete = (Object.keys(draft) as RecipeField[]).every((field) => {
    const value = parseDraft(draft[field]);

    return value !== null && isRecipeValueValid(field, value);
  });

  return { draft, isComplete, recipe, result, updateDraft };
}
