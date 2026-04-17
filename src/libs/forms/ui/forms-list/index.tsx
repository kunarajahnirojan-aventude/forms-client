import { useNavigate } from 'react-router-dom';
import type { Form, FormStatus } from '@/libs/forms/store/types';
import { FormCard } from './FormCard';
import { EmptyState } from './EmptyState';
import { FormsSearchBar } from './FormsSearchBar';
import { StatusFilter } from './StatusFilter';
import { ROUTES } from '@/router/routes';
import { Plus } from 'lucide-react';

interface FormsListViewProps {
  forms: Form[];
  searchQuery: string;
  statusFilter: FormStatus | 'all';
  onSearchChange: (q: string) => void;
  onStatusFilterChange: (s: FormStatus | 'all') => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onStatusChange: (id: string, status: FormStatus) => void;
  onCopyLink: (shareToken: string) => void;
}

export function FormsListView({
  forms,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onDelete,
  onDuplicate,
  onStatusChange,
  onCopyLink,
}: FormsListViewProps) {
  const navigate = useNavigate();
  const hasFilters = !!searchQuery || statusFilter !== 'all';

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      {/* Page header */}
      <div className='mb-8 flex items-end justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            My Surveys
          </h1>
          <p className='mt-1 text-sm text-slate-500'>
            Create, manage and share your surveys.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.SURVEYS_NEW)}
          className='flex items-center gap-2 rounded-xl bg-[#0B1AA0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0a179a]'
        >
          <Plus className='h-4 w-4' />
          New Survey
        </button>
      </div>

      {/* Big search */}
      <div className='mb-5'>
        <FormsSearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Filter bar */}
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
        <span className='ml-auto hidden text-sm text-slate-500 sm:block'>
          {forms.length} {forms.length === 1 ? 'survey' : 'surveys'}
        </span>
      </div>

      {/* Grid */}
      {forms.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onStatusChange={onStatusChange}
              onCopyLink={onCopyLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}
