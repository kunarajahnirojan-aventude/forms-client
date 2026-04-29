import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Table2 } from 'lucide-react';
import { useFormsStore } from '@/store';
import { useResponses } from '@/libs/forms/hooks/use-responses';
import { ResponsesTable } from '@/libs/forms/ui/responses-table';
import { ROUTES } from '@/router/routes';

// ─────────────────────────────────────────────────────────────────────────────
// Inner view – receives a validated form
// ─────────────────────────────────────────────────────────────────────────────

function ResponsesView({ formId }: { formId: string }) {
  const { forms } = useFormsStore();
  const form = forms.find((f) => f.id === formId);

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

  return (
    <div className='flex flex-col gap-6'>
      {/* Page header */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-semibold text-slate-900 flex items-center gap-2'>
          <Table2 className='h-5 w-5 text-slate-400' />
          Responses
        </h1>
        <p className='text-sm text-slate-500'>{form.title}</p>
      </div>

      <ResponsesTable
        form={form}
        columns={columns}
        responses={responses}
        totalCount={totalCount}
        filters={filters}
        onFilter={setFilter}
        onClearFilters={clearFilters}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper with layout chrome
// ─────────────────────────────────────────────────────────────────────────────

export default function FormResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Top bar */}
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-7xl items-center gap-3 px-6 py-3'>
          <button
            onClick={() => navigate(ROUTES.FORMS)}
            className='inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to forms
          </button>
          <span className='text-slate-300'>|</span>
          <span className='text-sm font-medium text-slate-700'>Responses</span>
        </div>
      </div>

      {/* Main content */}
      <div className='mx-auto max-w-7xl px-6 py-8'>
        {id ? (
          <ResponsesView formId={id} />
        ) : (
          <p className='text-slate-500'>No form ID provided.</p>
        )}
      </div>
    </div>
  );
}
