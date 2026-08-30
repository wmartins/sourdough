import type { RecipeInput, RecipeResult } from './types';

export function calculateRecipe({
  weight,
  hydration,
  starter,
  salt,
}: RecipeInput): RecipeResult {
  const starterFlour = starter / 2;
  const starterWater = starter / 2;
  const water = (hydration / 100) * (100 + starterFlour) - starterWater;
  const factor = 100 + water + starter + salt;
  const multiplier = weight / factor;

  return {
    hydration,
    flour: 100 * multiplier,
    water: water * multiplier,
    starter: {
      total: starter * multiplier,
      flour: starterFlour * multiplier,
      water: starterWater * multiplier,
    },
    salt: salt * multiplier,
  };
}
