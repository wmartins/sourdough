import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAppearance } from '../hooks/useAppearance';
import { appearanceStorageKey } from '../lib/appearance';
import { AppearanceProvider } from './AppearanceProvider';

function AppearanceControls() {
  const { appearance, setAppearance } = useAppearance();

  return (
    <>
      <output>{appearance}</output>
      <button type="button" onClick={() => setAppearance('light')}>
        Use light
      </button>
      <button type="button" onClick={() => setAppearance('system')}>
        Use system
      </button>
    </>
  );
}

describe('AppearanceProvider', () => {
  it('uses system mode on a first visit', () => {
    render(
      <AppearanceProvider>
        <AppearanceControls />
      </AppearanceProvider>,
    );

    expect(screen.getByText('system')).toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('restores a stored explicit mode', async () => {
    localStorage.setItem(appearanceStorageKey, 'dark');

    render(
      <AppearanceProvider>
        <AppearanceControls />
      </AppearanceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('dark')).toBeInTheDocument();
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  it('persists light and system choices', async () => {
    render(
      <AppearanceProvider>
        <AppearanceControls />
      </AppearanceProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Use light' }));

    await waitFor(() => {
      expect(localStorage.getItem(appearanceStorageKey)).toBe('light');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Use system' }));

    await waitFor(() => {
      expect(localStorage.getItem(appearanceStorageKey)).toBe('system');
      expect(document.documentElement).not.toHaveAttribute('data-theme');
    });
  });
});
