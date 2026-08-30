import { describe, expect, it } from 'vitest';

import { calculateRecipe } from './calculate';
import { recipeDefaults } from './defaults';

describe('calculateRecipe', () => {
  it('calculates the default 750 g recipe', () => {
    const recipe = calculateRecipe(recipeDefaults);

    expect(recipe.hydration).toBe(70);
    expect(recipe.flour).toBeCloseTo(396.825_396_825_396_8);
    expect(recipe.water).toBeCloseTo(265.873_015_873_015_85);
    expect(recipe.starter.total).toBeCloseTo(79.365_079_365_079_37);
    expect(recipe.starter.flour).toBeCloseTo(39.682_539_682_539_684);
    expect(recipe.starter.water).toBeCloseTo(39.682_539_682_539_684);
    expect(recipe.salt).toBeCloseTo(7.936_507_936_507_937);
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
