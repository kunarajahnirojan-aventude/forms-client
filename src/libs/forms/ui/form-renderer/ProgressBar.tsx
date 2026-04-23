interface ProgressBarProps {
  current: number; // 0-based index
  total: number;
  label?: string;
}

export function ProgressBar({
  current,
  total,
  label = 'Step',
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className='w-full'>
      <div className='mb-1.5 flex items-center justify-between text-xs text-slate-500'>
        <span>
          {label} {current + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200'>
        <div
          className='h-full rounded-full bg-[#0B1AA0] transition-all duration-300'
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
