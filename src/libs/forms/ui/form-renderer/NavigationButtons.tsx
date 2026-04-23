import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface NavigationButtonsProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function NavigationButtons({
  canGoBack,
  canGoNext,
  isLast,
  onPrev,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <div className='flex items-center justify-between pt-6'>
      <button
        onClick={onPrev}
        disabled={!canGoBack}
        className='flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronLeft className='h-4 w-4' />
        Previous
      </button>

      {isLast ? (
        <button
          onClick={onSubmit}
          className='flex items-center gap-1.5 rounded-lg bg-[#0B1AA0] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a]'
        >
          Submit
          <Check className='h-4 w-4' />
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className='flex items-center gap-1.5 rounded-lg bg-[#0B1AA0] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a] disabled:cursor-not-allowed disabled:opacity-40'
        >
          Next
          <ChevronRight className='h-4 w-4' />
        </button>
      )}
    </div>
  );
}
