import { Phone } from 'lucide-react';
import type { Question } from '@/libs/forms/store/types';

interface PhoneQuestionProps {
  question: Question;
  isPreview?: boolean;
  value?: unknown;
  onAnswer?: (v: unknown) => void;
}

export function PhoneQuestion({
  question: _,
  isPreview,
  value,
  onAnswer,
}: PhoneQuestionProps) {
  const isRespond = value !== undefined || !!onAnswer;

  if (isRespond) {
    return (
      <input
        type='tel'
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onAnswer?.(e.target.value)}
        placeholder='+1 (555) 000-0000'
        className='mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#0B1AA0] focus:outline-none focus:ring-2 focus:ring-[#0B1AA0]/20'
      />
    );
  }

  if (isPreview) {
    return (
      <input
        disabled
        type='tel'
        placeholder='+1 (555) 000-0000'
        className='mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'
      />
    );
  }
  return (
    <div className='mt-3 flex items-center gap-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3'>
      <Phone className='h-4 w-4 text-slate-400' />
      <span className='text-sm text-slate-400'>Phone number input</span>
    </div>
  );
}
