import { useMemo } from 'react';
import * as d3 from 'd3';
import type { MatrixEntry } from '@/libs/forms/hooks/use-responses-summary';
import { CHART_PALETTE, strokeOf } from '../palette';

interface GroupedBarProps {
  data: MatrixEntry[];
  totalAnswered: number;
}

/**
 * Grouped bar chart for matrix questions.
 * X groups = column options, bars within each group = row labels.
 */
export function GroupedBar({
  data,
  totalAnswered: _totalAnswered,
}: GroupedBarProps) {
  const width = 520;
  const height = 240;
  const margin = { top: 24, right: 16, bottom: 56, left: 40 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { groups, rowColors, yScale, yTicks, rowLabels } = useMemo(() => {
    const rowLabels = [
      ...new Map(data.map((d) => [d.rowId, d.rowLabel])).entries(),
    ];
    const colLabels = [
      ...new Map(data.map((d) => [d.colId, d.colLabel])).entries(),
    ];

    const xScale = d3
      .scaleBand()
      .domain(colLabels.map(([id]) => id))
      .range([0, innerW])
      .paddingInner(0.25)
      .paddingOuter(0.1);

    const xInner = d3
      .scaleBand()
      .domain(rowLabels.map(([id]) => id))
      .range([0, xScale.bandwidth()])
      .padding(0.08);

    const maxCount = d3.max(data, (d) => d.count) ?? 1;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([innerH, 0]);

    const rowColors: Record<string, string> = {};
    rowLabels.forEach(([id], i) => {
      rowColors[id] = CHART_PALETTE[i % CHART_PALETTE.length];
    });

    const groups = colLabels.map(([colId, colLabel]) => {
      const colX = xScale(colId) ?? 0;
      const bars = rowLabels.map(([rowId]) => {
        const entry = data.find((d) => d.colId === colId && d.rowId === rowId);
        const count = entry?.count ?? 0;
        return {
          rowId,
          x: colX + (xInner(rowId) ?? 0),
          y: yScale(count),
          w: xInner.bandwidth(),
          h: innerH - yScale(count),
          count,
          fill: rowColors[rowId],
          stroke: strokeOf(rowColors[rowId]),
        };
      });
      return { colId, colLabel, colX, groupW: xScale.bandwidth(), bars };
    });

    return {
      groups,
      rowColors,
      yScale,
      yTicks: yScale.ticks(4),
      rowLabels,
    };
  }, [data, innerW, innerH]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No answers yet
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='w-full'
        style={{ maxHeight: height }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Y grid */}
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

          {/* Bar groups */}
          {groups.map((g) => (
            <g key={g.colId}>
              {g.bars.map((b) => (
                <g key={b.rowId}>
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={Math.max(b.h, 1)}
                    fill={b.fill}
                    stroke={b.stroke}
                    strokeWidth={0.8}
                    rx={3}
                  />
                  {b.count > 0 && (
                    <text
                      x={b.x + b.w / 2}
                      y={b.y - 3}
                      textAnchor='middle'
                      fontSize={9}
                      fill='#475569'
                    >
                      {b.count}
                    </text>
                  )}
                </g>
              ))}

              {/* Column group label */}
              <text
                x={g.colX + g.groupW / 2}
                y={innerH + 14}
                textAnchor='middle'
                fontSize={10}
                fill='#64748b'
              >
                {g.colLabel.length > 12
                  ? g.colLabel.slice(0, 11) + '…'
                  : g.colLabel}
              </text>
            </g>
          ))}

          {/* Baseline */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke='#cbd5e1' />
        </g>
      </svg>

      {/* Row legend */}
      <div className='flex flex-wrap gap-3 px-1'>
        {rowLabels.map(([id, label]) => (
          <div
            key={id}
            className='flex items-center gap-1.5 text-xs text-slate-600'
          >
            <span
              className='h-2.5 w-2.5 shrink-0 rounded-sm'
              style={{
                background: rowColors[id],
                border: `1px solid ${strokeOf(rowColors[id])}`,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
