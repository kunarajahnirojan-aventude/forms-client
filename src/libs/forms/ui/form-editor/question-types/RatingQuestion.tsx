import { Star } from 'lucide-react';
import type { Question, RatingValidation } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface RatingQuestionProps {
  question: Question;
  isPreview?: boolean;
}

export function RatingQuestion({ question, isPreview }: RatingQuestionProps) {
  const v = question.validation as RatingValidation;
  const max = v?.maxRating ?? 5;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className='mt-3'>
      {v?.showLabels && v.labelLow && (
        <p className='mb-1.5 text-xs text-slate-500'>{v.labelLow}</p>
      )}
      <div className='flex gap-1'>
        {stars.map((n) => (
          <button
            key={n}
            disabled={!isPreview}
            className={cn(
              'transition-colors',
              isPreview
                ? 'cursor-pointer hover:text-yellow-400'
                : 'cursor-default',
            )}
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                'h-8 w-8',
                isPreview
                  ? 'text-slate-300 hover:text-yellow-400'
                  : 'text-slate-200',
              )}
            />
          </button>
        ))}
      </div>
      {v?.showLabels && v.labelHigh && (
        <p className='mt-1.5 text-xs text-slate-500'>{v.labelHigh}</p>
      )}
    </div>
  );
}
