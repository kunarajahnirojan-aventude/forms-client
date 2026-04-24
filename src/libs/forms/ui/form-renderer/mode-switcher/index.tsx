import type { DisplayMode } from '@/libs/forms/store/types';

const MODE_LABELS: Record<DisplayMode, string> = {
  page: 'Page by page',
  question: 'Question by question',
  all: 'All in one page',
};

interface ModeSwitcherProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className='flex items-center gap-2'>
      <label className='text-xs font-medium text-white/70'>Display</label>
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value as DisplayMode)}
        className='rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40'
      >
        {(Object.keys(MODE_LABELS) as DisplayMode[]).map((m) => (
          <option key={m} value={m} className='bg-slate-800 text-white'>
            {MODE_LABELS[m]}
          </option>
        ))}
      </select>
    </div>
  );
}
