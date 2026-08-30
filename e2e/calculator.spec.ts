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
  await expect(page.getByText('396.8 g', { exact: true })).toBeVisible();
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
    freshPage.getByRole('spinbutton', { name: 'True hydration' }),
  ).toHaveValue(recipe.hydration);
  await expect(freshPage.getByText('72.25% true hydration')).toBeVisible();
});

test('persists light, dark, and system appearance choices', async ({
  page,
}) => {
  await page.goto('./');
  const appearance = page.getByRole('combobox', { name: 'Appearance' });

  await appearance.click();
  await page.getByRole('option', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(appearance).toHaveText('Dark');

  await appearance.click();
  await page.getByRole('option', { name: 'Light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await appearance.click();
  await page.getByRole('option', { name: 'System' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});

test('has no automatically detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('./');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

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
