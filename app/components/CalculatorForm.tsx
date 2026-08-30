import { FormLayout } from '@astryxdesign/core/FormLayout';
import { NumberInput } from '@astryxdesign/core/NumberInput';

import type { RecipeDraft, RecipeField } from '../hooks/useRecipe';

type CalculatorFormProps = {
  draft: RecipeDraft;
  updateDraft: (field: RecipeField, value: string) => void;
};

const descriptions: Record<RecipeField, string> = {
  weight: 'The final weight of flour, water, starter, and salt.',
  hydration: 'Total water compared with total flour, including the starter.',
  starter: '100%-hydration starter as a baker’s percentage.',
  salt: 'Salt as a baker’s percentage.',
};

function draftNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function changeDraft(
  field: RecipeField,
  updateDraft: CalculatorFormProps['updateDraft'],
) {
  return (value: number | null) => {
    updateDraft(field, value === null ? '' : String(value));
  };
}

export function CalculatorForm({ draft, updateDraft }: CalculatorFormProps) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormLayout defaultOptionality="required">
        <NumberInput
          label="Total dough weight"
          description={descriptions.weight}
          value={draftNumber(draft.weight)}
          onChange={changeDraft('weight', updateDraft)}
          min={1}
          step={10}
          units="g"
          hasClear
          hasNumberSteppers
          isWheelEnabled={false}
          htmlName="weight"
          width="100%"
          status={
            draftNumber(draft.weight) === null
              ? { type: 'error', message: 'Enter a dough weight.' }
              : undefined
          }
        />
        <NumberInput
          label="True hydration"
          description={descriptions.hydration}
          value={draftNumber(draft.hydration)}
          onChange={changeDraft('hydration', updateDraft)}
          min={0}
          step={0.1}
          units="%"
          hasClear
          hasNumberSteppers
          isWheelEnabled={false}
          htmlName="hydration"
          width="100%"
          status={
            draftNumber(draft.hydration) === null
              ? { type: 'error', message: 'Enter a hydration percentage.' }
              : undefined
          }
        />
        <NumberInput
          label="Starter"
          description={descriptions.starter}
          value={draftNumber(draft.starter)}
          onChange={changeDraft('starter', updateDraft)}
          min={0}
          step={0.1}
          units="%"
          hasClear
          hasNumberSteppers
          isWheelEnabled={false}
          htmlName="starter"
          width="100%"
          status={
            draftNumber(draft.starter) === null
              ? { type: 'error', message: 'Enter a starter percentage.' }
              : undefined
          }
        />
        <NumberInput
          label="Salt"
          description={descriptions.salt}
          value={draftNumber(draft.salt)}
          onChange={changeDraft('salt', updateDraft)}
          min={0}
          step={0.1}
          units="%"
          hasClear
          hasNumberSteppers
          isWheelEnabled={false}
          htmlName="salt"
          width="100%"
          status={
            draftNumber(draft.salt) === null
              ? { type: 'error', message: 'Enter a salt percentage.' }
              : undefined
          }
        />
      </FormLayout>
    </form>
  );
}
