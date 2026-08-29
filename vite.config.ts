import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

import { resolveBase } from './base-path.ts';

const base = resolveBase(process.env.BASE_PATH);

export default defineConfig({
  base,
  plugins: [reactRouter()],
});
