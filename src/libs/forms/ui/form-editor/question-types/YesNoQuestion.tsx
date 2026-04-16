import type { Question } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface YesNoQuestionProps {
  question: Question;
  isPreview?: boolean;
}

export function YesNoQuestion({ question: _, isPreview }: YesNoQuestionProps) {
  return (
    <div className='mt-3 flex gap-3'>
      {['Yes', 'No'].map((label) => (
        <button
          key={label}
          disabled={!isPreview}
          className={cn(
            'flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors',
            isPreview
              ? 'border-slate-200 bg-white text-slate-700 hover:border-[#0B1AA0] hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0] cursor-pointer'
              : 'border-slate-200 bg-slate-50 text-slate-400 cursor-default',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
