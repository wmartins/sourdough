import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { AppearanceProvider } from '../../components/AppearanceProvider';
import IndexRoute from './route';

function QueryState() {
  return <output aria-label="Current query">{useLocation().search}</output>;
}

function renderRoute(entry = '/') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <AppearanceProvider>
        <IndexRoute />
        <QueryState />
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
    ).toHaveValue('900');
    expect(screen.getByRole('main')).toHaveTextContent(/flour478.4 g/i);
    expect(
      screen.getByRole('button', { name: /copy recipe link/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /inside the starter/i }),
    ).not.toBeInTheDocument();
  });

  it('restores a recipe from the URL', async () => {
    renderRoute('/?weight=825.5&hydration=72.25&starter=18.5&salt=2.1');

    expect(await screen.findByDisplayValue('825.5')).toHaveAccessibleName(
      /total dough weight/i,
    );
    expect(screen.getByRole('main')).toHaveTextContent(
      /825.5 g total · 72.25% hydration/i,
    );
    expect(
      screen.getByRole('slider', { name: /^hydration$/i }),
    ).toHaveAttribute('aria-valuenow', '72.25');
    expect(screen.getByRole('slider', { name: /starter/i })).toHaveAttribute(
      'aria-valuenow',
      '18.5',
    );
    expect(screen.getByRole('slider', { name: /salt/i })).toHaveAttribute(
      'aria-valuenow',
      '2.1',
    );
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it('updates the recipe and URL while the weight field is focused', () => {
    renderRoute();

    const weight = screen.getByRole('spinbutton', {
      name: /total dough weight/i,
    });

    weight.focus();
    fireEvent.input(weight, { target: { value: '800' } });

    expect(weight).toHaveFocus();
    expect(screen.getByRole('main')).toHaveTextContent(/800 g total/i);
    expect(
      screen.getByRole('status', { name: /current query/i }),
    ).toHaveTextContent('?weight=800&hydration=65&starter=25&salt=2.5');
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
    expect(screen.getByRole('main')).toHaveTextContent(/flour478.4 g/i);
  });
});
