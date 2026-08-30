import { describe, expect, it } from 'vitest';

import { recipeDefaults } from '../domain/recipe/defaults';
import {
  parseRecipeSearchParams,
  serializeRecipeSearchParams,
} from './recipeSearchParams';

describe('parseRecipeSearchParams', () => {
  it('parses a complete recipe including decimals', () => {
    const recipe = parseRecipeSearchParams(
      '?weight=825.5&hydration=72.25&starter=18.5&salt=2.1',
    );

    expect(recipe).toEqual({
      weight: 825.5,
      hydration: 72.25,
      starter: 18.5,
      salt: 2.1,
    });
  });

  it('falls back per field for missing, empty, and non-finite values', () => {
    const recipe = parseRecipeSearchParams(
      '?weight=&hydration=not-a-number&starter=Infinity',
    );

    expect(recipe).toEqual(recipeDefaults);
  });

  it('falls back for non-positive weight and negative percentages', () => {
    expect(
      parseRecipeSearchParams('?weight=0&hydration=-1&starter=-2&salt=-3'),
    ).toEqual(recipeDefaults);
  });

  it('ignores unrelated query parameters', () => {
    expect(parseRecipeSearchParams('?weight=900&campaign=summer')).toEqual({
      ...recipeDefaults,
      weight: 900,
    });
  });
});

describe('serializeRecipeSearchParams', () => {
  it('always emits all fields in the public order', () => {
    const params = serializeRecipeSearchParams({
      weight: 825.5,
      hydration: 72.25,
      starter: 18.5,
      salt: 2.1,
    });

    expect(params.toString()).toBe(
      'weight=825.5&hydration=72.25&starter=18.5&salt=2.1',
    );
  });

  it('round-trips a recipe without depending on the defaults', () => {
    const recipe = {
      weight: 1_250,
      hydration: 80,
      starter: 12.5,
      salt: 1.8,
    };

    expect(
      parseRecipeSearchParams(serializeRecipeSearchParams(recipe)),
    ).toEqual(recipe);
  });
});
