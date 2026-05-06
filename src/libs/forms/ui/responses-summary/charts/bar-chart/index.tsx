import { useMemo } from 'react';
import * as d3 from 'd3';
import { CHART_PALETTE, strokeOf } from '../palette';

export interface GenericEntry {
  label: string;
  count: number;
}

interface BarChartProps {
  data: GenericEntry[];
  /** Pass 0 to hide the percentage column */
  totalAnswered: number;
}

/**
 * Horizontal bar chart — works for any labeled category data.
 * Used for choice, scale, and date question types.
 */
export function BarChart({ data, totalAnswered }: BarChartProps) {
  const nonZero = data.filter((d) => d.count > 0);

  const ROW_H = 38;
  const width = 420;
  const height = Math.max(80, nonZero.length * ROW_H + 20);
  const margin = { top: 8, right: 80, bottom: 8, left: 140 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const bars = useMemo(() => {
    const maxCount = d3.max(nonZero, (d) => d.count) ?? 1;
    const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, innerW]);
    const yScale = d3
      .scaleBand()
      .domain(nonZero.map((d) => d.label))
      .range([0, innerH])
      .padding(0.28);

    return nonZero.map((d, i) => ({
      y: yScale(d.label) ?? 0,
      h: yScale.bandwidth(),
      w: xScale(d.count),
      fill: CHART_PALETTE[i % CHART_PALETTE.length],
      stroke: strokeOf(CHART_PALETTE[i % CHART_PALETTE.length]),
      label: d.label,
      count: d.count,
      pct:
        totalAnswered > 0 ? Math.round((d.count / totalAnswered) * 100) : null,
    }));
  }, [nonZero, innerW, innerH, totalAnswered]); // eslint-disable-line react-hooks/exhaustive-deps

  if (nonZero.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No answers yet
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className='w-full'
      style={{ maxHeight: Math.min(height, 360) }}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Axis line */}
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={innerH}
          stroke='#cbd5e1'
          strokeWidth={1}
        />

        {bars.map((b) => (
          <g key={b.label}>
            {/* Row label */}
            <text
              x={-8}
              y={b.y + b.h / 2}
              textAnchor='end'
              dominantBaseline='middle'
              fontSize={11}
              fill='#475569'
            >
              {b.label.length > 16 ? b.label.slice(0, 15) + '…' : b.label}
            </text>

            {/* Bar */}
            <rect
              x={0}
              y={b.y}
              width={Math.max(b.w, 2)}
              height={b.h}
              fill={b.fill}
              stroke={b.stroke}
              strokeWidth={0.8}
              rx={4}
            />

            {/* Count + % label */}
            <text
              x={Math.max(b.w, 2) + 8}
              y={b.y + b.h / 2}
              dominantBaseline='middle'
              fontSize={10}
              fill='#64748b'
            >
              {b.count}
              {b.pct !== null ? ` (${b.pct}%)` : ''}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
