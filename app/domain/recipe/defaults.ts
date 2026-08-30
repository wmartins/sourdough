import type { RecipeInput } from './types';

export const recipeDefaults = Object.freeze({
  weight: 900,
  hydration: 65,
  starter: 25,
  salt: 2.5,
}) satisfies RecipeInput;
