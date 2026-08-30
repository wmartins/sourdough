import { createContext, useContext } from 'react';

import type { Appearance } from '../lib/appearance';

export type AppearanceContextValue = {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
};

export const AppearanceContext = createContext<
  AppearanceContextValue | undefined
>(undefined);

export function useAppearance(): AppearanceContextValue {
  const value = useContext(AppearanceContext);

  if (!value) {
    throw new Error('useAppearance must be used within AppearanceProvider.');
  }

  return value;
}
