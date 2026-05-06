import { useMemo } from 'react';
import * as d3 from 'd3';
import type { ScaleEntry } from '@/libs/forms/hooks/use-responses-summary';

interface ScaleHistogramProps {
  data: ScaleEntry[];
  totalAnswered: number;
  min: number;
  max: number;
  mean: number;
  median: number;
}

const BAR_FILL = '#60a5fa';
const BAR_STROKE = '#2563eb';
const AREA_FILL = '#dbeafe';
const AREA_STROKE = '#60a5fa';

export function ScaleHistogram({
  data,
  totalAnswered,
  min,
  max,
  mean,
  median,
}: ScaleHistogramProps) {
  const width = 420;
  const height = 200;
  const margin = { top: 16, right: 16, bottom: 36, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { yScale, bars, areaPath } = useMemo(() => {
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => String(d.value)))
      .range([0, innerW])
      .padding(0.25);

    const maxCount = d3.max(data, (d) => d.count) ?? 1;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([innerH, 0]);

    const bars = data.map((d) => ({
      x: xScale(String(d.value)) ?? 0,
      y: yScale(d.count),
      w: xScale.bandwidth(),
      h: innerH - yScale(d.count),
      label: String(d.value),
      count: d.count,
    }));

    // Smooth area path over bar midpoints
    const areaGen = d3
      .area<ScaleEntry>()
      .x((d) => (xScale(String(d.value)) ?? 0) + xScale.bandwidth() / 2)
      .y0(innerH)
      .y1((d) => yScale(d.count))
      .curve(d3.curveCatmullRom.alpha(0.5));

    return { xScale, yScale, bars, areaPath: areaGen(data) ?? '' };
  }, [data, innerW, innerH]);

  const yTicks = yScale.ticks(4);

  return (
    <div className='flex flex-col gap-3'>
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
          {/* Y axis labels */}
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

          {/* Smooth area */}
          <path
            d={areaPath}
            fill={AREA_FILL}
            stroke={AREA_STROKE}
            strokeWidth={1.5}
            opacity={0.7}
          />

          {/* Bars */}
          {bars.map((b) => (
            <g key={b.label}>
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
              {/* X axis label */}
              <text
                x={b.x + b.w / 2}
                y={innerH + 14}
                textAnchor='middle'
                fontSize={10}
                fill='#64748b'
              >
                {b.label}
              </text>
              {/* Count above bar */}
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

          {/* Baseline */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke='#cbd5e1' />
        </g>
      </svg>

      {/* Stat pills */}
      <div className='flex flex-wrap gap-2'>
        {[
          { label: 'Responses', value: totalAnswered },
          { label: 'Min', value: min },
          { label: 'Max', value: max },
          { label: 'Mean', value: mean },
          { label: 'Median', value: median },
        ].map((s) => (
          <div
            key={s.label}
            className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs'
          >
            <span className='text-slate-400'>{s.label} </span>
            <span className='font-semibold text-slate-700'>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
