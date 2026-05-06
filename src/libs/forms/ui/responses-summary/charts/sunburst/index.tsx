import { useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { FormPage, Question } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';
import { CHART_PALETTE as PAGE_COLORS } from '../palette';

function strokeOf(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const d = (c: number) =>
    Math.round(c * 0.72)
      .toString(16)
      .padStart(2, '0');
  return `#${d(r)}${d(g)}${d(b)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data types for hierarchy
// ─────────────────────────────────────────────────────────────────────────────

interface SunburstLeaf {
  name: string;
  value: number;
  pageIndex: number;
}

interface SunburstBranch {
  name: string;
  pageIndex: number;
  children: (SunburstLeaf | SunburstBranch)[];
}

type SunburstNode = SunburstLeaf | SunburstBranch;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface SunburstChartProps {
  pages: FormPage[];
  responses: FormResponse[];
}

function countAnswersForQuestion(
  q: Question,
  responses: FormResponse[],
): number {
  return responses.filter((r) => {
    const ans = r.answers[q.id];
    return ans !== undefined && ans !== null && ans !== '';
  }).length;
}

export function SunburstChart({ pages, responses }: SunburstChartProps) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = (size / 2) * 0.9;

  // Build tree data
  const treeData = useMemo<SunburstNode>(() => {
    const children: SunburstBranch[] = pages.map((page, pi) => {
      // Group questions by type
      const typeGroups = new Map<string, number>();
      for (const q of page.questions) {
        if (q.type === 'section') continue;
        const count = countAnswersForQuestion(q, responses);
        typeGroups.set(q.type, (typeGroups.get(q.type) ?? 0) + count);
      }

      const typeChildren: SunburstLeaf[] = [...typeGroups.entries()].map(
        ([type, value]) => ({
          name: type.replace('_', ' '),
          value: Math.max(value, 1),
          pageIndex: pi,
        }),
      );

      return {
        name: page.title,
        pageIndex: pi,
        children:
          typeChildren.length > 0
            ? typeChildren
            : [{ name: 'no questions', value: 1, pageIndex: pi }],
      };
    });

    return { name: 'Form', pageIndex: -1, children };
  }, [pages, responses]);

  // Active root (for zoom)
  const [activeId, setActiveId] = useState<string | null>(null);

  const { arcs, breadcrumb } = useMemo(() => {
    const root = d3
      .hierarchy<SunburstNode>(treeData, (d) =>
        'children' in d ? d.children : undefined,
      )
      .sum((d) => ('value' in d ? (d as SunburstLeaf).value : 0));

    // Find active node
    let activeNode: d3.HierarchyNode<SunburstNode> = root;
    if (activeId) {
      root.each((node) => {
        if (node.data.name === activeId) activeNode = node;
      });
    }

    d3.partition<SunburstNode>().size([2 * Math.PI, maxR])(root);

    // Normalize to active node's angle span
    const activePart = activeNode as d3.HierarchyRectangularNode<SunburstNode>;
    const x0 = activeId ? activePart.x0 : 0;
    const x1 = activeId ? activePart.x1 : 2 * Math.PI;
    const y0depth = activeId ? activePart.depth : 0;

    const xScale = d3.scaleLinear([x0, x1], [0, 2 * Math.PI]);
    const yScale = d3.scaleLinear([y0depth, root.height + 1], [0, maxR]);

    const arcGen = d3
      .arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle((d) => xScale(d.x0))
      .endAngle((d) => xScale(d.x1))
      .padAngle(0.012)
      .padRadius(30)
      .innerRadius((d) => yScale(d.depth - (activeId ? activePart.depth : 0)))
      .outerRadius(
        (d) => yScale(d.depth - (activeId ? activePart.depth : 0) + 1) - 1,
      )
      .cornerRadius(2);

    const arcs: {
      path: string;
      fill: string;
      stroke: string;
      name: string;
      depth: number;
      isClickable: boolean;
      arcNode: d3.HierarchyRectangularNode<SunburstNode>;
    }[] = [];

    root.descendants().forEach((node) => {
      const rectNode = node as d3.HierarchyRectangularNode<SunburstNode>;
      if (rectNode.depth === 0) return; // skip root center

      const pi = node.data.pageIndex;
      const baseColor =
        pi >= 0 ? PAGE_COLORS[pi % PAGE_COLORS.length] : '#e2e8f0';
      // Lighter for deeper levels
      const fill =
        rectNode.depth === 1
          ? baseColor
          : d3
              .hsl(baseColor)
              .brighter(0.5 * (rectNode.depth - 1))
              .formatHex();

      const path = arcGen(rectNode) ?? '';
      if (!path) return;

      arcs.push({
        path,
        fill,
        stroke: strokeOf(baseColor),
        name: node.data.name,
        depth: rectNode.depth,
        isClickable: 'children' in node.data && rectNode.depth === 1,
        arcNode: rectNode,
      });
    });

    // Breadcrumb from active node up
    const crumbs: string[] = [];
    if (activeId) {
      let n: d3.HierarchyNode<SunburstNode> | null = activeNode;
      while (n) {
        if (n.data.name !== 'Form') crumbs.unshift(n.data.name);
        n = n.parent;
      }
    }

    return { arcs, breadcrumb: crumbs };
  }, [treeData, activeId, maxR]);

  return (
    <div className='flex flex-col items-center gap-2'>
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className='flex items-center gap-1 text-xs text-slate-500'>
          <button
            className='text-blue-500 hover:underline'
            onClick={() => setActiveId(null)}
          >
            All pages
          </button>
          {breadcrumb.map((crumb, i) => (
            <span key={i}>
              <span className='mx-1 text-slate-300'>/</span>
              <span className='text-slate-600'>{crumb}</span>
            </span>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className='w-full'
        style={{ maxHeight: size }}
      >
        <g transform={`translate(${cx},${cy})`}>
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.path}
              fill={arc.fill}
              stroke={arc.stroke}
              strokeWidth={0.6}
              style={{ cursor: arc.isClickable ? 'pointer' : 'default' }}
              onClick={() => {
                if (arc.isClickable) setActiveId(arc.name);
              }}
            >
              <title>{arc.name}</title>
            </path>
          ))}

          {/* Center label */}
          {!activeId && (
            <text
              textAnchor='middle'
              dominantBaseline='middle'
              fontSize={11}
              fill='#64748b'
            >
              Response coverage
            </text>
          )}
        </g>

        {/* Depth labels for outermost arcs */}
        {arcs
          .filter((a) => a.depth === 2)
          .map((arc, i) => {
            const centroid = (() => {
              // Get centroid of the arc
              const r = arc.arcNode;
              const midAngle = (r.x0 + r.x1) / 2;
              const midR = (r.y0 + r.y1) / 2;
              return [
                cx + midR * Math.sin(midAngle),
                cy - midR * Math.cos(midAngle),
              ];
            })();
            return (
              <text
                key={i}
                x={centroid[0]}
                y={centroid[1]}
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize={8}
                fill='#475569'
                pointerEvents='none'
              >
                {arc.name.length > 8 ? arc.name.slice(0, 7) + '…' : arc.name}
              </text>
            );
          })}
      </svg>

      {/* Page legend */}
      <div className='flex flex-wrap justify-center gap-x-3 gap-y-1'>
        {pages.map((page, i) => (
          <div
            key={page.id}
            className='flex items-center gap-1 text-xs text-slate-500'
          >
            <span
              className='h-2 w-2 rounded-sm shrink-0'
              style={{ background: PAGE_COLORS[i % PAGE_COLORS.length] }}
            />
            {page.title}
          </div>
        ))}
      </div>
    </div>
  );
}
