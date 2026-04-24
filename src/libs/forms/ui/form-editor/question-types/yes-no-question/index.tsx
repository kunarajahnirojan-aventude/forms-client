import type { Question } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface YesNoQuestionProps {
  question: Question;
  isPreview?: boolean;
  value?: unknown;
  onAnswer?: (v: unknown) => void;
}

export function YesNoQuestion({
  question: _,
  isPreview,
  value,
  onAnswer,
}: YesNoQuestionProps) {
  const isRespond = value !== undefined || !!onAnswer;
  const selected = typeof value === 'string' ? value : null;

  return (
    <div className='mt-3 flex gap-3'>
      {['yes', 'no'].map((key) => (
        <button
          key={key}
          disabled={!isPreview && !isRespond}
          onClick={isRespond ? () => onAnswer?.(key) : undefined}
          className={cn(
            'flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors',
            isRespond
              ? key === selected
                ? 'border-[#0B1AA0] bg-[#0B1AA0] text-white cursor-pointer'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[#0B1AA0] hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0] cursor-pointer'
              : isPreview
                ? 'border-slate-200 bg-white text-slate-700 hover:border-[#0B1AA0] hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0] cursor-pointer'
                : 'border-slate-200 bg-slate-50 text-slate-400 cursor-default',
          )}
        >
          {key === 'yes' ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  );
}
