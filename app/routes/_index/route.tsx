import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Layout, LayoutContent, VStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';

import { AppearanceSelector } from '../../components/AppearanceSelector';
import { CalculatorForm } from '../../components/CalculatorForm';
import { RecipeResult } from '../../components/RecipeResult';
import { useRecipe } from '../../hooks/useRecipe';
import type { Route } from './+types/route';

const title = 'Sourdough recipe calculator';
const description =
  'Scale flour, water, starter, and salt with true dough hydration.';
const canonicalUrl = 'https://wmartins.github.io/sourdough/';

export const meta: Route.MetaFunction = () => [
  { title },
  { name: 'description', content: description },
  { tagName: 'link', rel: 'canonical', href: canonicalUrl },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:url', content: canonicalUrl },
  { name: 'twitter:card', content: 'summary' },
  { name: 'twitter:title', content: title },
  { name: 'twitter:description', content: description },
];

export default function IndexRoute() {
  const { draft, isComplete, recipe, result, updateDraft } = useRecipe();

  return (
    <Layout
      height="auto"
      contentWidth={1100}
      padding={6}
      content={
        <LayoutContent role="main" isScrollable={false}>
          <VStack gap={8}>
            <Grid columns={{ minWidth: 260, max: 2, repeat: 'fit' }} gap={6}>
              <VStack gap={2}>
                <Heading level={1} type="display-2" textWrap="balance">
                  Build a loaf that adds up.
                </Heading>
                <Text as="p" type="large" color="secondary">
                  Set your dough target and baker’s percentages. We’ll account
                  for the flour and water already in your starter.
                </Text>
              </VStack>
              <AppearanceSelector />
            </Grid>

            <Grid columns={{ minWidth: 320, max: 2, repeat: 'fit' }} gap={6}>
              <VStack gap={4}>
                <VStack gap={1}>
                  <Heading id="calculator-heading" level={2}>
                    Recipe controls
                  </Heading>
                  <Text color="secondary">
                    Changes update the recipe and its shareable URL.
                  </Text>
                </VStack>
                <CalculatorForm draft={draft} updateDraft={updateDraft} />
              </VStack>

              <RecipeResult
                input={recipe}
                isCurrent={isComplete}
                result={result}
              />
            </Grid>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
