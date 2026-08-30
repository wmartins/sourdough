import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { AppearanceProvider } from '../../components/AppearanceProvider';
import IndexRoute from './route';

function renderRoute(entry = '/') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <AppearanceProvider>
        <IndexRoute />
      </AppearanceProvider>
    </MemoryRouter>,
  );
}

describe('IndexRoute', () => {
  it('renders the default calculator and result', () => {
    renderRoute();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /build a loaf that adds up/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /total dough weight/i }),
    ).toHaveValue('750');
    expect(screen.getByRole('main')).toHaveTextContent(/flour396.8 g/i);
    expect(
      screen.getByRole('button', { name: /copy recipe link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /inside the starter/i }),
    ).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(
      screen.getByRole('button', { name: /inside the starter/i }),
    );

    expect(screen.getByText(/equal flour and water/i)).toBeVisible();
  });

  it('restores a recipe from the URL', async () => {
    renderRoute('/?weight=825.5&hydration=72.25&starter=18.5&salt=2.1');

    expect(await screen.findByDisplayValue('825.5')).toHaveAccessibleName(
      /total dough weight/i,
    );
    expect(screen.getByRole('main')).toHaveTextContent(
      /825.5 g total · 72.25% true hydration/i,
    );
    expect(
      screen.getByRole('combobox', { name: /appearance/i }),
    ).toBeInTheDocument();
  });

  it('keeps the last valid result when a required field is cleared', () => {
    renderRoute();

    fireEvent.click(
      screen.getByRole('button', { name: /clear total dough weight/i }),
    );

    expect(screen.getByText(/enter a dough weight/i)).toBeVisible();
    expect(screen.getByRole('main')).toHaveTextContent(
      /complete every field to update this last valid recipe/i,
    );
    expect(screen.getByRole('main')).toHaveTextContent(/flour396.8 g/i);
  });
});
