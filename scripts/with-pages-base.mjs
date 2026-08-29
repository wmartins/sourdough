import { spawnSync } from 'node:child_process';

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Expected a command to run with the GitHub Pages base path.');
  process.exit(1);
}

const result = spawnSync(command, args, {
  env: { ...process.env, BASE_PATH: '/sourdough/' },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
