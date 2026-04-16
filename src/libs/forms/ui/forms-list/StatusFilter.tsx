import { ChevronDown } from 'lucide-react';
import type { FormStatus } from '@/libs/forms/store/types';
import { cn } from '@/utils';

type FilterOption = { label: string; value: FormStatus | 'all' };

const OPTIONS: FilterOption[] = [
  { label: 'All forms', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Closed', value: 'closed' },
];

interface StatusFilterProps {
  value: FormStatus | 'all';
  onChange: (v: FormStatus | 'all') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FormStatus | 'all')}
        className={cn(
          'h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm font-medium text-slate-700',
          'transition-shadow focus:outline-none focus:ring-2 focus:ring-[#0B1AA0] focus:border-[#0B1AA0] cursor-pointer',
        )}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
    </div>
  );
}
