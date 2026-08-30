import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppearance } from '../hooks/useAppearance';

const darkQuery = '(prefers-color-scheme: dark)';

export function AppearanceToggle() {
  const { appearance, setAppearance } = useAppearance();
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(darkQuery);
    const update = () => setSystemDark(query.matches);

    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  const isDark =
    appearance === 'dark' || (appearance === 'system' && systemDark);
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <IconButton
      label={label}
      tooltip={label}
      variant="ghost"
      icon={<Icon icon={isDark ? Sun : Moon} color="accent" />}
      onClick={() => setAppearance(isDark ? 'light' : 'dark')}
    />
  );
}
