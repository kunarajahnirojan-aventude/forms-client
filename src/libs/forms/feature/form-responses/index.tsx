import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, BarChart2, TableIcon } from 'lucide-react';
import { useFormsStore } from '@/store';
import { useResponses } from '@/libs/forms/hooks/use-responses';
import { ResponsesTable } from '@/libs/forms/ui/responses-table';
import { ResponsesSummary } from '@/libs/forms/ui/responses-summary';
import { ROUTES } from '@/router/routes';
import { cn } from '@/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Inner view – receives a validated form
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'table' | 'summary';

function ResponsesView({ formId }: { formId: string }) {
  const { forms } = useFormsStore();
  const form = forms.find((f) => f.id === formId);
  const [activeTab, setActiveTab] = useState<TabId>('table');

  if (!form) {
    return (
      <div className='flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
        <p className='text-slate-500'>Form not found.</p>
        <Link
          to={ROUTES.FORMS}
          className='text-sm text-blue-600 hover:underline'
        >
          Back to forms
        </Link>
      </div>
    );
  }

  const { columns, responses, totalCount, filters, setFilter, clearFilters } =
    useResponses(form);

  // All (unfiltered) responses for summary visualizations
  const allResponses = responses;

  return (
    <div className='flex flex-col gap-5'>
      {/* Tab switcher */}
      <div className='flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit'>
        <button
          onClick={() => setActiveTab('table')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'table'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
          )}
        >
          <TableIcon className='h-4 w-4' />
          Responses
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'summary'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
          )}
        >
          <BarChart2 className='h-4 w-4' />
          Summary
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'table' ? (
        <ResponsesTable
          form={form}
          columns={columns}
          responses={responses}
          totalCount={totalCount}
          filters={filters}
          onFilter={setFilter}
          onClearFilters={clearFilters}
        />
      ) : (
        <ResponsesSummary form={form} responses={allResponses} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper with layout chrome
// ─────────────────────────────────────────────────────────────────────────────

export default function FormResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();
  const form = id ? forms.find((f) => f.id === id) : undefined;

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Top bar */}
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-screen-2xl items-center gap-2 px-6 py-3'>
          <button
            onClick={() => navigate(ROUTES.FORMS)}
            className='inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to forms
          </button>
          <ChevronRight className='h-4 w-4 shrink-0 text-slate-300' />
          {form && (
            <>
              <span className='max-w-56 truncate text-sm text-slate-500'>
                {form.title}
              </span>
              <ChevronRight className='h-4 w-4 shrink-0 text-slate-300' />
            </>
          )}
          <span className='text-sm font-semibold text-slate-800'>
            Responses
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className='mx-auto max-w-screen-2xl px-6 py-8'>
        {id ? (
          <ResponsesView formId={id} />
        ) : (
          <p className='text-slate-500'>No form ID provided.</p>
        )}
      </div>
    </div>
  );
}
