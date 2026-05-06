import { useMemo } from 'react';
import * as d3 from 'd3';
import type { DateEntry } from '@/libs/forms/hooks/use-responses-summary';

interface DateHistogramProps {
  data: DateEntry[];
  totalAnswered: number;
}

const BAR_FILL = '#34d399';
const BAR_STROKE = '#059669';

export function DateHistogram({ data, totalAnswered }: DateHistogramProps) {
  const width = 420;
  const height = 200;
  const margin = { top: 16, right: 16, bottom: 52, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { bars, yTicks, yScale } = useMemo(() => {
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.period))
      .range([0, innerW])
      .padding(0.25);

    const maxCount = d3.max(data, (d) => d.count) ?? 1;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([innerH, 0]);

    const bars = data.map((d) => ({
      x: xScale(d.period) ?? 0,
      y: yScale(d.count),
      w: xScale.bandwidth(),
      h: innerH - yScale(d.count),
      period: d.period,
      count: d.count,
    }));

    return { bars, yTicks: yScale.ticks(4), yScale };
  }, [data, innerW, innerH]);

  if (data.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No date answers yet
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='w-full'
        style={{ maxHeight: height }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Y grid lines */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={0}
              x2={innerW}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke='#e2e8f0'
              strokeDasharray='3 3'
            />
          ))}
          {yTicks.map((t) => (
            <text
              key={t}
              x={-6}
              y={yScale(t)}
              textAnchor='end'
              dominantBaseline='middle'
              fontSize={10}
              fill='#94a3b8'
            >
              {t}
            </text>
          ))}

          {bars.map((b) => (
            <g key={b.period}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={BAR_FILL}
                stroke={BAR_STROKE}
                strokeWidth={0.8}
                rx={3}
              />
              {/* X-axis label — rotated 45° */}
              <text
                x={b.x + b.w / 2}
                y={innerH + 10}
                textAnchor='end'
                fontSize={9}
                fill='#64748b'
                transform={`rotate(-45, ${b.x + b.w / 2}, ${innerH + 10})`}
              >
                {b.period}
              </text>
              {b.count > 0 && (
                <text
                  x={b.x + b.w / 2}
                  y={b.y - 4}
                  textAnchor='middle'
                  fontSize={9}
                  fill='#64748b'
                >
                  {b.count}
                </text>
              )}
            </g>
          ))}

          <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke='#cbd5e1' />
        </g>
      </svg>

      <div className='text-xs text-slate-400'>
        {totalAnswered} date responses across {data.length} month
        {data.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
