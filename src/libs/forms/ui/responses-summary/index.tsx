import type { Form } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';
import { useResponsesSummary } from '@/libs/forms/hooks/use-responses-summary';
import { OverviewRow } from './overview-row';
import { QuestionSummaryCard } from './question-summary-card';

interface ResponsesSummaryProps {
  form: Form;
  responses: FormResponse[];
}

export function ResponsesSummary({ form, responses }: ResponsesSummaryProps) {
  const { summaries, stats } = useResponsesSummary(form, responses);

  // Group summaries by page
  const byPage = form.pages.map((page) => ({
    page,
    summaries: summaries.filter((s) => s.page.id === page.id),
  }));

  return (
    <div className='flex flex-col gap-8'>
      {/* Form-level overview row */}
      <OverviewRow pages={form.pages} responses={responses} stats={stats} />

      {/* Per-page question cards */}
      {byPage.map(({ page, summaries: pageSummaries }, pageIndex) => {
        if (pageSummaries.length === 0) return null;

        return (
          <div key={page.id} className='flex flex-col gap-4'>
            {/* Page heading */}
            <div className='flex items-center gap-2.5'>
              <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white'>
                {pageIndex + 1}
              </span>
              <h2 className='text-sm font-semibold text-slate-800'>
                {page.title}
              </h2>
              {page.description && (
                <span className='text-xs text-slate-400'>
                  &mdash; {page.description}
                </span>
              )}
            </div>

            {/* Question cards grid */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {pageSummaries.map((summary) => (
                <QuestionSummaryCard
                  key={summary.question.id}
                  summary={summary}
                />
              ))}
            </div>
          </div>
        );
      })}

      {summaries.length === 0 && (
        <div className='flex h-40 flex-col items-center justify-center gap-2 text-center'>
          <p className='text-sm text-slate-400'>No questions to summarize.</p>
        </div>
      )}
    </div>
  );
}
