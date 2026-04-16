import type {
  Question,
  RatingValidation,
  LinearScaleValidation,
} from '@/libs/forms/store/types';
import { Toggle, Row } from './TextValidationPanel';

interface ScaleValidationPanelProps {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}

export function RatingValidationPanel({
  question,
  onChange,
}: ScaleValidationPanelProps) {
  const v = (question.validation ?? {}) as RatingValidation;
  function update(patch: Partial<RatingValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }
  return (
    <div className='space-y-4'>
      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
      <Row label='Max rating'>
        <select
          value={v.maxRating ?? 5}
          onChange={(e) =>
            update({ maxRating: Number(e.target.value) as 5 | 10 })
          }
          className='select-field mt-1'
        >
          <option value={5}>5 stars</option>
          <option value={10}>10 stars</option>
        </select>
      </Row>
      <Toggle
        label='Show labels'
        checked={v.showLabels ?? false}
        onChange={(c) => update({ showLabels: c })}
      />
      {v.showLabels && (
        <>
          <Row label='Low label'>
            <input
              type='text'
              value={v.labelLow ?? ''}
              onChange={(e) => update({ labelLow: e.target.value })}
              placeholder='e.g. Poor'
              className='input-field'
            />
          </Row>
          <Row label='High label'>
            <input
              type='text'
              value={v.labelHigh ?? ''}
              onChange={(e) => update({ labelHigh: e.target.value })}
              placeholder='e.g. Excellent'
              className='input-field'
            />
          </Row>
        </>
      )}
    </div>
  );
}

export function LinearScaleValidationPanel({
  question,
  onChange,
}: ScaleValidationPanelProps) {
  const v = (question.validation ?? {}) as LinearScaleValidation;
  function update(patch: Partial<LinearScaleValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }
  return (
    <div className='space-y-4'>
      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
      <Row label='Min value'>
        <select
          value={v.min ?? 1}
          onChange={(e) => update({ min: Number(e.target.value) as 0 | 1 })}
          className='select-field mt-1'
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
      </Row>
      <Row label='Max value'>
        <select
          value={v.max ?? 5}
          onChange={(e) => update({ max: Number(e.target.value) })}
          className='select-field mt-1'
        >
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Row>
      <Row label='Low label'>
        <input
          type='text'
          value={v.labelLow ?? ''}
          onChange={(e) => update({ labelLow: e.target.value })}
          placeholder='e.g. Not likely'
          className='input-field'
        />
      </Row>
      <Row label='High label'>
        <input
          type='text'
          value={v.labelHigh ?? ''}
          onChange={(e) => update({ labelHigh: e.target.value })}
          placeholder='e.g. Very likely'
          className='input-field'
        />
      </Row>
    </div>
  );
}
