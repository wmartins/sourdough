# Sourdough

A static React Router application for calculating and sharing a sourdough
recipe.

## Requirements

- Node.js 22.13 or later (the repository pins 22.14 for local development)
- npm

## Development

```sh
npm ci
npm run dev
```

The normal development URL uses `/`. Use `npm run dev:pages` to run with the
planned GitHub Pages basename, `/sourdough/`.

## Quality checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` runs the complete sequence. `npm run build:pages` creates the
production artifact with both React Router's basename and Vite's asset base set
to `/sourdough/`, then flattens React Router 7's basename-prefixed prerender
directory for GitHub Pages; serve that artifact with `npm run preview:pages`.

Biome handles source-code linting and formatting. Prettier is retained only for
Markdown files, which Biome does not format yet.

Set `BASE_PATH` to another path when invoking React Router or Vite directly to
target a future project path or `/` for a custom domain.

## Astryx

The app uses Astryx's pre-built Butter theme. Run `npm run astryx:doctor` to
check the integration, and use the generated guidance in `AGENTS.md` before
adding or changing UI.
