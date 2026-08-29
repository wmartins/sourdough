import type { Config } from '@react-router/dev/config';

import { resolveBasePath } from './config/base-path.ts';

const { basename } = resolveBasePath(process.env.BASE_PATH);

export default {
  basename,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
  prerender: ['/'],
  ssr: false,
} satisfies Config;
