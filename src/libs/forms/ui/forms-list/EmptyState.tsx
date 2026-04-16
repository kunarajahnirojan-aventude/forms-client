import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { ROUTES } from '@/router/routes';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B1AA0]/10'>
        <FileText className='h-8 w-8 text-[#0B1AA0]' />
      </div>
      <h3 className='mt-4 text-base font-semibold text-slate-800'>
        {hasFilters ? 'No forms match your filters' : 'No forms yet'}
      </h3>
      <p className='mt-1.5 max-w-xs text-sm text-slate-500'>
        {hasFilters
          ? 'Try adjusting your search or status filter.'
          : 'Create your first form and start collecting responses in minutes.'}
      </p>
      {!hasFilters && (
        <button
          onClick={() => navigate(ROUTES.FORMS_NEW)}
          className='mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0B1AA0] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a179a]'
        >
          <Plus className='h-4 w-4' />
          Create a form
        </button>
      )}
    </div>
  );
}
