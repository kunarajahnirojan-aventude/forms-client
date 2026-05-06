// Vibrant, distinct chart palette — -400 Tailwind tones for brightness
export const CHART_PALETTE = [
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f87171', // red-400
  '#a78bfa', // violet-400
  '#fb923c', // orange-400
  '#22d3ee', // cyan-400
  '#f472b6', // pink-400
  '#a3e635', // lime-400
  '#c084fc', // purple-400
  '#4ade80', // green-400
  '#38bdf8', // sky-400
];

export function strokeOf(fill: string): string {
  const r = parseInt(fill.slice(1, 3), 16);
  const g = parseInt(fill.slice(3, 5), 16);
  const b = parseInt(fill.slice(5, 7), 16);
  const d = (c: number) =>
    Math.round(c * 0.72)
      .toString(16)
      .padStart(2, '0');
  return `#${d(r)}${d(g)}${d(b)}`;
}
