import type { RecipeInput } from './types';

export const recipeDefaults = Object.freeze({
  weight: 750,
  hydration: 70,
  starter: 20,
  salt: 2,
}) satisfies RecipeInput;
