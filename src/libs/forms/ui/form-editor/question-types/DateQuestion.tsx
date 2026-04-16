import { Calendar } from 'lucide-react';
import type { Question, DateValidation } from '@/libs/forms/store/types';

interface DateQuestionProps {
  question: Question;
  isPreview?: boolean;
}

export function DateQuestion({ question, isPreview }: DateQuestionProps) {
  const v = question.validation as DateValidation;

  if (isPreview) {
    return (
      <div className='mt-3 flex items-center gap-2'>
        <input
          disabled
          type={v?.includeTime ? 'datetime-local' : 'date'}
          className='h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500'
        />
      </div>
    );
  }

  return (
    <div className='mt-3 flex items-center gap-2.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3'>
      <Calendar className='h-4 w-4 text-slate-400' />
      <span className='text-sm text-slate-400'>
        {v?.includeTime ? 'Date & time picker' : 'Date picker'}
      </span>
    </div>
  );
}
