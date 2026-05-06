import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Form, FormStatus } from '@/libs/forms/store/types';
import type { ImportPlatform } from '@/libs/forms/hooks/importing';
import { FormCard } from '@/libs/forms/ui/form-card';
import { EmptyState } from '@/libs/forms/ui/empty-state';
import { FormsSearchBar } from '@/libs/forms/ui/forms-search-bar';
import { StatusFilter } from '@/libs/forms/ui/status-filter';
import { ImportFormModal } from '@/libs/forms/ui/import-form-modal';
import { ROUTES } from '@/router/routes';
import { formsEditPath, formsPreviewPath } from '@/router/routes';
import { Plus, Download } from 'lucide-react';

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
  onImport: (platform: ImportPlatform, url: string) => Promise<Form>;
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
  onImport,
}: FormsListViewProps) {
  const navigate = useNavigate();
  const hasFilters = !!searchQuery || statusFilter !== 'all';
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className='mx-auto max-w-screen-2xl px-4 py-8 sm:px-6'>
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
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowImportModal(true)}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50'
          >
            <Download className='h-4 w-4' />
            Import
          </button>
          <button
            onClick={() => navigate(ROUTES.FORMS_NEW)}
            className='flex items-center gap-2 rounded-xl bg-[#0B1AA0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0a179a]'
          >
            <Plus className='h-4 w-4' />
            New Survey
          </button>
        </div>
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

      {showImportModal && (
        <ImportFormModal
          onClose={() => setShowImportModal(false)}
          onImport={onImport}
          onEdit={(id) => {
            setShowImportModal(false);
            navigate(formsEditPath(id));
          }}
          onPreview={(id) => {
            setShowImportModal(false);
            navigate(formsPreviewPath(id));
          }}
        />
      )}
    </div>
  );
}
