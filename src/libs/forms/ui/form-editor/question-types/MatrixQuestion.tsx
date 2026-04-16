import { nanoid } from 'nanoid';
import type {
  Question,
  MatrixValidation,
  MatrixRow,
  MatrixColumn,
} from '@/libs/forms/store/types';
import { Plus, X } from 'lucide-react';

interface MatrixQuestionProps {
  question: Question;
  onChange?: (updates: Partial<Question>) => void;
  isPreview?: boolean;
}

export function MatrixQuestion({
  question,
  onChange,
  isPreview,
}: MatrixQuestionProps) {
  const rows: MatrixRow[] = question.rows ?? [];
  const cols: MatrixColumn[] = question.columns ?? [];
  const v = question.validation as MatrixValidation;
  const inputType = v?.multiplePerRow ? 'checkbox' : 'radio';

  function addRow() {
    onChange?.({
      rows: [...rows, { id: nanoid(), label: `Row ${rows.length + 1}` }],
    });
  }
  function addCol() {
    onChange?.({
      columns: [...cols, { id: nanoid(), label: `Col ${cols.length + 1}` }],
    });
  }
  function updateRow(id: string, label: string) {
    onChange?.({ rows: rows.map((r) => (r.id === id ? { ...r, label } : r)) });
  }
  function updateCol(id: string, label: string) {
    onChange?.({
      columns: cols.map((c) => (c.id === id ? { ...c, label } : c)),
    });
  }
  function removeRow(id: string) {
    onChange?.({ rows: rows.filter((r) => r.id !== id) });
  }
  function removeCol(id: string) {
    onChange?.({ columns: cols.filter((c) => c.id !== id) });
  }

  return (
    <div className='mt-3 overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr>
            <th className='w-28 text-left pb-2'></th>
            {cols.map((col) => (
              <th key={col.id} className='pb-2 text-center'>
                {isPreview ? (
                  <span className='text-xs font-medium text-slate-600'>
                    {col.label}
                  </span>
                ) : (
                  <div className='flex items-center gap-1 justify-center'>
                    <input
                      value={col.label}
                      onChange={(e) => updateCol(col.id, e.target.value)}
                      className='w-20 bg-transparent text-center text-xs font-medium text-slate-700 outline-none border-b border-transparent focus:border-[#0B1AA0]'
                    />
                    {cols.length > 1 && (
                      <button
                        onClick={() => removeCol(col.id)}
                        className='text-slate-300 hover:text-red-400'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                )}
              </th>
            ))}
            {!isPreview && (
              <th>
                <button
                  onClick={addCol}
                  className='text-[#0B1AA0] hover:text-[#0a179a]'
                >
                  <Plus className='h-4 w-4' />
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className='border-t border-slate-100'>
              <td className='py-2 pr-3'>
                {isPreview ? (
                  <span className='text-sm text-slate-700'>{row.label}</span>
                ) : (
                  <div className='flex items-center gap-1'>
                    <input
                      value={row.label}
                      onChange={(e) => updateRow(row.id, e.target.value)}
                      className='flex-1 bg-transparent text-sm text-slate-700 outline-none border-b border-transparent focus:border-[#0B1AA0]'
                    />
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className='text-slate-300 hover:text-red-400'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                )}
              </td>
              {cols.map((col) => (
                <td key={col.id} className='py-2 text-center'>
                  <input
                    type={inputType}
                    disabled={!isPreview}
                    name={`matrix-${question.id}-row-${row.id}`}
                    className='h-4 w-4 accent-blue-600'
                    aria-label={`${row.label} - ${col.label}`}
                  />
                </td>
              ))}
              {!isPreview && <td />}
            </tr>
          ))}
        </tbody>
      </table>
      {!isPreview && (
        <button
          onClick={addRow}
          className='mt-2 flex items-center gap-1.5 text-xs font-medium text-[#0B1AA0] hover:text-[#0a179a] transition-colors'
        >
          <Plus className='h-3.5 w-3.5' /> Add row
        </button>
      )}
    </div>
  );
}
