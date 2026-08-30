import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { VStack } from '@astryxdesign/core/Layout';
import {
  MetadataList,
  MetadataListItem,
} from '@astryxdesign/core/MetadataList';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { useToast } from '@astryxdesign/core/Toast';
import { VisuallyHidden } from '@astryxdesign/core/VisuallyHidden';
import { useClipboard } from '@astryxdesign/core/hooks';

import type {
  RecipeInput,
  RecipeResult as RecipeResultValue,
} from '../domain/recipe/types';
import { serializeRecipeSearchParams } from '../lib/recipeSearchParams';

type RecipeResultProps = {
  input: RecipeInput;
  isCurrent: boolean;
  result: RecipeResultValue;
};

const grams = new Intl.NumberFormat('en', {
  maximumFractionDigits: 1,
});

export function createRecipeUrl(href: string, recipe: RecipeInput): string {
  const url = new URL(href);

  url.search = serializeRecipeSearchParams(recipe).toString();
  url.hash = '';

  return url.toString();
}

function weight(value: number): string {
  return `${grams.format(value)} g`;
}

export function RecipeResult({ input, isCurrent, result }: RecipeResultProps) {
  const { copy, isCopied } = useClipboard({
    announce: 'Recipe link copied.',
  });
  const showToast = useToast();

  async function shareRecipe() {
    const copied = await copy(createRecipeUrl(window.location.href, input));

    showToast({
      body: copied
        ? 'Recipe link copied.'
        : 'The recipe link could not be copied.',
      type: copied ? 'info' : 'error',
      uniqueID: 'recipe-share',
      collisionBehavior: 'overwrite',
    });
  }

  return (
    <Card elevation="low" padding={6}>
      <VStack gap={5}>
        <VStack gap={1}>
          <Heading level={2}>Your dough</Heading>
          <Text color="secondary">
            {weight(input.weight)} total · {input.hydration}% true hydration
          </Text>
        </VStack>

        {!isCurrent ? (
          <Text color="secondary">
            Complete every field to update this last valid recipe.
          </Text>
        ) : null}

        <VisuallyHidden as="output" aria-live="polite">
          Recipe updated. Flour {weight(result.flour)}, water{' '}
          {weight(result.water)}, starter {weight(result.starter.total)}, and
          salt {weight(result.salt)}.
        </VisuallyHidden>

        <MetadataList label={{ position: 'start' }}>
          <MetadataListItem label="Flour">
            {weight(result.flour)}
          </MetadataListItem>
          <MetadataListItem label="Water">
            {weight(result.water)}
          </MetadataListItem>
          <MetadataListItem label="Starter">
            {weight(result.starter.total)}
          </MetadataListItem>
          <MetadataListItem label="Salt">
            {weight(result.salt)}
          </MetadataListItem>
        </MetadataList>

        <Divider />

        <Collapsible trigger="Inside the starter" defaultIsOpen={false}>
          <VStack gap={2}>
            <Text color="secondary">
              At 100% hydration, the starter contains equal flour and water.
            </Text>
            <MetadataList label={{ position: 'start' }}>
              <MetadataListItem label="Flour">
                {weight(result.starter.flour)}
              </MetadataListItem>
              <MetadataListItem label="Water">
                {weight(result.starter.water)}
              </MetadataListItem>
            </MetadataList>
          </VStack>
        </Collapsible>

        <Button
          label={isCopied ? 'Recipe link copied' : 'Copy recipe link'}
          variant="primary"
          width="100%"
          icon={<Icon icon={isCopied ? 'checkDouble' : 'copy'} />}
          clickAction={shareRecipe}
        />
      </VStack>
    </Card>
  );
}
