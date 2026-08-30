import { AppShell } from '@astryxdesign/core/AppShell';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Layout, LayoutContent, VStack } from '@astryxdesign/core/Layout';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { Text } from '@astryxdesign/core/Text';

import { AppearanceToggle } from '../../components/AppearanceToggle';
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
    <AppShell
      contentPadding={0}
      height="auto"
      mobileNav={false}
      variant="surface"
      topNav={
        <TopNav
          label="Sourdough navigation"
          heading={
            <TopNavHeading heading="Sourdough" headingHref="./" logo="🍞" />
          }
          endContent={<AppearanceToggle />}
        />
      }
    >
      <Layout
        height="auto"
        contentWidth={1100}
        padding={6}
        content={
          <LayoutContent isScrollable={false}>
            <VStack gap={10}>
              <Center axis="horizontal" width="100%">
                <VStack gap={3} hAlign="center" maxWidth={720}>
                  <Text size="4xl">🍞</Text>
                  <Heading
                    level={1}
                    type="display-1"
                    color="accent"
                    justify="center"
                    textWrap="balance"
                  >
                    Build a loaf that adds up.
                  </Heading>
                  <Text
                    as="p"
                    type="large"
                    color="secondary"
                    justify="center"
                    textWrap="balance"
                  >
                    Choose your dough weight and baker’s percentages. We’ll
                    calculate everything you need for a delicious loaf.
                  </Text>
                </VStack>
              </Center>

              <Grid columns={{ minWidth: 320, max: 2, repeat: 'fit' }} gap={6}>
                <Card padding={6}>
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
                </Card>

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
    </AppShell>
  );
}
