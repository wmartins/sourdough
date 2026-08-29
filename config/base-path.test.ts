import { describe, expect, it } from 'vitest';

import { resolveBasePath } from './base-path.ts';

describe('resolveBasePath', () => {
  it.each([undefined, '', '/'])(
    'uses the site root for %s',
    (configuredPath) => {
      expect(resolveBasePath(configuredPath)).toEqual({
        assetBase: '/',
        basename: '/',
      });
    },
  );

  it('normalizes a GitHub Pages project path', () => {
    expect(resolveBasePath('sourdough///')).toEqual({
      assetBase: '/sourdough/',
      basename: '/sourdough/',
    });
  });
});
