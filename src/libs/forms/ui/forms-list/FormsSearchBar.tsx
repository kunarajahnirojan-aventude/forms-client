import { Search, X } from 'lucide-react';
import { cn } from '@/utils';

interface FormsSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function FormsSearchBar({
  value,
  onChange,
  className,
}: FormsSearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none' />
      <input
        type='search'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search surveys by name…'
        className='h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-[#0B1AA0]/25 focus:ring-offset-0 focus:border-[#0B1AA0] focus:shadow-md'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600'
          aria-label='Clear search'
        >
          <X className='h-4 w-4' />
        </button>
      )}
    </div>
  );
}
