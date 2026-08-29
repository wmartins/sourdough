import { Heading } from '@astryxdesign/core/Heading';
import { Layout, LayoutContent, VStack } from '@astryxdesign/core/Layout';
import { Section } from '@astryxdesign/core/Section';
import { Text } from '@astryxdesign/core/Text';

import type { Route } from './+types/route';

export const meta: Route.MetaFunction = () => [
  { title: 'Sourdough recipe calculator' },
  {
    name: 'description',
    content: 'Scale a simple sourdough recipe with true dough hydration.',
  },
];

export default function IndexRoute() {
  return (
    <Layout
      height="auto"
      contentWidth="60ch"
      padding={6}
      content={
        <LayoutContent role="main" isScrollable={false}>
          <VStack gap={6}>
            <VStack gap={2}>
              <Heading level={1} type="display-2" textWrap="balance">
                Better bread starts with a balanced recipe.
              </Heading>
              <Text as="p" type="large" color="secondary">
                A warm, precise sourdough calculator is taking shape here.
              </Text>
            </VStack>

            <Section variant="muted">
              <VStack gap={2}>
                <Heading level={2}>The workbench is warming up</Heading>
                <Text as="p">
                  The foundation is ready for flour, water, starter, and salt.
                  Calculator controls arrive in the next milestone.
                </Text>
              </VStack>
            </Section>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
