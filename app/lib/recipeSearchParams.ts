import { recipeDefaults } from '../domain/recipe/defaults';
import type { RecipeInput } from '../domain/recipe/types';

function parseValue(value: string | null, fallback: number): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseRecipeSearchParams(
  source: string | URLSearchParams,
): RecipeInput {
  const params =
    typeof source === 'string' ? new URLSearchParams(source) : source;

  return {
    weight: parseValue(params.get('weight'), recipeDefaults.weight),
    hydration: parseValue(params.get('hydration'), recipeDefaults.hydration),
    starter: parseValue(params.get('starter'), recipeDefaults.starter),
    salt: parseValue(params.get('salt'), recipeDefaults.salt),
  };
}

export function serializeRecipeSearchParams(
  recipe: RecipeInput,
): URLSearchParams {
  return new URLSearchParams([
    ['weight', String(recipe.weight)],
    ['hydration', String(recipe.hydration)],
    ['starter', String(recipe.starter)],
    ['salt', String(recipe.salt)],
  ]);
}
