interface FileCountCardProps {
  count: number;
  respondentCount: number;
}

export function FileCountCard({ count, respondentCount }: FileCountCardProps) {
  return (
    <div className='flex flex-wrap gap-4'>
      <div className='flex flex-col gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-6 py-4'>
        <span className='text-3xl font-bold text-slate-800'>{count}</span>
        <span className='text-xs text-slate-500'>Total files uploaded</span>
      </div>
      <div className='flex flex-col gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-6 py-4'>
        <span className='text-3xl font-bold text-slate-800'>
          {respondentCount}
        </span>
        <span className='text-xs text-slate-500'>Respondents who uploaded</span>
      </div>
    </div>
  );
}
