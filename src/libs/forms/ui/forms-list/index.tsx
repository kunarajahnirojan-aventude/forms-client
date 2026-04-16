import type { Form, FormStatus } from '@/libs/forms/store/types';
import { FormCard } from './FormCard';
import { EmptyState } from './EmptyState';
import { FormsSearchBar } from './FormsSearchBar';
import { StatusFilter } from './StatusFilter';

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
  const hasFilters = !!searchQuery || statusFilter !== 'all';

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      {/* Page header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          My Forms
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          Create, manage and share your forms.
        </p>
      </div>

      {/* Filter bar */}
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <FormsSearchBar
          value={searchQuery}
          onChange={onSearchChange}
          className='sm:max-w-sm'
        />
        <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
        <span className='ml-auto hidden text-sm text-slate-500 sm:block'>
          {forms.length} {forms.length === 1 ? 'form' : 'forms'}
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
