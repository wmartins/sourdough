import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from '@playwright/test';

test('production output contains meaningful static HTML for every route', async () => {
  const html = await readFile(path.resolve('build/client/index.html'), 'utf8');

  expect(html).toContain('Build a loaf that adds up.');
  expect(html).toContain('396.8 g');
  expect(html).toContain('/sourdough/assets/');
  expect(html).toContain('https://wmartins.github.io/sourdough/');
});
