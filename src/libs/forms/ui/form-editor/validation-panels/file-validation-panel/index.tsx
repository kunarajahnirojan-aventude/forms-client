import type { Question, FileValidation } from '@/libs/forms/store/types';
import { Toggle, Row } from '../text-validation-panel';

const FILE_TYPE_OPTIONS = [
  { label: 'Images', value: 'image/*' },
  { label: 'PDF', value: '.pdf' },
  { label: 'Word docs', value: '.doc,.docx' },
  { label: 'Excel', value: '.xls,.xlsx' },
  { label: 'Videos', value: 'video/*' },
  { label: 'Audio', value: 'audio/*' },
];

interface FileValidationPanelProps {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}

export function FileValidationPanel({
  question,
  onChange,
}: FileValidationPanelProps) {
  const v = (question.validation ?? {}) as FileValidation;
  const allowed = v.allowedTypes ?? [];

  function update(patch: Partial<FileValidation>) {
    onChange({ validation: { ...v, ...patch } });
  }

  function toggleType(val: string) {
    if (allowed.includes(val)) {
      update({ allowedTypes: allowed.filter((t) => t !== val) });
    } else {
      update({ allowedTypes: [...allowed, val] });
    }
  }

  return (
    <div className='space-y-4'>
      <Toggle
        label='Required'
        checked={question.required}
        onChange={(c) => onChange({ required: c })}
      />
      <Row label='Max file size (MB)'>
        <input
          type='number'
          min={1}
          max={100}
          value={v.maxSizeMb ?? ''}
          onChange={(e) =>
            update({
              maxSizeMb: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder='10'
          className='input-field'
        />
      </Row>
      <Row label='Max number of files'>
        <input
          type='number'
          min={1}
          max={20}
          value={v.maxFiles ?? ''}
          onChange={(e) =>
            update({
              maxFiles: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder='1'
          className='input-field'
        />
      </Row>
      <div>
        <p className='mb-2 text-sm text-slate-700'>Allowed file types</p>
        <div className='flex flex-wrap gap-2'>
          {FILE_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleType(opt.value)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                allowed.includes(opt.value)
                  ? 'border-[#0B1AA0] bg-[#0B1AA0]/10 text-[#0B1AA0]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {allowed.length === 0 && (
          <p className='mt-1.5 text-xs text-slate-400'>
            All file types allowed
          </p>
        )}
      </div>
    </div>
  );
}
