import type { FormPage } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';
import type { FormSummaryStats } from '@/libs/forms/hooks/use-responses-summary';
import { useMemo } from 'react';
import { SunburstChart } from '../charts/sunburst';
import { SankeyChart } from '../charts/sankey';
import { LineChart } from '../charts/line-chart';
import { BarChart } from '../charts/bar-chart';

interface OverviewRowProps {
  pages: FormPage[];
  responses: FormResponse[];
  stats: FormSummaryStats;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OverviewRow({ pages, responses, stats }: OverviewRowProps) {
  const { totalResponses, dateRange, pageCompletionCounts } = stats;

  const completedCount =
    pageCompletionCounts.length > 0
      ? Math.min(...pageCompletionCounts.map((p) => p.count))
      : 0;

  const completionRate =
    totalResponses > 0
      ? Math.round((completedCount / totalResponses) * 100)
      : 0;

  // Responses over time — group by YYYY-MM-DD
  const trendData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of responses) {
      const day = r.submittedAt.slice(0, 10);
      counts[day] = (counts[day] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count }));
  }, [responses]);

  // Responses per page — use pageCompletionCounts
  const pageBarData = useMemo(
    () =>
      pageCompletionCounts.map((p) => ({
        label: p.pageTitle,
        count: p.count,
      })),
    [pageCompletionCounts],
  );

  return (
    <div className='flex flex-col gap-4'>
      {/* Stat chips */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm'>
          <span className='text-2xl font-bold text-slate-800'>
            {totalResponses}
          </span>
          <span className='text-xs text-slate-500'>Total responses</span>
        </div>
        {dateRange && (
          <div className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm'>
            <span className='text-xs text-slate-500'>
              {formatDate(dateRange.min)} — {formatDate(dateRange.max)}
            </span>
          </div>
        )}
        <div className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm'>
          <span className='text-2xl font-bold text-slate-800'>
            {completionRate}%
          </span>
          <span className='text-xs text-slate-500'>Completion rate</span>
        </div>
      </div>

      {/* Sunburst + Sankey */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Sunburst */}
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Response Coverage
            </h3>
            <p className='text-xs text-slate-400'>
              Distribution of answers by page and question type
            </p>
          </div>
          <SunburstChart pages={pages} responses={responses} />
        </div>

        {/* Sankey */}
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Page Completion Funnel
            </h3>
            <p className='text-xs text-slate-400'>
              Respondent flow from page to page
            </p>
          </div>
          <SankeyChart
            pageCompletionCounts={pageCompletionCounts}
            totalResponses={totalResponses}
          />
        </div>
      </div>

      {/* Responses over time + per page */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Trend line chart */}
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Responses Over Time
            </h3>
            <p className='text-xs text-slate-400'>Daily submission trend</p>
          </div>
          {trendData.length > 0 ? (
            <LineChart data={trendData} color='#60a5fa' />
          ) : (
            <div className='flex h-32 items-center justify-center text-sm text-slate-400'>
              No responses yet
            </div>
          )}
        </div>

        {/* Per-page bar chart */}
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='mb-3'>
            <h3 className='text-sm font-semibold text-slate-800'>
              Responses Per Page
            </h3>
            <p className='text-xs text-slate-400'>
              How many respondents reached each page
            </p>
          </div>
          {pageBarData.length > 0 ? (
            <BarChart data={pageBarData} totalAnswered={0} />
          ) : (
            <div className='flex h-32 items-center justify-center text-sm text-slate-400'>
              No page data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
