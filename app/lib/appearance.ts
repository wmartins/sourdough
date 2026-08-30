export const appearanceStorageKey = 'sourdough-appearance';

export const appearances = ['system', 'light', 'dark'] as const;

export type Appearance = (typeof appearances)[number];

export function isAppearance(value: string | null): value is Appearance {
  return appearances.some((appearance) => appearance === value);
}

export const restoreAppearanceScript = `(()=>{try{const mode=localStorage.getItem('${appearanceStorageKey}');if(mode==='light'||mode==='dark'){document.documentElement.setAttribute('data-theme',mode)}else{document.documentElement.removeAttribute('data-theme')}}catch{}})()`;
