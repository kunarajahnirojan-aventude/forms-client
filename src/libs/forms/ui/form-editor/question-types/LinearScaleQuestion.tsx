import type { Question, LinearScaleValidation } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface LinearScaleQuestionProps {
  question: Question;
  isPreview?: boolean;
}

export function LinearScaleQuestion({
  question,
  isPreview,
}: LinearScaleQuestionProps) {
  const v = question.validation as LinearScaleValidation;
  const min = v?.min ?? 1;
  const max = v?.max ?? 5;
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className='mt-3'>
      <div className='flex items-center gap-2'>
        {v?.labelLow && (
          <span className='shrink-0 text-xs text-slate-500'>{v.labelLow}</span>
        )}
        <div className='flex flex-1 gap-1.5 flex-wrap'>
          {steps.map((n) => (
            <button
              key={n}
              disabled={!isPreview}
              className={cn(
                'h-9 w-9 rounded-lg border text-sm font-medium transition-colors',
                isPreview
                  ? 'border-slate-300 bg-white text-slate-700 hover:border-[#0B1AA0] hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0] cursor-pointer'
                  : 'border-slate-200 bg-slate-50 text-slate-400 cursor-default',
              )}
            >
              {n}
            </button>
          ))}
        </div>
        {v?.labelHigh && (
          <span className='shrink-0 text-xs text-slate-500'>{v.labelHigh}</span>
        )}
      </div>
    </div>
  );
}
