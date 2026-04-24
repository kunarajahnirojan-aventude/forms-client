import type { Question, DateValidation } from '@/libs/forms/store/types';
import { Toggle, Row } from '../text-validation-panel';

interface DateValidationPanelProps {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}

export function DateValidationPanel({
  question,
  onChange,
}: DateValidationPanelProps) {
  const v = (question.validation ?? {}) as DateValidation;

  function update(patch: Partial<DateValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }

  return (
    <div className='space-y-4'>
      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
      <Toggle
        label='Include time'
        checked={v.includeTime ?? false}
        onChange={(c) => update({ includeTime: c })}
      />
      <Toggle
        label='Disable past dates'
        checked={v.disablePast ?? false}
        onChange={(c) => update({ disablePast: c })}
      />
      <Toggle
        label='Disable future dates'
        checked={v.disableFuture ?? false}
        onChange={(c) => update({ disableFuture: c })}
      />
      <Row label='Min date'>
        <input
          type='date'
          value={v.minDate ?? ''}
          onChange={(e) => update({ minDate: e.target.value || undefined })}
          className='input-field'
        />
      </Row>
      <Row label='Max date'>
        <input
          type='date'
          value={v.maxDate ?? ''}
          onChange={(e) => update({ maxDate: e.target.value || undefined })}
          className='input-field'
        />
      </Row>
    </div>
  );
}
