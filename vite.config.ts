import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

import { resolveBasePath } from './config/base-path.ts';

const { assetBase } = resolveBasePath(process.env.BASE_PATH);

export default defineConfig({
  base: assetBase,
  plugins: [reactRouter()],
});
