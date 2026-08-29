import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import IndexRoute from './route';

describe('IndexRoute', () => {
  it('renders meaningful bootstrap content', () => {
    render(<IndexRoute />);

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
});
