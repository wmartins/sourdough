# Sourdough website foundation plan

## 1. Purpose

Build a fast, modern, and playful static website for calculating and sharing a
sourdough recipe. The repository is the source of truth, GitHub Pages is the
production host, and every public route is rendered to static HTML at build
time.

The first release is intentionally focused. It provides one excellent
calculator for flour, water, starter, and salt, while establishing conventions
that later features can extend without replacing the foundation.

The recipe model is defined separately in
[`docs/recipe-calculation.md`](./recipe-calculation.md).

## 2. First-release experience

The home page contains:

- a short, friendly introduction;
- controls for total dough weight in grams, true hydration, starter, and salt;
- a recipe result that updates immediately;
- an optional breakdown of the flour and water contained in the 100%-hydrated
  starter;
- a share action that copies a URL containing the current recipe;
- a light/dark/system appearance control.

The calculator must work entirely in the browser after the static page loads.
There is no account, database, API, or server runtime.

### Working defaults

Preserve the Observable notebook's current starting recipe:

| Value        | Default |
| ------------ | ------: |
| Total weight |   750 g |
| Hydration    |     70% |
| Starter      |     20% |
| Salt         |      2% |

These are product defaults, not constants in the recipe formula. Keep them in
one configuration module so they can be changed without touching calculation
code.

## 3. Technical decisions

### Application platform

- TypeScript in strict mode.
- React 19 or later, which Astryx requires.
- React Router in Framework Mode, using its Vite integration.
- npm and a committed lockfile for the initial project setup.
- No general-purpose state-management library. The calculator is small enough
  for route state, local component state, and pure functions.

Install the current stable compatible releases during implementation and let
the lockfile, rather than this plan, record exact versions.

### File-based routes

Use `@react-router/fs-routes` and expose its `flatRoutes()` result from
`app/routes.ts`. Route modules live under `app/routes`, following React
Router's file-route conventions.

Only `/` is required initially. Use a route folder so its components can be
co-located without becoming routes:

```text
app/
├── components/                 # reusable site-wide components
├── domain/
│   └── recipe/
│       ├── calculate.ts        # pure recipe calculation
│       ├── calculate.test.ts
│       ├── defaults.ts
│       └── types.ts
├── routes/
│   └── _index/
│       ├── route.tsx
│       ├── calculator-form.tsx
│       ├── recipe-result.tsx
│       └── search-params.ts
├── root.tsx                    # document shell and theme provider
├── routes.ts                   # flatRoutes() configuration
└── styles.css                  # Astryx imports and small site-level styles
```

Add future public pages as new files or route folders. Every added public path
must also be included in static pre-rendering and in the direct-navigation
test.

### Static rendering

Configure React Router with:

```typescript
export default {
  ssr: false,
  prerender: ['/'],
} satisfies Config;
```

This disables the need for a deployed runtime server while producing real
static HTML for the calculator. As routes are added, maintain an explicit list
of public paths or switch to `prerender: true` when all routes are static and
that behavior is verified.

The application and every route must remain safe to execute during the Node
build. Browser-only APIs such as `window`, `localStorage`, and `navigator` may
only be accessed in client-safe code or event handlers.

### GitHub Pages base path

Assume the initial project-site URL is:

```text
https://wmartins.github.io/sourdough/
```

React Router's `basename` and Vite's asset `base` must both account for
`/sourdough`. Keep the base path configurable so local development can use `/`
and a future custom domain can also use `/` without a refactor.

Do not depend on server rewrites. GitHub Pages does not provide a general SPA
fallback, so every supported public route must have a generated HTML file.
Query strings do not require separate pre-rendered files.

### Deployment

Create a GitHub Actions workflow that:

1. runs for pull requests as a build/test check;
2. runs the deployment job for pushes to the default branch and manual
   dispatches;
3. installs the pinned Node/npm dependencies with `npm ci`;
4. runs formatting/lint checks, type checking, unit tests, and the production
   build;
5. uploads `build/client` with `actions/upload-pages-artifact`;
6. deploys it with `actions/deploy-pages` to the `github-pages` environment.

Use GitHub's Pages artifact workflow rather than committing generated output to
a `gh-pages` branch. Add a `.nojekyll` file to the published artifact if the
final output contains paths that Jekyll could otherwise ignore.

## 4. Recipe and URL state

### Pure domain calculation

Implement the agreed formula as a small pure function. It accepts already
valid numerical inputs and knows nothing about React, the URL, formatting,
validation messages, or the clipboard.

```typescript
type RecipeInput = {
  weight: number;
  hydration: number;
  starter: number;
  salt: number;
};
```

The result contains the ingredient weights and the starter's internal flour
and water weights. Keep full numeric precision in the domain layer; round only
for display.

Input constraints and helpful messages belong at the URL/form boundary, not
inside the formula.

### Permalink format

Treat the query-string shape as a stable, public interface:

```text
?weight=750&hydration=70&starter=20&salt=2
```

Use descriptive keys rather than abbreviations so shared URLs are legible.

Create pure `parseRecipeSearchParams` and `serializeRecipeSearchParams`
functions. Missing or unusable values fall back to the defaults at this
boundary. The serializer always emits all four values in the order shown
above, making copied links deterministic and independent of future default
changes.

The interaction model is:

1. initialize the form from the query string;
2. calculate results from the current valid form values;
3. update the URL with history replacement during ordinary edits so typing
   does not create dozens of Back-button entries;
4. respond to browser Back/Forward navigation by synchronizing the form;
5. serialize the latest form state before the share action copies the absolute
   URL;
6. show an Astryx toast or other accessible confirmation after copying.

Keep temporary text-entry states, such as an empty number field, local to the
form. Only valid committed numbers are written to the URL and sent to the
formula.

Social previews cannot vary by query string on a purely static GitHub Pages
site. The first release will share the correct interactive recipe URL but use
one site-wide Open Graph preview. Recipe-specific preview cards are a possible
future feature that would require a different delivery mechanism.

## 5. Visual and interaction design

### Astryx

Use Astryx components through their category subpath imports to preserve a
small bundle. Likely building blocks include `NumberInput`, `Field`, `Card`,
`Button` or `IconButton`, `Stack`/`Grid`, `Heading`, `Text`, `Divider`, `Toast`,
and an appearance selector. Confirm exact component APIs with the installed
Astryx CLI before implementation.

Start with the **Butter** theme. Its warm golden surfaces and playful type fit
the food-oriented, friendly direction. Import the pre-built theme object and
CSS in production so static pages render with their final styles before
hydration. Matcha remains the first alternative if Butter's display typography
reduces clarity in the working calculator.

Avoid deep theme customization in the foundation release. First establish the
layout and evaluate both color modes; then make only small token-level changes
needed for contrast, readability, or a distinctive sourdough accent.

### Color mode

Support `system`, `light`, and `dark`, with `system` as the first-visit default.
Persist an explicit choice in `localStorage`. Apply the stored choice before
the page paints, using the mechanism supported by Astryx, so returning visitors
do not see a light/dark flash.

Color mode is a device preference and does not belong in the recipe permalink.

### Page character

The page should feel like a useful baker's workbench rather than an enterprise
form:

- warm food-associated color and typography;
- a strong recipe-card result hierarchy;
- restrained motion when values change or a link is copied;
- small moments of friendly copy;
- generous spacing and rounded surfaces without sacrificing information
  density.

Use CSS and the design-system tokens for the initial personality. Avoid large
decorative media in the critical path.

### Responsive and accessible behavior

- Mobile-first, with a comfortable single-column calculator on narrow screens
  and a form/result split when space permits.
- Every input has a persistent label, visible unit, and useful description.
- Keyboard operation and visible focus are required for every control.
- Do not rely on color alone to communicate state.
- Announce copy confirmation and relevant form feedback accessibly.
- Honor `prefers-reduced-motion`.
- Maintain usable contrast in both Butter light and dark modes.
- Use semantic headings, lists, and output elements so the recipe remains
  understandable without the visual layout.

## 6. Quality strategy

### Automated tests

Use Vitest for fast unit and component tests, React Testing Library for user
interactions, and a small Playwright suite for built-site behavior.

Required coverage:

- the known 750 g / 70% / 20% / 2% recipe;
- preservation of total requested weight within floating-point tolerance;
- verification that total water divided by total flour equals the requested
  true hydration;
- starter composition at 100% hydration;
- query parsing, fallback behavior, deterministic serialization, decimals,
  and Back/Forward synchronization;
- share URL restoration in a fresh page load;
- light, dark, and system modes;
- responsive calculator behavior at representative mobile and desktop widths;
- direct loading of every pre-rendered route beneath the GitHub Pages base
  path;
- production build output containing HTML for every public route.

### Static checks

- TypeScript strict type checking.
- ESLint for correctness and React rules.
- Prettier for formatting.
- No warnings in the production build or browser console.

### Performance goals

- Static HTML should contain the useful default calculator content before
  hydration.
- Use Astryx pre-built theme CSS and subpath component imports.
- Avoid a state library, data-fetching library, or runtime API in the first
  release.
- Reserve layout space so hydration and font loading do not cause disruptive
  shifts.
- Aim for Lighthouse scores of at least 95 for performance, accessibility,
  best practices, and SEO on the production build; investigate any regression
  rather than treating the number alone as success.

## 7. Metadata and baseline site assets

Add:

- a concise page title and description;
- canonical metadata pointing to the calculator route without recipe query
  parameters;
- site-wide Open Graph and social metadata;
- favicon and application icons appropriate to the visual direction;
- `robots.txt` and a static sitemap when more than one public page exists;
- a useful route-level error boundary and a GitHub Pages-compatible 404 page.

The default pre-rendered HTML must remain meaningful with JavaScript disabled,
although editing and sharing the calculator require JavaScript.

## 8. Implementation milestones

### Milestone 1: Bootstrap

- Scaffold React Router Framework Mode with TypeScript and React 19.
- Add `@react-router/fs-routes` and the `_index` route folder.
- Configure `ssr: false`, pre-rendering, the base path, and project scripts.
- Add TypeScript, lint, format, test, and build checks.
- Install Astryx, initialize its project guidance, and wire the Butter built
  theme into `root.tsx`.

Exit condition: the themed default page builds to static HTML and runs locally
from both `/` development and `/sourdough/` production-style base paths.

### Milestone 2: Domain and permalink

- Implement and unit-test the recipe formula from the recipe decision note.
- Implement and test query parsing and deterministic serialization.
- Establish form draft state, URL synchronization, and Back/Forward behavior.

Exit condition: a URL fully restores a recipe and all calculation tests pass.

### Milestone 3: Calculator experience

- Build the responsive calculator form and result card with Astryx.
- Show ingredient weights, true hydration, and the optional starter breakdown.
- Add share/copy feedback and appearance controls.
- Add metadata, friendly copy, empty/error states at the UI boundary, and
  accessibility behavior.

Exit condition: the complete experience is usable by keyboard and at mobile
and desktop sizes in light and dark modes.

### Milestone 4: Deployment and hardening

- Add the GitHub Pages build/deploy workflow.
- Test the production artifact under the repository base path.
- Add built-site browser tests, a 404 asset, and deployment documentation.
- Run accessibility and Lighthouse audits and address material findings.

Exit condition: the deployed GitHub Pages URL loads directly, restores shared
query-string recipes, and passes the automated quality gates.

## 9. First-release acceptance criteria

The foundation is complete when:

- the site is deployed as static files on GitHub Pages with no runtime server;
- `/` is pre-rendered and meaningful before React hydrates;
- file conventions define the routes through `@react-router/fs-routes`;
- users can edit weight, hydration, starter, and salt and see the recipe update;
- hydration is true total hydration and the starter is fixed at 100%;
- the four recipe values round-trip through a deterministic share URL;
- copied URLs restore the same recipe on a fresh load;
- Butter-based light and dark modes are polished and the preference persists;
- the experience is responsive, keyboard accessible, and screen-reader
  understandable;
- formula, URL, component, and built-site tests pass;
- the production build and deployment are reproducible from a clean checkout;
- implementation and extension conventions are documented for the next
  contributor.

## 10. Explicitly deferred

- configurable starter hydration;
- extra ingredients such as oil, eggs, milk, seeds, or sugar;
- saved recipe collections, accounts, or backend storage;
- recipe-specific social preview images;
- localization and non-gram units;
- dynamic recipe pages or user-authored recipe publishing;
- analytics, unless a privacy-conscious need is agreed later.

## 11. Implementation references

- [React Router: Framework Mode](https://reactrouter.com/start/modes)
- [React Router: File route conventions](https://reactrouter.com/how-to/file-route-conventions)
- [React Router: Pre-rendering](https://reactrouter.com/how-to/pre-rendering)
- [React Router: Framework configuration](https://reactrouter.com/api/framework-conventions/react-router.config.ts)
- [Astryx: Getting started](https://astryx.atmeta.com/docs/getting-started)
- [Astryx: Theme system](https://astryx.atmeta.com/docs/theme)
- [GitHub Pages: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
