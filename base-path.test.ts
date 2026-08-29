import { describe, expect, it } from 'vitest';

import { resolveBase } from './base-path.ts';

describe('resolveBase', () => {
  it.each([undefined, '', '/'])('uses the site root for %s', (configured) => {
    expect(resolveBase(configured)).toBe('/');
  });

  it('normalizes a GitHub Pages project path', () => {
    expect(resolveBase('sourdough///')).toBe('/sourdough/');
  });
});
