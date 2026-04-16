import { cn } from '@/utils';
import type { Question, TextValidation } from '@/libs/forms/store/types';

interface TextValidationPanelProps {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}

type TextSubtype = TextValidation['subtype'];

const SUBTYPES: { value: TextSubtype; label: string }[] = [
  { value: 'single_line', label: 'Short text' },
  { value: 'multi_line', label: 'Long text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'url', label: 'URL' },
  { value: 'phone', label: 'Phone' },
];

export function TextValidationPanel({
  question,
  onChange,
}: TextValidationPanelProps) {
  const v = (question.validation ?? {}) as TextValidation;

  function update(patch: Partial<TextValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }

  return (
    <div className='space-y-4'>
      {/* Subtype */}
      <div>
        <label className='label-sm'>Input type</label>
        <select
          value={v.subtype ?? 'single_line'}
          onChange={(e) => update({ subtype: e.target.value as TextSubtype })}
          className='select-field mt-1'
        >
          {SUBTYPES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Number-specific */}
      {v.subtype === 'number' && (
        <>
          <Row label='Min value'>
            <input
              type='number'
              value={v.min ?? ''}
              onChange={(e) =>
                update({
                  min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder='No minimum'
              className='input-field'
            />
          </Row>
          <Row label='Max value'>
            <input
              type='number'
              value={v.max ?? ''}
              onChange={(e) =>
                update({
                  max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder='No maximum'
              className='input-field'
            />
          </Row>
          <Toggle
            label='Allow decimal'
            checked={v.allowDecimal ?? false}
            onChange={(c) => update({ allowDecimal: c })}
          />
          <Row label='Currency symbol'>
            <input
              type='text'
              value={v.currency ?? ''}
              onChange={(e) =>
                update({ currency: e.target.value || undefined })
              }
              placeholder='e.g. $, €, £'
              className='input-field'
              maxLength={4}
            />
          </Row>
        </>
      )}

      {/* Password-specific */}
      {v.subtype === 'password' && (
        <>
          <Row label='Min length'>
            <input
              type='number'
              min={1}
              value={v.minLength ?? ''}
              onChange={(e) =>
                update({
                  minLength: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder='8'
              className='input-field'
            />
          </Row>
          <Toggle
            label='Require uppercase letter'
            checked={v.requireUppercase ?? false}
            onChange={(c) => update({ requireUppercase: c })}
          />
          <Toggle
            label='Require number'
            checked={v.requireNumber ?? false}
            onChange={(c) => update({ requireNumber: c })}
          />
          <Toggle
            label='Require symbol'
            checked={v.requireSymbol ?? false}
            onChange={(c) => update({ requireSymbol: c })}
          />
        </>
      )}

      {/* General */}
      {!['number', 'password'].includes(v.subtype ?? '') && (
        <Row label='Max length'>
          <input
            type='number'
            min={1}
            value={v.maxLength ?? ''}
            onChange={(e) =>
              update({
                maxLength: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder='No limit'
            className='input-field'
          />
        </Row>
      )}

      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
    </div>
  );
}

// ─── Shared small helpers ─────────────────────────────────────────────────────

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className='flex cursor-pointer items-center justify-between gap-2'
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      <span className='text-sm text-slate-700'>{label}</span>
      <div
        role='switch'
        aria-checked={checked}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[#0B1AA0]' : 'bg-slate-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </div>
    </div>
  );
}

export function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className='mb-1 block text-sm text-slate-700'>{label}</label>
      {children}
    </div>
  );
}
