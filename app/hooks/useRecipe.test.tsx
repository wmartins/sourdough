import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type NavigateFunction,
} from 'react-router';
import { describe, expect, it } from 'vitest';

import { useRecipe } from './useRecipe';

function setup(entries: string[], index = entries.length - 1) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={entries} initialIndex={index}>
        {children}
      </MemoryRouter>
    );
  }

  return renderHook(
    () => ({
      form: useRecipe(),
      location: useLocation(),
      navigate: useNavigate(),
    }),
    { wrapper: Wrapper },
  );
}

describe('useRecipe', () => {
  it('initializes committed and draft state from the URL', () => {
    const { result } = setup([
      '/?weight=825.5&hydration=72.25&starter=18.5&salt=2.1',
    ]);

    expect(result.current.form.recipe).toEqual({
      weight: 825.5,
      hydration: 72.25,
      starter: 18.5,
      salt: 2.1,
    });
    expect(result.current.form.draft).toEqual({
      weight: '825.5',
      hydration: '72.25',
      starter: '18.5',
      salt: '2.1',
    });
    expect(result.current.form.result.flour).toBeCloseTo(433.827_224_563, 6);
  });

  it('keeps unusable drafts out of the recipe and URL', () => {
    const { result } = setup(['/']);

    act(() => result.current.form.updateDraft('weight', '-10'));

    expect(result.current.form.draft.weight).toBe('-10');
    expect(result.current.form.isComplete).toBe(false);
    expect(result.current.form.recipe.weight).toBe(750);
    expect(result.current.location.search).toBe('');
  });

  it('keeps temporary text local and replaces the URL for valid edits', async () => {
    const { result } = setup(['/']);

    act(() => result.current.form.updateDraft('hydration', ''));

    expect(result.current.form.draft.hydration).toBe('');
    expect(result.current.location.search).toBe('');
    expect(result.current.form.recipe.hydration).toBe(70);

    act(() => result.current.form.updateDraft('hydration', '72.5'));

    await waitFor(() => {
      expect(result.current.location.search).toBe(
        '?weight=750&hydration=72.5&starter=20&salt=2',
      );
    });
    expect(result.current.form.recipe.hydration).toBe(72.5);
  });

  it('synchronizes committed and draft state with Back and Forward', async () => {
    const first = '/?weight=600&hydration=68&starter=15&salt=2';
    const second = '/?weight=800&hydration=75&starter=20&salt=2';
    const { result } = setup([first, second]);

    act(() => result.current.form.updateDraft('salt', '2.5'));

    await waitFor(() => {
      expect(result.current.form.recipe.salt).toBe(2.5);
    });

    act(() => result.current.navigate(-1));

    await expectRecipeWeight(result, 600);

    act(() => result.current.navigate(1));

    await expectRecipeWeight(result, 800);
    expect(result.current.form.recipe.salt).toBe(2.5);
    expect(result.current.form.draft.salt).toBe('2.5');
  });
});

async function expectRecipeWeight(
  result: {
    current: {
      form: ReturnType<typeof useRecipe>;
      navigate: NavigateFunction;
    };
  },
  weight: number,
) {
  await waitFor(() => {
    expect(result.current.form.recipe.weight).toBe(weight);
    expect(result.current.form.draft.weight).toBe(String(weight));
  });
}
