import { useMemo } from 'react';

interface TextListProps {
  answers: string[];
  totalAnswered: number;
}

export function TextList({ answers, totalAnswered }: TextListProps) {
  const visible = answers.slice(0, 50);
  const overflow = totalAnswered - visible.length;

  // Sparkline: distribution of answer character lengths
  const sparkData = useMemo(() => {
    if (answers.length === 0) return [];
    const maxLen = Math.max(...answers.map((a) => a.length), 1);
    // 10 buckets
    const buckets = new Array<number>(10).fill(0);
    for (const a of answers) {
      const idx = Math.min(9, Math.floor((a.length / (maxLen + 1)) * 10));
      buckets[idx]++;
    }
    return buckets;
  }, [answers]);

  const sparkMax = Math.max(...sparkData, 1);
  const sparkH = 18;
  const sparkW = 6;
  const sparkGap = 1;

  return (
    <div className='flex flex-col gap-3'>
      {/* Stats row */}
      <div className='flex items-center gap-3'>
        <div className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs'>
          <span className='text-slate-400'>Total </span>
          <span className='font-semibold text-slate-700'>{totalAnswered}</span>
        </div>
        {sparkData.length > 0 && (
          <div className='flex items-end gap-px'>
            <span className='mr-1 text-[10px] text-slate-400'>
              length dist.
            </span>
            <svg
              width={(sparkW + sparkGap) * 10}
              height={sparkH}
              viewBox={`0 0 ${(sparkW + sparkGap) * 10} ${sparkH}`}
            >
              {sparkData.map((v, i) => {
                const bh = Math.max(2, (v / sparkMax) * sparkH);
                return (
                  <rect
                    key={i}
                    x={i * (sparkW + sparkGap)}
                    y={sparkH - bh}
                    width={sparkW}
                    height={bh}
                    fill='#bfdbfe'
                    stroke='#7cb3d1'
                    strokeWidth={0.5}
                    rx={1}
                  />
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Answer list */}
      <div className='max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50'>
        {visible.length === 0 ? (
          <div className='px-4 py-8 text-center text-sm text-slate-400'>
            No answers yet
          </div>
        ) : (
          <ul className='divide-y divide-slate-100'>
            {visible.map((ans, i) => (
              <li key={i} className='flex gap-2 px-3 py-2 text-sm'>
                <span className='shrink-0 text-xs text-slate-300'>
                  {i + 1}.
                </span>
                <span className='text-slate-700 break-words'>{ans}</span>
              </li>
            ))}
            {overflow > 0 && (
              <li className='px-3 py-2 text-center text-xs text-slate-400'>
                +{overflow} more answer{overflow !== 1 ? 's' : ''} not shown
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
