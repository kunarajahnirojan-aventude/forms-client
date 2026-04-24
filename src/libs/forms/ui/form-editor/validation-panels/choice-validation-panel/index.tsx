import type { Question, ChoiceValidation } from '@/libs/forms/store/types';
import { Toggle, Row } from '../text-validation-panel';

interface ChoiceValidationPanelProps {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}

export function ChoiceValidationPanel({
  question,
  onChange,
}: ChoiceValidationPanelProps) {
  const v = (question.validation ?? {}) as ChoiceValidation;

  function update(patch: Partial<ChoiceValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }

  const isCheckbox = question.type === 'checkbox';

  return (
    <div className='space-y-4'>
      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
      <Toggle
        label='Allow "Other" option'
        checked={v.allowOther ?? false}
        onChange={(c) => update({ allowOther: c })}
      />
      <Toggle
        label='Shuffle options'
        checked={v.shuffleOptions ?? false}
        onChange={(c) => update({ shuffleOptions: c })}
      />
      {isCheckbox && (
        <>
          <Row label='Min selections'>
            <input
              type='number'
              min={0}
              value={v.minSelections ?? ''}
              onChange={(e) =>
                update({
                  minSelections: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder='No minimum'
              className='input-field'
            />
          </Row>
          <Row label='Max selections'>
            <input
              type='number'
              min={1}
              value={v.maxSelections ?? ''}
              onChange={(e) =>
                update({
                  maxSelections: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder='No maximum'
              className='input-field'
            />
          </Row>
        </>
      )}
    </div>
  );
}
