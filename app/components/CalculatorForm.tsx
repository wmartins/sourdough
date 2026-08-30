import { FormLayout } from '@astryxdesign/core/FormLayout';
import { HStack } from '@astryxdesign/core/HStack';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Slider } from '@astryxdesign/core/Slider';
import { StackItem } from '@astryxdesign/core/Stack';
import type { FormEvent } from 'react';

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

function changeSlider(
  field: RecipeField,
  updateDraft: CalculatorFormProps['updateDraft'],
) {
  return (value: number) => updateDraft(field, String(value));
}

function percentage(value: number): string {
  return `${value}%`;
}

type PercentageField = Exclude<RecipeField, 'weight'>;

type PercentageControlProps = {
  field: PercentageField;
  label: string;
  max: number;
  step: number;
  updateDraft: CalculatorFormProps['updateDraft'];
  value: number;
};

function PercentageControl({
  field,
  label,
  max,
  step,
  updateDraft,
  value,
}: PercentageControlProps) {
  return (
    <HStack gap={3} vAlign="end">
      <StackItem size="fill">
        <Slider
          label={label}
          description={descriptions[field]}
          value={value}
          onChange={changeSlider(field, updateDraft)}
          min={0}
          max={Math.max(max, value)}
          step={step}
          formatValue={percentage}
          valueDisplay="none"
          width="100%"
        />
      </StackItem>
      <NumberInput
        label={`${label} percentage`}
        isLabelHidden
        value={value}
        onChange={changeDraft(field, updateDraft)}
        min={0}
        step={step}
        units="%"
        hasNumberSteppers
        isWheelEnabled={false}
        htmlName={field}
        width={112}
      />
    </HStack>
  );
}

export function CalculatorForm({ draft, updateDraft }: CalculatorFormProps) {
  const hydration = draftNumber(draft.hydration) ?? 0;
  const starter = draftNumber(draft.starter) ?? 0;
  const salt = draftNumber(draft.salt) ?? 0;

  function updateInput(event: FormEvent<HTMLFormElement>) {
    const input = event.target;

    if (input instanceof HTMLInputElement && input.name in descriptions) {
      updateDraft(input.name as RecipeField, input.value);
    }
  }

  return (
    <form
      aria-labelledby="calculator-heading"
      onInputCapture={updateInput}
      onSubmit={(event) => event.preventDefault()}
    >
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
        <PercentageControl
          field="hydration"
          label="Hydration"
          value={hydration}
          max={120}
          step={1}
          updateDraft={updateDraft}
        />
        <PercentageControl
          field="starter"
          label="Starter"
          value={starter}
          max={50}
          step={0.5}
          updateDraft={updateDraft}
        />
        <PercentageControl
          field="salt"
          label="Salt"
          value={salt}
          max={5}
          step={0.1}
          updateDraft={updateDraft}
        />
      </FormLayout>
    </form>
  );
}
