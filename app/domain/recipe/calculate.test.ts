import { describe, expect, it } from 'vitest';

import { calculateRecipe } from './calculate';
import { recipeDefaults } from './defaults';

describe('calculateRecipe', () => {
  it('calculates the default 900 g recipe', () => {
    const recipe = calculateRecipe(recipeDefaults);

    expect(recipe.hydration).toBe(65);
    expect(recipe.flour).toBeCloseTo(478.405_315_614_617_96);
    expect(recipe.water).toBeCloseTo(290.033_222_591_362_1);
    expect(recipe.starter.total).toBeCloseTo(119.601_328_903_654_49);
    expect(recipe.starter.flour).toBeCloseTo(59.800_664_451_827_245);
    expect(recipe.starter.water).toBeCloseTo(59.800_664_451_827_245);
    expect(recipe.salt).toBeCloseTo(11.960_132_890_365_449);
  });

  it('preserves the requested total dough weight', () => {
    const input = {
      weight: 923.5,
      hydration: 76.25,
      starter: 18.5,
      salt: 2.2,
    };
    const recipe = calculateRecipe(input);
    const total =
      recipe.flour + recipe.water + recipe.starter.total + recipe.salt;

    expect(total).toBeCloseTo(input.weight, 10);
  });

  it('produces the requested true hydration', () => {
    const recipe = calculateRecipe({
      weight: 1_000,
      hydration: 82.5,
      starter: 15,
      salt: 2.1,
    });
    const totalFlour = recipe.flour + recipe.starter.flour;
    const totalWater = recipe.water + recipe.starter.water;

    expect((totalWater / totalFlour) * 100).toBeCloseTo(82.5, 10);
  });

  it('splits a 100%-hydrated starter equally', () => {
    const recipe = calculateRecipe(recipeDefaults);

    expect(recipe.starter.flour).toBeCloseTo(recipe.starter.water, 10);
    expect(recipe.starter.flour + recipe.starter.water).toBeCloseTo(
      recipe.starter.total,
      10,
    );
  });
});
