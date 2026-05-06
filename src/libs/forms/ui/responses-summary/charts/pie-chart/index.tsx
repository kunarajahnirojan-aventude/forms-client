import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ChoiceEntry } from '@/libs/forms/hooks/use-responses-summary';
import { CHART_PALETTE, strokeOf } from '../palette';

interface PieChartProps {
  data: ChoiceEntry[];
  totalAnswered: number;
}

/**
 * Filled pie chart (no donut hole) with entry-animate arcs and a legend.
 */
export function PieChart({ data, totalAnswered }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 260;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const outerR = 90;

  const nonZero = data.filter((d) => d.count > 0);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (nonZero.length === 0) return;

    const pie = d3
      .pie<ChoiceEntry>()
      .value((d) => d.count)
      .sort(null);
    const arcGen = d3
      .arc<d3.PieArcDatum<ChoiceEntry>>()
      .innerRadius(0)
      .outerRadius(outerR)
      .cornerRadius(2)
      .padAngle(0.018);

    const arcs = pie(nonZero);
    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (_, i) => CHART_PALETTE[i % CHART_PALETTE.length])
      .attr('stroke', (_, i) =>
        strokeOf(CHART_PALETTE[i % CHART_PALETTE.length]),
      )
      .attr('stroke-width', 0.8)
      .attr('d', (d) => arcGen({ ...d, endAngle: d.startAngle }) ?? '')
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attrTween('d', (d) => {
        const interp = d3.interpolate({ ...d, endAngle: d.startAngle }, d);
        return (t) => arcGen(interp(t)) ?? '';
      });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (nonZero.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No answers yet
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className='w-52 shrink-0'
      />

      {/* Legend */}
      <div className='flex w-full flex-col gap-1'>
        {nonZero.map((entry, i) => {
          const pct =
            totalAnswered > 0
              ? Math.round((entry.count / totalAnswered) * 100)
              : 0;
          return (
            <div key={entry.label} className='flex items-center gap-2 text-xs'>
              <span
                className='h-2.5 w-2.5 shrink-0 rounded-sm'
                style={{
                  background: CHART_PALETTE[i % CHART_PALETTE.length],
                  border: `1px solid ${strokeOf(CHART_PALETTE[i % CHART_PALETTE.length])}`,
                }}
              />
              <span className='flex-1 truncate text-slate-600'>
                {entry.label}
              </span>
              <span className='shrink-0 font-medium text-slate-700'>
                {pct}%
              </span>
              <span className='shrink-0 text-slate-400'>{entry.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
