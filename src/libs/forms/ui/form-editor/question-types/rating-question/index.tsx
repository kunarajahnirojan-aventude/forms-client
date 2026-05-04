import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Question, RatingValidation } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface RatingQuestionProps {
  question: Question;
  isPreview?: boolean;
  value?: unknown;
  onAnswer?: (v: unknown) => void;
}

export function RatingQuestion({
  question,
  isPreview,
  value,
  onAnswer,
}: RatingQuestionProps) {
  const v = question.validation as RatingValidation;
  const max = v?.maxRating ?? 5;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const [hovered, setHovered] = useState(0);

  const isRespond = value !== undefined || !!onAnswer;
  const selected = typeof value === 'number' ? value : 0;

  return (
    <div className='mt-3'>
      <div className='flex gap-1'>
        {stars.map((n) => (
          <button
            key={n}
            disabled={!isPreview && !isRespond}
            onClick={isRespond ? () => onAnswer?.(n) : undefined}
            onMouseEnter={isRespond ? () => setHovered(n) : undefined}
            onMouseLeave={isRespond ? () => setHovered(0) : undefined}
            className={cn(
              'transition-colors',
              isPreview || isRespond ? 'cursor-pointer' : 'cursor-default',
            )}
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                'h-8 w-8 transition-colors',
                isRespond
                  ? n <= (hovered || selected)
                    ? 'text-yellow-400'
                    : 'text-slate-300'
                  : isPreview
                    ? 'text-slate-300 hover:text-yellow-400'
                    : 'text-slate-200',
              )}
            />
          </button>
        ))}
      </div>
      {v?.showLabels && (v?.labelLow || v?.labelHigh) && (
        <div className='mt-1.5 flex justify-between text-xs text-slate-500'>
          <span>{v?.labelLow ?? ''}</span>
          <span>{v?.labelHigh ?? ''}</span>
        </div>
      )}
    </div>
  );
}
