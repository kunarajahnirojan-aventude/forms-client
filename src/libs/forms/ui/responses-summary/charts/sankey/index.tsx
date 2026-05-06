import { useMemo } from 'react';
import type { PageCompletionEntry } from '@/libs/forms/hooks/use-responses-summary';
import { CHART_PALETTE as NODE_COLORS, strokeOf } from '../palette';

// d3-sankey is bundled inside d3 full (via d3-sankey package export)
// We import directly from d3-sankey which is a dependency of d3
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

interface SankeyChartProps {
  pageCompletionCounts: PageCompletionEntry[];
  totalResponses: number;
}

export function SankeyChart({
  pageCompletionCounts,
  totalResponses,
}: SankeyChartProps) {
  const width = 400;
  const height = 240;
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };

  const { nodes, links } = useMemo(() => {
    if (pageCompletionCounts.length === 0) {
      return { nodes: [], links: [] };
    }

    // Build nodes: one per page + "Completed" terminal
    const nodeList = [
      ...pageCompletionCounts.map((p, i) => ({
        name: p.pageTitle,
        color: NODE_COLORS[i % NODE_COLORS.length],
      })),
      { name: 'Completed', color: '#bbf7d0' },
    ];

    // Links: each page → next page (flow = count of the destination)
    const linkList: { source: number; target: number; value: number }[] = [];
    for (let i = 0; i < pageCompletionCounts.length; i++) {
      const target =
        i + 1 < pageCompletionCounts.length
          ? i + 1
          : pageCompletionCounts.length; // → "Completed"
      linkList.push({
        source: i,
        target,
        value: Math.max(
          1,
          pageCompletionCounts[target] ? pageCompletionCounts[target].count : 0,
        ),
      });
    }

    // Sankey layout
    const sankeyGen = sankey<
      { name: string; color: string },
      { source: number; target: number; value: number }
    >()
      .nodeWidth(18)
      .nodePadding(12)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    const graph = sankeyGen({
      nodes: nodeList.map((d, i) => ({ ...d, index: i })),
      links: linkList,
    });

    return { nodes: graph.nodes, links: graph.links };
  }, [pageCompletionCounts, width, height, margin]);

  if (nodes.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center text-sm text-slate-400'>
        Not enough page data
      </div>
    );
  }

  const linkPath = sankeyLinkHorizontal();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className='w-full'
      style={{ maxHeight: height }}
    >
      {/* Links */}
      {links.map((link, i) => {
        const sourceNode = nodes[
          (link.source as { index?: number }).index ?? 0
        ] as { color?: string; name?: string };
        const d = linkPath(link as Parameters<typeof linkPath>[0]) ?? '';
        const strokeW = Math.max(1, (link.width as number) ?? 4);
        return (
          <path
            key={i}
            d={d}
            fill='none'
            stroke={sourceNode.color ?? '#bfdbfe'}
            strokeWidth={strokeW}
            strokeOpacity={0.4}
          >
            <title>
              {(link.source as { name?: string }).name} →{' '}
              {(link.target as { name?: string }).name}: {link.value}
            </title>
          </path>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const x0 = (node as { x0?: number }).x0 ?? 0;
        const x1 = (node as { x1?: number }).x1 ?? 0;
        const y0 = (node as { y0?: number }).y0 ?? 0;
        const y1 = (node as { y1?: number }).y1 ?? 0;
        const color =
          (node as { color?: string }).color ??
          NODE_COLORS[i % NODE_COLORS.length];
        const label = (node as { name?: string }).name ?? '';
        const nodeH = y1 - y0;
        const isLeft = x0 < width / 2;

        return (
          <g key={i}>
            <rect
              x={x0}
              y={y0}
              width={x1 - x0}
              height={nodeH}
              fill={color}
              stroke={strokeOf(color)}
              strokeWidth={0.8}
              rx={3}
            />
            <text
              x={isLeft ? x1 + 5 : x0 - 5}
              y={y0 + nodeH / 2}
              dominantBaseline='middle'
              textAnchor={isLeft ? 'start' : 'end'}
              fontSize={9}
              fill='#475569'
            >
              {label.length > 14 ? label.slice(0, 13) + '…' : label}
            </text>
          </g>
        );
      })}

      {/* Total label */}
      <text
        x={width / 2}
        y={height - 2}
        textAnchor='middle'
        fontSize={9}
        fill='#94a3b8'
      >
        {totalResponses} total respondents
      </text>
    </svg>
  );
}
