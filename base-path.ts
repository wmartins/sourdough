export function resolveBase(value?: string): string {
  const configured = value?.trim() || '/';
  const path = configured.startsWith('/') ? configured : `/${configured}`;
  const base = path.replace(/\/+$/, '');

  return base ? `${base}/` : '/';
}
