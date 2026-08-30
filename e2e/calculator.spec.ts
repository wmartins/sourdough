import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const recipe = {
  weight: '825.5',
  hydration: '72.25',
  starter: '18.5',
  salt: '2.1',
};

const query = new URLSearchParams(recipe).toString();

test('loads the prerendered calculator under the repository base path', async ({
  page,
}) => {
  const messages: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      messages.push(message.text());
    }
  });

  const response = await page.goto('./');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Sourdough recipe calculator');
  await expect(
    page.getByRole('heading', { name: 'Build a loaf that adds up.' }),
  ).toBeVisible();
  await expect(page.getByText('478.4 g', { exact: true })).toBeVisible();
  expect(messages).toEqual([]);
});

test('restores the copied recipe in a fresh page', async ({
  context,
  page,
}) => {
  await page.goto(`?${query}`);

  await expect(
    page.getByRole('spinbutton', { name: 'Total dough weight' }),
  ).toHaveValue(recipe.weight);

  await page.getByRole('button', { name: 'Copy recipe link' }).click();
  await expect(
    page.getByRole('button', { name: 'Recipe link copied' }),
  ).toBeVisible();

  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(copied).search).toBe(`?${query}`);

  const freshPage = await context.newPage();
  await freshPage.goto(copied);
  await expect(
    freshPage.getByRole('slider', { name: 'Hydration' }),
  ).toHaveAttribute('aria-valuenow', recipe.hydration);
  await expect(
    freshPage.getByRole('spinbutton', {
      name: 'Hydration percentage',
    }),
  ).toHaveValue(recipe.hydration);
  await expect(freshPage.getByText('72.25% hydration')).toBeVisible();
});

test('updates the recipe and URL while typing', async ({ page }) => {
  await page.goto('./');
  const weight = page.getByRole('spinbutton', { name: 'Total dough weight' });

  await weight.focus();
  await weight.fill('800');

  await expect(weight).toBeFocused();
  await expect(page).toHaveURL(
    /\?weight=800&hydration=65&starter=25&salt=2.5$/,
  );
  await expect(page.getByText('800 g total · 65% hydration')).toBeVisible();
});

test('accepts precise percentages from the input beside a slider', async ({
  page,
}) => {
  await page.goto('./');
  const hydration = page.getByRole('spinbutton', {
    name: 'Hydration percentage',
  });

  await hydration.focus();
  await hydration.fill('72.25');

  await expect(hydration).toBeFocused();
  await expect(page).toHaveURL(
    /\?weight=900&hydration=72.25&starter=25&salt=2.5$/,
  );
  await expect(page.getByRole('slider', { name: 'Hydration' })).toHaveAttribute(
    'aria-valuenow',
    '72.25',
  );
});

test('keeps the slider track stable as percentage labels change width', async ({
  page,
}) => {
  await page.goto('?weight=900&hydration=60&starter=25&salt=2.5');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

  const hydration = page.getByRole('slider', { name: 'Hydration' });
  const measure = () =>
    hydration.evaluate((thumb) => {
      const slider = thumb.closest('.astryx-slider');
      return {
        trackWidth: slider
          ?.querySelector('.astryx-slider-track')
          ?.getBoundingClientRect().width,
      };
    });
  const initial = await measure();

  for (let step = 0; step < 3; step += 1) {
    await hydration.press('ArrowRight');
  }

  await expect(hydration).toHaveAttribute('aria-valuetext', '63%');
  expect(await measure()).toEqual(initial);
});

test('preserves scroll position when a slider updates the URL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto('./');

  const hydration = page.getByRole('slider', { name: 'Hydration' });
  await hydration.scrollIntoViewIfNeeded();
  const initialScroll = await page.evaluate(() => window.scrollY);

  expect(initialScroll).toBeGreaterThan(0);
  await hydration.press('ArrowRight');
  await expect(page).toHaveURL(
    /\?weight=900&hydration=66&starter=25&salt=2.5$/,
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(initialScroll);
});

test('toggles and persists the color mode', async ({ page }) => {
  await page.goto('./');

  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Switch to light mode' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Switch to dark mode' }),
  ).toBeVisible();
});

test('keeps the sticky navigation solid and divided while scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto('./');

  const header = page.getByRole('banner');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect(header).toBeVisible();
  const appearance = await header.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      background: style.backgroundColor,
      borderWidth: style.borderBlockEndWidth,
    };
  });

  expect(appearance.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(appearance.borderWidth).not.toBe('0px');
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`has no automatically detectable accessibility violations in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('./');

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

for (const viewport of [
  { name: 'mobile', width: 390, height: 844, isSplit: false },
  { name: 'desktop', width: 1280, height: 900, isSplit: true },
] as const) {
  test(`uses the ${viewport.name} calculator layout without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');

    const controls = await page
      .getByRole('heading', { name: 'Recipe controls' })
      .boundingBox();
    const result = await page
      .getByRole('heading', { name: 'Your dough' })
      .boundingBox();

    expect(controls).not.toBeNull();
    expect(result).not.toBeNull();

    if (viewport.isSplit) {
      expect(result?.x).toBeGreaterThan((controls?.x ?? 0) + 100);
    } else {
      expect(result?.y).toBeGreaterThan((controls?.y ?? 0) + 100);
    }

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);
  });
}

test('publishes a useful static 404 page', async ({ page }) => {
  const response = await page.goto('404.html');

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { name: 'That loaf is missing.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Return to the calculator' }),
  ).toHaveAttribute('href', '/sourdough/');
});
