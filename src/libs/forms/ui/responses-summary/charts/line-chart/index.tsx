import { useMemo } from 'react';
import * as d3 from 'd3';

export interface LineEntry {
  label: string;
  count: number;
}

interface LineChartProps {
  data: LineEntry[];
  /** Hex color for the line and dots, e.g. '#60a5fa' */
  color?: string;
}

/**
 * Smooth line/area chart — works for scale, date, or trend data.
 */
export function LineChart({ data, color = '#60a5fa' }: LineChartProps) {
  const width = 420;
  const height = 200;
  const margin = { top: 16, right: 16, bottom: 36, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { linePath, areaPath, dots, yTicks, yScale } = useMemo(() => {
    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.label))
      .range([0, innerW])
      .padding(0.5);

    const maxCount = d3.max(data, (d) => d.count) ?? 1;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([innerH, 0]);

    const lineGen = d3
      .line<LineEntry>()
      .x((d) => xScale(d.label) ?? 0)
      .y((d) => yScale(d.count))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGen = d3
      .area<LineEntry>()
      .x((d) => xScale(d.label) ?? 0)
      .y0(innerH)
      .y1((d) => yScale(d.count))
      .curve(d3.curveCatmullRom.alpha(0.5));

    return {
      linePath: lineGen(data) ?? '',
      areaPath: areaGen(data) ?? '',
      dots: data.map((d) => ({
        cx: xScale(d.label) ?? 0,
        cy: yScale(d.count),
        label: d.label,
        count: d.count,
      })),
      yTicks: yScale.ticks(4),
      yScale,
    };
  }, [data, innerW, innerH]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No data yet
      </div>
    );
  }

  return (
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

        {/* Area fill */}
        <path d={areaPath} fill={`${color}28`} />

        {/* Line */}
        <path
          d={linePath}
          fill='none'
          stroke={color}
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Dots + labels */}
        {dots.map((dot) => (
          <g key={dot.label}>
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={4}
              fill='white'
              stroke={color}
              strokeWidth={2}
            />
            {/* X axis label */}
            <text
              x={dot.cx}
              y={innerH + 14}
              textAnchor='middle'
              fontSize={10}
              fill='#64748b'
            >
              {dot.label}
            </text>
            {/* Count above dot */}
            {dot.count > 0 && (
              <text
                x={dot.cx}
                y={dot.cy - 8}
                textAnchor='middle'
                fontSize={9}
                fill='#64748b'
              >
                {dot.count}
              </text>
            )}
          </g>
        ))}

        {/* Baseline */}
        <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke='#cbd5e1' />
      </g>
    </svg>
  );
}
