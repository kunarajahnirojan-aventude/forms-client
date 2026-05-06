import { useMemo } from 'react';
import * as d3 from 'd3';
import type { ChoiceEntry } from '@/libs/forms/hooks/use-responses-summary';
import { CHART_PALETTE as PALETTE, strokeOf as strokeColor } from '../palette';

interface TreemapChartProps {
  data: ChoiceEntry[];
  totalAnswered: number;
}

export function TreemapChart({ data, totalAnswered }: TreemapChartProps) {
  const width = 420;
  const height = 240;

  const nonZero = data.filter((d) => d.count > 0);

  const nodes = useMemo(() => {
    if (nonZero.length === 0) return [];

    const root = d3
      .hierarchy<{
        label: string;
        count: number;
        children?: ChoiceEntry[];
      }>({ label: '__root__', count: 0, children: nonZero })
      .sum((d) => d.count ?? 0);

    d3
      .treemap<{ label: string; count: number; children?: typeof nonZero }>()
      .size([width, height])
      .paddingOuter(4)
      .paddingInner(3)
      .round(true)(root);

    return root.leaves();
  }, [nonZero, width, height]);

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
      className='w-full rounded-lg'
      style={{ maxHeight: 240 }}
    >
      {nodes.map((node, i) => {
        const d = node.data as ChoiceEntry;
        const x0 = (node as d3.HierarchyRectangularNode<unknown>).x0;
        const y0 = (node as d3.HierarchyRectangularNode<unknown>).y0;
        const x1 = (node as d3.HierarchyRectangularNode<unknown>).x1;
        const y1 = (node as d3.HierarchyRectangularNode<unknown>).y1;
        const w = x1 - x0;
        const h = y1 - y0;
        const fill = PALETTE[i % PALETTE.length];
        const pct =
          totalAnswered > 0 ? Math.round((d.count / totalAnswered) * 100) : 0;
        const showLabel = w > 40 && h > 28;

        return (
          <g key={d.label} transform={`translate(${x0},${y0})`}>
            <rect
              width={w}
              height={h}
              fill={fill}
              stroke={strokeColor(fill)}
              strokeWidth={0.8}
              rx={4}
            />
            {showLabel && (
              <>
                <text
                  x={w / 2}
                  y={h / 2 - 7}
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={Math.min(11, w / 6)}
                  fill='#334155'
                  className='select-none'
                >
                  <tspan>
                    {d.label.length > 16 ? d.label.slice(0, 15) + '…' : d.label}
                  </tspan>
                </text>
                <text
                  x={w / 2}
                  y={h / 2 + 8}
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={Math.min(10, w / 7)}
                  fill='#64748b'
                  className='select-none'
                >
                  {pct}% · {d.count}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
