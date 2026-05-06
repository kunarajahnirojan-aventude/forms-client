import { useState } from 'react';
import type { QuestionSummary } from '@/libs/forms/hooks/use-responses-summary';
import { DonutChart } from '../charts/donut-chart';
import { TreemapChart } from '../charts/treemap';
import { PieChart } from '../charts/pie-chart';
import { BarChart } from '../charts/bar-chart';
import { ScaleHistogram } from '../charts/scale-histogram';
import { LineChart } from '../charts/line-chart';
import { MatrixHeatmap } from '../charts/matrix-heatmap';
import { GroupedBar } from '../charts/grouped-bar';
import { DateHistogram } from '../charts/date-histogram';
import { TextList } from '../charts/text-list';
import { FileCountCard } from '../charts/file-count-card';

// ─────────────────────────────────────────────────────────────────────────────
// Type badge
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_BADGE_COLORS: Record<string, string> = {
  radio: 'bg-blue-50 text-blue-600 border-blue-200',
  dropdown: 'bg-violet-50 text-violet-600 border-violet-200',
  checkbox: 'bg-amber-50 text-amber-600 border-amber-200',
  yes_no: 'bg-green-50 text-green-600 border-green-200',
  rating: 'bg-orange-50 text-orange-600 border-orange-200',
  linear_scale: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  matrix: 'bg-pink-50 text-pink-600 border-pink-200',
  text: 'bg-slate-50 text-slate-500 border-slate-200',
  phone: 'bg-slate-50 text-slate-500 border-slate-200',
  date: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  file_upload: 'bg-teal-50 text-teal-600 border-teal-200',
};

const TYPE_LABELS: Record<string, string> = {
  radio: 'Radio',
  dropdown: 'Dropdown',
  checkbox: 'Checkbox',
  yes_no: 'Yes / No',
  rating: 'Rating',
  linear_scale: 'Linear scale',
  matrix: 'Matrix',
  text: 'Text',
  phone: 'Phone',
  date: 'Date',
  file_upload: 'File upload',
};

// ─────────────────────────────────────────────────────────────────────────────
// Chart type options per kind
// ─────────────────────────────────────────────────────────────────────────────

type ChartTypeChoice = 'donut' | 'pie' | 'bar' | 'treemap';
type ChartTypeScale = 'histogram' | 'line' | 'bar';
type ChartTypeMatrix = 'heatmap' | 'grouped-bar';
type ChartTypeDate = 'bar' | 'line';

const CHOICE_TYPES: { id: ChartTypeChoice; label: string }[] = [
  { id: 'donut', label: 'Donut' },
  { id: 'pie', label: 'Pie' },
  { id: 'bar', label: 'Bar' },
  { id: 'treemap', label: 'Treemap' },
];

const SCALE_TYPES: { id: ChartTypeScale; label: string }[] = [
  { id: 'histogram', label: 'Histogram' },
  { id: 'line', label: 'Line' },
  { id: 'bar', label: 'Bar' },
];

const MATRIX_TYPES: { id: ChartTypeMatrix; label: string }[] = [
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'grouped-bar', label: 'Grouped Bar' },
];

const DATE_TYPES: { id: ChartTypeDate; label: string }[] = [
  { id: 'bar', label: 'Bar' },
  { id: 'line', label: 'Line' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Chart type pill switcher
// ─────────────────────────────────────────────────────────────────────────────

function ChartTypeSwitcher<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className='flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5'>
      {options.map((opt) => (
        <button
          key={opt.id}
          type='button'
          onClick={() => onChange(opt.id)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
            value === opt.id
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

interface QuestionSummaryCardProps {
  summary: QuestionSummary;
}

export function QuestionSummaryCard({ summary }: QuestionSummaryCardProps) {
  const { question } = summary;
  const qType = question.type;

  const defaultChoiceType: ChartTypeChoice =
    qType === 'checkbox' ? 'treemap' : 'donut';

  const [choiceType, setChoiceType] =
    useState<ChartTypeChoice>(defaultChoiceType);
  const [scaleType, setScaleType] = useState<ChartTypeScale>('histogram');
  const [matrixType, setMatrixType] = useState<ChartTypeMatrix>('heatmap');
  const [dateType, setDateType] = useState<ChartTypeDate>('bar');

  const answeredCount =
    summary.kind === 'choice' ||
    summary.kind === 'scale' ||
    summary.kind === 'matrix' ||
    summary.kind === 'text-list' ||
    summary.kind === 'date-hist'
      ? summary.totalAnswered
      : summary.kind === 'file-count'
        ? summary.respondentCount
        : 0;

  return (
    <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
      {/* Card header */}
      <div className='flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4'>
        <div className='flex min-w-0 flex-col gap-1'>
          <h3 className='text-sm font-semibold text-slate-800 leading-snug'>
            {question.title}
          </h3>
          {question.description && (
            <p className='text-xs text-slate-400 line-clamp-1'>
              {question.description}
            </p>
          )}
        </div>

        <div className='flex shrink-0 flex-wrap items-center gap-2'>
          {/* Chart type switchers */}
          {summary.kind === 'choice' && (
            <ChartTypeSwitcher
              options={CHOICE_TYPES}
              value={choiceType}
              onChange={setChoiceType}
            />
          )}
          {summary.kind === 'scale' && (
            <ChartTypeSwitcher
              options={SCALE_TYPES}
              value={scaleType}
              onChange={setScaleType}
            />
          )}
          {summary.kind === 'matrix' && (
            <ChartTypeSwitcher
              options={MATRIX_TYPES}
              value={matrixType}
              onChange={setMatrixType}
            />
          )}
          {summary.kind === 'date-hist' && (
            <ChartTypeSwitcher
              options={DATE_TYPES}
              value={dateType}
              onChange={setDateType}
            />
          )}

          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TYPE_BADGE_COLORS[qType] ?? 'bg-slate-50 text-slate-500 border-slate-200'}`}
          >
            {TYPE_LABELS[qType] ?? qType}
          </span>
          <span className='rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500'>
            {answeredCount} answered
          </span>
        </div>
      </div>

      {/* Chart body */}
      <div className='px-5 py-4'>
        {/* Choice questions */}
        {summary.kind === 'choice' && (
          <>
            {choiceType === 'donut' && (
              <DonutChart
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
            {choiceType === 'pie' && (
              <PieChart
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
            {choiceType === 'bar' && (
              <BarChart
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
            {choiceType === 'treemap' && (
              <TreemapChart
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
          </>
        )}

        {/* Scale questions */}
        {summary.kind === 'scale' && (
          <>
            {scaleType === 'histogram' && (
              <ScaleHistogram
                data={summary.data}
                totalAnswered={summary.totalAnswered}
                min={summary.min}
                max={summary.max}
                mean={summary.mean}
                median={summary.median}
              />
            )}
            {scaleType === 'line' && (
              <LineChart
                data={summary.data.map((e) => ({
                  label: String(e.value),
                  count: e.count,
                }))}
                color='#60a5fa'
              />
            )}
            {scaleType === 'bar' && (
              <BarChart
                data={summary.data.map((e) => ({
                  label: String(e.value),
                  count: e.count,
                }))}
                totalAnswered={summary.totalAnswered}
              />
            )}
          </>
        )}

        {/* Matrix questions */}
        {summary.kind === 'matrix' && (
          <>
            {matrixType === 'heatmap' && (
              <MatrixHeatmap
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
            {matrixType === 'grouped-bar' && (
              <GroupedBar
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
          </>
        )}

        {/* Text questions */}
        {summary.kind === 'text-list' && (
          <TextList
            answers={summary.answers}
            totalAnswered={summary.totalAnswered}
          />
        )}

        {/* Date questions */}
        {summary.kind === 'date-hist' && (
          <>
            {dateType === 'bar' && (
              <DateHistogram
                data={summary.data}
                totalAnswered={summary.totalAnswered}
              />
            )}
            {dateType === 'line' && (
              <LineChart
                data={summary.data.map((e) => ({
                  label: e.period,
                  count: e.count,
                }))}
                color='#a78bfa'
              />
            )}
          </>
        )}

        {/* File upload questions */}
        {summary.kind === 'file-count' && (
          <FileCountCard
            count={summary.count}
            respondentCount={summary.respondentCount}
          />
        )}
      </div>
    </div>
  );
}
