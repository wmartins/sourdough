import { LayerProvider } from '@astryxdesign/core/Layer';
import { Theme } from '@astryxdesign/core/theme';
import { butterTheme } from '@astryxdesign/theme-butter/built';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import {
  AppearanceContext,
  type AppearanceContextValue,
} from '../hooks/useAppearance';
import {
  type Appearance,
  appearanceStorageKey,
  isAppearance,
} from '../lib/appearance';

const useClientLayoutEffect =
  typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>('system');

  useClientLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(appearanceStorageKey);

      if (isAppearance(stored)) {
        setAppearanceState(stored);
      }
    } catch {
      // System mode remains available when storage is unavailable.
    }
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next);

    try {
      localStorage.setItem(appearanceStorageKey, next);
    } catch {
      // The in-memory preference still applies for this visit.
    }
  }, []);

  const value = useMemo<AppearanceContextValue>(
    () => ({ appearance, setAppearance }),
    [appearance, setAppearance],
  );

  return (
    <AppearanceContext.Provider value={value}>
      <Theme theme={butterTheme} mode={appearance}>
        <LayerProvider>{children}</LayerProvider>
      </Theme>
    </AppearanceContext.Provider>
  );
}
