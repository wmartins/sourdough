import { recipeDefaults } from '../domain/recipe/defaults';
import type { RecipeInput } from '../domain/recipe/types';

export function isRecipeValueValid(
  field: keyof RecipeInput,
  value: number,
): boolean {
  return (
    Number.isFinite(value) && (field === 'weight' ? value > 0 : value >= 0)
  );
}

function parseValue(
  field: keyof RecipeInput,
  value: string | null,
  fallback: number,
): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  return isRecipeValueValid(field, parsed) ? parsed : fallback;
}

export function parseRecipeSearchParams(
  source: string | URLSearchParams,
): RecipeInput {
  const params =
    typeof source === 'string' ? new URLSearchParams(source) : source;

  return {
    weight: parseValue('weight', params.get('weight'), recipeDefaults.weight),
    hydration: parseValue(
      'hydration',
      params.get('hydration'),
      recipeDefaults.hydration,
    ),
    starter: parseValue(
      'starter',
      params.get('starter'),
      recipeDefaults.starter,
    ),
    salt: parseValue('salt', params.get('salt'), recipeDefaults.salt),
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
