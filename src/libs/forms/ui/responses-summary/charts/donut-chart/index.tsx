import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ChoiceEntry } from '@/libs/forms/hooks/use-responses-summary';
import { CHART_PALETTE as PALETTE, strokeOf as strokeColor } from '../palette';

interface DonutChartProps {
  data: ChoiceEntry[];
  totalAnswered: number;
}

export function DonutChart({ data, totalAnswered }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 260;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2;
  const outerR = 90;
  const innerR = outerR * 0.48;

  const nonZero = data.filter((d) => d.count > 0);
  const top = nonZero[0];
  const topPct =
    totalAnswered > 0 && top
      ? Math.round((top.count / totalAnswered) * 100)
      : 0;

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
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(3)
      .padAngle(0.025);

    const arcs = pie(nonZero);

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (_, i) => PALETTE[i % PALETTE.length])
      .attr('stroke', (_, i) => strokeColor(PALETTE[i % PALETTE.length]))
      .attr('stroke-width', 0.8)
      .attr('d', (d) => {
        // Start collapsed, animate to full arc
        const start = { ...d, endAngle: d.startAngle };
        return arcGen(start) ?? '';
      })
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attrTween('d', (d) => {
        const interp = d3.interpolate({ ...d, endAngle: d.startAngle }, d);
        return (t) => arcGen(interp(t)) ?? '';
      });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex flex-col items-center gap-4'>
      {/* SVG donut */}
      <div className='relative'>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className='w-52 shrink-0'
        />
        {/* Center label */}
        {top && (
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-xl font-bold text-slate-800'>{topPct}%</span>
            <span className='max-w-[80px] text-center text-[11px] leading-tight text-slate-500 line-clamp-2'>
              {top.label}
            </span>
          </div>
        )}
      </div>

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
                  background: PALETTE[i % PALETTE.length],
                  border: `1px solid ${strokeColor(PALETTE[i % PALETTE.length])}`,
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
