import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SurveyPage } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface PagesSidebarProps {
  pages: SurveyPage[];
  activePageId: string | null;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: (id: string) => void;
  onUpdatePage: (id: string, patch: Partial<SurveyPage>) => void;
}

export function PagesSidebar({
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onUpdatePage,
}: PagesSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  function startEdit(page: SurveyPage) {
    setEditingId(page.id);
    setEditValue(page.title);
  }

  function commitEdit(id: string) {
    const trimmed = editValue.trim();
    if (trimmed) onUpdatePage(id, { title: trimmed });
    setEditingId(null);
  }

  return (
    <div className='flex w-52 shrink-0 flex-col border-r border-slate-200 bg-slate-50'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
        <span className='text-[11px] font-bold uppercase tracking-widest text-slate-400'>
          Pages
        </span>
        <span className='rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500'>
          {pages.length}
        </span>
      </div>

      {/* Pages list */}
      <div className='flex-1 overflow-y-auto py-1.5'>
        {pages.map((page, idx) => {
          const isActive = page.id === activePageId;
          const isEditing = editingId === page.id;

          return (
            <div
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className={cn(
                'group relative mx-2 my-0.5 cursor-pointer rounded-xl px-3 py-2.5 transition-all',
                isActive
                  ? 'bg-[#0B1AA0]/8 ring-1 ring-[#0B1AA0]/20'
                  : 'hover:bg-white hover:shadow-sm',
              )}
            >
              <div className='flex items-start gap-2'>
                {/* Drag handle (visual only) */}
                <GripVertical className='mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300 opacity-0 group-hover:opacity-100' />

                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-1'>
                    <span
                      className={cn(
                        'shrink-0 rounded px-1 py-0.5 text-[10px] font-bold',
                        isActive
                          ? 'bg-[#0B1AA0] text-white'
                          : 'bg-slate-200 text-slate-500',
                      )}
                    >
                      {idx + 1}
                    </span>

                    {isEditing ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(page.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit(page.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className='w-full rounded border border-[#0B1AA0]/40 bg-white px-1 py-0.5 text-xs font-medium text-slate-800 outline-none'
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEdit(page);
                        }}
                        className={cn(
                          'truncate text-xs font-medium',
                          isActive ? 'text-[#0B1AA0]' : 'text-slate-700',
                        )}
                      >
                        {page.title}
                      </span>
                    )}
                  </div>

                  <p className='mt-0.5 pl-5 text-[10px] text-slate-400'>
                    {page.questions.length}{' '}
                    {page.questions.length === 1 ? 'question' : 'questions'}
                  </p>
                </div>

                {/* Delete button */}
                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                    }}
                    className='mt-0.5 shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100'
                    title='Delete page'
                  >
                    <Trash2 className='h-3 w-3' />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add page button */}
      <div className='border-t border-slate-200 p-3'>
        <button
          onClick={onAddPage}
          className='flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-[#0B1AA0]/40 hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0]'
        >
          <Plus className='h-3.5 w-3.5' />
          Add page
        </button>
      </div>
    </div>
  );
}
