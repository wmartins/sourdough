import { Selector } from '@astryxdesign/core/Selector';

import { useAppearance } from '../hooks/useAppearance';
import { isAppearance } from '../lib/appearance';

const options = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function AppearanceSelector() {
  const { appearance, setAppearance } = useAppearance();

  return (
    <Selector
      label="Appearance"
      options={options}
      value={appearance}
      width="100%"
      onChange={(value) => {
        if (isAppearance(value)) {
          setAppearance(value);
        }
      }}
    />
  );
}
