import { useMemo } from 'react';
import * as d3 from 'd3';
import type { MatrixEntry } from '@/libs/forms/hooks/use-responses-summary';

interface MatrixHeatmapProps {
  data: MatrixEntry[];
  totalAnswered: number;
}

export function MatrixHeatmap({ data, totalAnswered }: MatrixHeatmapProps) {
  const { rows, cols, cellMap, cellW, cellH, svgW, svgH, margin } =
    useMemo(() => {
      const rowLabels = [
        ...new Map(data.map((d) => [d.rowId, d.rowLabel])).entries(),
      ];
      const colLabels = [
        ...new Map(data.map((d) => [d.colId, d.colLabel])).entries(),
      ];

      const margin = { top: 8, right: 8, bottom: 60, left: 110 };
      const cellW = Math.max(
        52,
        Math.min(90, Math.floor(360 / colLabels.length)),
      );
      const cellH = 36;
      const innerW = cellW * colLabels.length;
      const innerH = cellH * rowLabels.length;
      const svgW = innerW + margin.left + margin.right;
      const svgH = innerH + margin.top + margin.bottom;

      const maxCount = d3.max(data, (d) => d.count) ?? 1;
      void maxCount; // range is computed per-cell via HSL lightness

      const cellMap = new Map<string, MatrixEntry>();
      for (const d of data) {
        cellMap.set(`${d.rowId}__${d.colId}`, d);
      }

      return {
        rows: rowLabels,
        cols: colLabels,
        cellMap,
        cellW,
        cellH,
        svgW,
        svgH,
        margin,
      };
    }, [data]);

  if (data.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        No answers yet
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width={svgW}
        className='block'
        style={{ minWidth: svgW, maxWidth: '100%' }}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Column labels */}
          {cols.map(([colId, colLabel], ci) => (
            <text
              key={colId}
              x={ci * cellW + cellW / 2}
              y={rows.length * cellH + 14}
              textAnchor='middle'
              fontSize={10}
              fill='#64748b'
              transform={`rotate(40, ${ci * cellW + cellW / 2}, ${rows.length * cellH + 14})`}
            >
              {colLabel.length > 14 ? colLabel.slice(0, 13) + '…' : colLabel}
            </text>
          ))}

          {rows.map(([rowId, rowLabel], ri) => (
            <g key={rowId} transform={`translate(0,${ri * cellH})`}>
              {/* Row label */}
              <text
                x={-8}
                y={cellH / 2}
                textAnchor='end'
                dominantBaseline='middle'
                fontSize={10}
                fill='#475569'
              >
                {rowLabel.length > 16 ? rowLabel.slice(0, 15) + '…' : rowLabel}
              </text>

              {cols.map(([colId, colLabel], ci) => {
                const cell = cellMap.get(`${rowId}__${colId}`);
                const count = cell?.count ?? 0;
                const pct = totalAnswered > 0 ? count / totalAnswered : 0;
                // Vivid blue-green heatmap: hsl(160, 85%, 90%) → hsl(160, 85%, 35%)
                const lightness = 0.92 - pct * 0.57;
                const fillHex = d3.hsl(160, 0.85, lightness).formatHex();
                const textFill = lightness < 0.6 ? '#fff' : '#134e4a';
                const pctLabel =
                  totalAnswered > 0
                    ? Math.round((count / totalAnswered) * 100)
                    : 0;

                return (
                  <g key={colId} transform={`translate(${ci * cellW},0)`}>
                    <rect
                      width={cellW - 2}
                      height={cellH - 2}
                      x={1}
                      y={1}
                      fill={fillHex}
                      stroke='#e2e8f0'
                      strokeWidth={0.5}
                      rx={3}
                    />
                    <title>{`${rowLabel} × ${colLabel}: ${count} (${pctLabel}%)`}</title>
                    <text
                      x={cellW / 2}
                      y={cellH / 2 - 5}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      fontSize={11}
                      fontWeight='600'
                      fill={textFill}
                    >
                      {count}
                    </text>
                    <text
                      x={cellW / 2}
                      y={cellH / 2 + 7}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      fontSize={9}
                      fill={lightness < 0.65 ? '#e0eeff' : '#94a3b8'}
                    >
                      {pctLabel}%
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
