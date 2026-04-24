import { ChevronDown } from 'lucide-react';
import type { Question, TextValidation } from '@/libs/forms/store/types';

const SUBTYPE_LABELS: Record<string, string> = {
  single_line: 'Short text',
  multi_line: 'Long text',
  email: 'Email',
  password: 'Password',
  number: 'Number',
  url: 'URL',
  phone: 'Phone',
};

interface TextQuestionProps {
  question: Question;
  isPreview?: boolean;
  value?: unknown;
  onAnswer?: (v: unknown) => void;
}

export function TextQuestion({
  question,
  isPreview,
  value,
  onAnswer,
}: TextQuestionProps) {
  const v = question.validation as TextValidation;
  const subtype = v?.subtype ?? 'single_line';
  const isMulti = subtype === 'multi_line';
  const isRespond = value !== undefined || !!onAnswer;

  const inputType =
    subtype === 'password'
      ? 'password'
      : subtype === 'email'
        ? 'email'
        : subtype === 'number'
          ? 'number'
          : 'text';

  if (isRespond) {
    const strVal = typeof value === 'string' ? value : '';
    return (
      <div className='mt-3'>
        {isMulti ? (
          <textarea
            value={strVal}
            onChange={(e) => onAnswer?.(e.target.value)}
            placeholder='Your answer…'
            rows={4}
            className='w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#0B1AA0] focus:outline-none focus:ring-2 focus:ring-[#0B1AA0]/20'
          />
        ) : (
          <input
            type={inputType}
            value={strVal}
            onChange={(e) => onAnswer?.(e.target.value)}
            placeholder='Your answer…'
            className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#0B1AA0] focus:outline-none focus:ring-2 focus:ring-[#0B1AA0]/20'
          />
        )}
      </div>
    );
  }

  if (isPreview) {
    return isMulti ? (
      <textarea
        disabled
        placeholder='Your answer…'
        rows={3}
        className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'
      />
    ) : (
      <input
        disabled
        type={inputType}
        placeholder='Your answer…'
        className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'
      />
    );
  }

  return (
    <div className='mt-3'>
      <div className='inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600'>
        {SUBTYPE_LABELS[subtype] ?? 'Text'}
        <ChevronDown className='h-3 w-3 text-slate-400' />
      </div>
      {isMulti ? (
        <div className='mt-2 h-16 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-start p-2'>
          <span className='text-xs text-slate-400'>Long text answer…</span>
        </div>
      ) : (
        <div className='mt-2 h-9 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center px-3'>
          <span className='text-xs text-slate-400'>Short answer…</span>
        </div>
      )}
    </div>
  );
}
