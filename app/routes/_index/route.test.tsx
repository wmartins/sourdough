import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import IndexRoute from './route';

describe('IndexRoute', () => {
  it('renders meaningful bootstrap content', () => {
    render(
      <MemoryRouter>
        <IndexRoute />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /better bread starts with a balanced recipe/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent(
      /calculator controls arrive in the next milestone/i,
    );
  });

  it('restores a recipe from the URL', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/?weight=825.5&hydration=72.25&starter=18.5&salt=2.1',
        ]}
      >
        <IndexRoute />
      </MemoryRouter>,
    );

    expect(screen.getByRole('main')).toHaveTextContent(
      /loaded recipe: 825.5 g at 72.25% hydration, with 18.5% starter and 2.1% salt/i,
    );
  });
});
