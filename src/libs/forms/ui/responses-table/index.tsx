import { useMemo, useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { Form, FormPage, Question } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';
import { cn } from '@/utils';

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Cell value formatter
// ─────────────────────────────────────────────────────────────────────────────

function formatCellValue(q: Question, answer: unknown): string {
  if (answer === undefined || answer === null || answer === '') return '—';

  switch (q.type) {
    case 'checkbox':
      return Array.isArray(answer) ? answer.join(', ') : String(answer);

    case 'file_upload':
      return Array.isArray(answer) ? answer.join(', ') : String(answer);

    case 'matrix': {
      if (typeof answer !== 'object' || !answer) return '—';
      const rows = q.rows ?? [];
      const parts = rows.map((row) => {
        const val = (answer as Record<string, unknown>)[row.id];
        if (val === undefined || val === null) return null;
        return `${row.label}: ${Array.isArray(val) ? val.join(', ') : String(val)}`;
      });
      return parts.filter(Boolean).join(' | ') || '—';
    }

    case 'yes_no':
      return answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : String(answer);

    case 'rating':
    case 'linear_scale':
      return String(answer);

    default:
      return String(answer);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Filterable question types
// ─────────────────────────────────────────────────────────────────────────────

const FILTERABLE_TYPES = new Set(['dropdown', 'radio', 'checkbox', 'yes_no']);

function getFilterOptions(q: Question): string[] {
  if (q.type === 'yes_no') return ['Yes', 'No'];
  return (q.options ?? []).map((o) => o.label);
}

// ─────────────────────────────────────────────────────────────────────────────
// Column header with optional dropdown filter
// ─────────────────────────────────────────────────────────────────────────────

interface ColumnHeaderProps {
  question: Question;
  filterValue: string;
  onFilter: (value: string) => void;
  rowSpan?: number;
}

function ColumnHeader({
  question,
  filterValue,
  onFilter,
  rowSpan,
}: ColumnHeaderProps) {
  const isFilterable = FILTERABLE_TYPES.has(question.type);
  const options = useMemo(() => getFilterOptions(question), [question]);

  if (!isFilterable) {
    return (
      <th
        rowSpan={rowSpan}
        className='whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-700 max-w-50 align-top'
      >
        <span className='line-clamp-2 leading-tight'>{question.title}</span>
      </th>
    );
  }

  return (
    <th
      rowSpan={rowSpan}
      className='whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-700 max-w-55 align-top'
    >
      <div className='flex flex-col gap-1.5'>
        <span className='line-clamp-2 leading-tight'>{question.title}</span>
        <div className='relative'>
          <select
            value={filterValue}
            onChange={(e) => onFilter(e.target.value)}
            className={cn(
              'w-full appearance-none rounded-md border py-1 pl-2 pr-7 text-xs font-normal',
              'bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
              filterValue
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-500',
            )}
          >
            <option value=''>All</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2',
              filterValue ? 'text-blue-500' : 'text-slate-400',
            )}
          />
        </div>
      </div>
    </th>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single-page table (with pagination + column visibility)
// ─────────────────────────────────────────────────────────────────────────────

interface PageTableProps {
  page: FormPage;
  pageIndex: number;
  responses: FormResponse[];
  filters: Record<string, string>;
  onFilter: (questionId: string, value: string) => void;
}

function PageTable({
  page,
  pageIndex,
  responses,
  filters,
  onFilter,
}: PageTableProps) {
  const allColumns = useMemo(
    () => page.questions.filter((q) => q.type !== 'section'),
    [page.questions],
  );

  // ── Column visibility ──────────────────────────────────────────────────────
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [colPickerOpen, setColPickerOpen] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        colPickerRef.current &&
        !colPickerRef.current.contains(e.target as Node)
      ) {
        setColPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggleCol(id: string) {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const visibleColumns = useMemo(
    () => allColumns.filter((q) => !hiddenCols.has(q.id)),
    [allColumns, hiddenCols],
  );

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to first page whenever filter changes the response list
  useEffect(() => {
    setCurrentPage(0);
  }, [responses.length]);

  const totalPages = Math.max(1, Math.ceil(responses.length / rowsPerPage));
  const rowOffset = currentPage * rowsPerPage;
  const pagedResponses = responses.slice(rowOffset, rowOffset + rowsPerPage);

  // ── Expanded columns ───────────────────────────────────────────────────────
  // Grouped view (for thead): matrix stays as one entry with its rows
  type GroupedCol =
    | { type: 'regular'; question: Question }
    | {
        type: 'matrix';
        question: Question;
        matrixRows: (typeof allColumns)[0]['rows'];
      };

  const groupedColumns = useMemo<GroupedCol[]>(
    () =>
      visibleColumns.map<GroupedCol>((q) =>
        q.type === 'matrix'
          ? { type: 'matrix', question: q, matrixRows: q.rows ?? [] }
          : { type: 'regular', question: q },
      ),
    [visibleColumns],
  );

  // Flat view (for tbody): matrix expands to one entry per row
  type FlatCol =
    | { type: 'regular'; question: Question }
    | {
        type: 'matrix-cell';
        question: Question;
        row: NonNullable<Question['rows']>[0];
      };

  const flatColumns = useMemo<FlatCol[]>(
    () =>
      visibleColumns.flatMap<FlatCol>((q) =>
        q.type === 'matrix'
          ? (q.rows ?? []).map((row) => ({
              type: 'matrix-cell' as const,
              question: q,
              row,
            }))
          : [{ type: 'regular' as const, question: q }],
      ),
    [visibleColumns],
  );

  const hasMatrix = groupedColumns.some((c) => c.type === 'matrix');

  if (allColumns.length === 0) return null;

  return (
    <div className='flex flex-col gap-3'>
      {/* Page heading + column picker */}
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600'>
            {pageIndex + 1}
          </span>
          <h2 className='text-sm font-semibold text-slate-800'>{page.title}</h2>
          {page.description && (
            <span className='text-xs text-slate-400'>
              &mdash; {page.description}
            </span>
          )}
        </div>

        {/* Column visibility picker */}
        <div className='relative' ref={colPickerRef}>
          <button
            onClick={() => setColPickerOpen((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors',
              colPickerOpen || hiddenCols.size > 0
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            <SlidersHorizontal className='h-3.5 w-3.5' />
            Columns
            {hiddenCols.size > 0 && (
              <span className='rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none'>
                {hiddenCols.size} hidden
              </span>
            )}
          </button>

          {colPickerOpen && (
            <div className='absolute right-0 z-30 mt-1 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-lg'>
              <div className='flex items-center justify-between border-b border-slate-100 px-3 pb-2 mb-1'>
                <span className='text-xs font-semibold text-slate-700'>
                  Toggle columns
                </span>
                {hiddenCols.size > 0 && (
                  <button
                    onClick={() => setHiddenCols(new Set())}
                    className='text-xs text-blue-600 hover:underline'
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className='max-h-60 overflow-y-auto'>
                {allColumns.map((q) => (
                  <label
                    key={q.id}
                    className='flex cursor-pointer items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50'
                  >
                    <input
                      type='checkbox'
                      checked={!hiddenCols.has(q.id)}
                      onChange={() => toggleCol(q.id)}
                      className='h-3.5 w-3.5 rounded border-slate-300 accent-blue-600'
                    />
                    <span className='line-clamp-2 text-xs text-slate-700'>
                      {q.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm'>
        <table className='w-full border-collapse text-left'>
          <thead>
            {/* Row 1: question titles. Matrix gets colspan; regular columns rowspan=2 when matrix exists */}
            <tr className='border-b border-slate-200 bg-slate-50'>
              <th
                rowSpan={hasMatrix ? 2 : 1}
                className='w-10 px-4 py-3 text-xs font-semibold text-slate-400 align-middle'
              >
                #
              </th>
              <th
                rowSpan={hasMatrix ? 2 : 1}
                className='whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-700 align-middle'
              >
                Submitted
              </th>
              {groupedColumns.map((col) =>
                col.type === 'matrix' ? (
                  <th
                    key={col.question.id}
                    colSpan={col.matrixRows?.length ?? 1}
                    className='border-b border-slate-200 px-4 py-2 text-center text-xs font-semibold text-slate-700'
                  >
                    {col.question.title}
                  </th>
                ) : (
                  <ColumnHeader
                    key={col.question.id}
                    question={col.question}
                    filterValue={filters[col.question.id] ?? ''}
                    onFilter={(v) => onFilter(col.question.id, v)}
                    rowSpan={hasMatrix ? 2 : 1}
                  />
                ),
              )}
            </tr>
            {/* Row 2: matrix row labels (only rendered when at least one matrix column is visible) */}
            {hasMatrix && (
              <tr className='border-b border-slate-200 bg-slate-50'>
                {groupedColumns.map((col) =>
                  col.type === 'matrix'
                    ? (col.matrixRows ?? []).map((row) => (
                        <th
                          key={row.id}
                          className='whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-slate-500 max-w-40'
                        >
                          {row.label}
                        </th>
                      ))
                    : null,
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {pagedResponses.length === 0 ? (
              <tr>
                <td
                  colSpan={flatColumns.length + 2}
                  className='px-4 py-12 text-center text-sm text-slate-400'
                >
                  No responses match the current filters.
                </td>
              </tr>
            ) : (
              pagedResponses.map((response, idx) => (
                <tr
                  key={response.id}
                  className={cn(
                    'border-b border-slate-100 transition-colors hover:bg-slate-50',
                    idx % 2 === 1 && 'bg-slate-50/40',
                  )}
                >
                  <td className='px-4 py-3 text-xs text-slate-400'>
                    {rowOffset + idx + 1}
                  </td>
                  <td className='whitespace-nowrap px-4 py-3 text-sm text-slate-500'>
                    {new Date(response.submittedAt).toLocaleDateString(
                      undefined,
                      { month: 'short', day: 'numeric', year: 'numeric' },
                    )}
                  </td>
                  {flatColumns.map((col) => {
                    if (col.type === 'matrix-cell') {
                      const answerMap = (
                        typeof response.answers[col.question.id] === 'object' &&
                        response.answers[col.question.id]
                          ? response.answers[col.question.id]
                          : {}
                      ) as Record<string, unknown>;
                      const val = answerMap[col.row.id];
                      const text =
                        val === undefined || val === null
                          ? '—'
                          : Array.isArray(val)
                            ? val.join(', ')
                            : String(val);
                      return (
                        <td
                          key={`${col.question.id}-${col.row.id}`}
                          className='px-4 py-3 text-sm text-slate-700 max-w-40'
                        >
                          <span className='line-clamp-2'>{text}</span>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.question.id}
                        className='px-4 py-3 text-sm text-slate-700 max-w-50'
                      >
                        <span className='line-clamp-2'>
                          {formatCellValue(
                            col.question,
                            response.answers[col.question.id],
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {responses.length > 0 && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-xs text-slate-500'>
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(0);
              }}
              className='rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-3 text-xs text-slate-600'>
            <span>
              {rowOffset + 1}–
              {Math.min(rowOffset + rowsPerPage, responses.length)} of{' '}
              {responses.length}
            </span>
            <div className='flex items-center gap-1'>
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors'
              >
                <ChevronLeft className='h-4 w-4' />
              </button>
              <span className='px-2 font-medium text-slate-700'>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors'
              >
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ResponsesTable component
// ─────────────────────────────────────────────────────────────────────────────

export interface ResponsesTableProps {
  form: Form;
  columns: Question[];
  responses: FormResponse[];
  totalCount: number;
  filters: Record<string, string>;
  onFilter: (questionId: string, value: string) => void;
  onClearFilters: () => void;
}

export function ResponsesTable({
  form,
  responses,
  totalCount,
  filters,
  onFilter,
  onClearFilters,
}: ResponsesTableProps) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className='flex flex-col gap-8'>
      {/* Toolbar */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-slate-500'>
          Showing{' '}
          <span className='font-medium text-slate-800'>{responses.length}</span>{' '}
          of <span className='font-medium text-slate-800'>{totalCount}</span>{' '}
          {totalCount === 1 ? 'response' : 'responses'}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className='inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors'
          >
            <X className='h-3 w-3' />
            Clear {activeFilterCount}{' '}
            {activeFilterCount === 1 ? 'filter' : 'filters'}
          </button>
        )}
      </div>

      {/* One table per page */}
      {form.pages.map((page, pageIndex) => (
        <PageTable
          key={page.id}
          page={page}
          pageIndex={pageIndex}
          responses={responses}
          filters={filters}
          onFilter={onFilter}
        />
      ))}

      <p className='text-xs text-slate-400 text-right'>
        {form.title} &mdash; {form.pages.length}{' '}
        {form.pages.length === 1 ? 'page' : 'pages'}
      </p>
    </div>
  );
}
