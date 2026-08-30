import { LayerProvider } from '@astryxdesign/core/Layer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { calculateRecipe } from '../domain/recipe/calculate';
import { recipeDefaults } from '../domain/recipe/defaults';
import { createRecipeUrl, RecipeResult } from './RecipeResult';

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
});

describe('createRecipeUrl', () => {
  it('preserves the route while replacing search and hash state', () => {
    expect(
      createRecipeUrl(
        'https://wmartins.github.io/sourdough/?old=true#result',
        recipeDefaults,
      ),
    ).toBe(
      'https://wmartins.github.io/sourdough/?weight=900&hydration=65&starter=25&salt=2.5',
    );
  });
});

describe('RecipeResult', () => {
  it('copies the deterministic absolute recipe URL', async () => {
    window.history.replaceState(null, '', '/sourdough/?old=true#result');
    const expected = createRecipeUrl(window.location.href, recipeDefaults);

    render(
      <LayerProvider>
        <RecipeResult
          input={recipeDefaults}
          isCurrent
          result={calculateRecipe(recipeDefaults)}
        />
      </LayerProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy recipe link' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expected));
    expect(
      await screen.findByRole('button', { name: 'Recipe link copied' }),
    ).toBeInTheDocument();
  });
});
