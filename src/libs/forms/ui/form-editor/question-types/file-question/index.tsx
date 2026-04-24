import { Upload } from 'lucide-react';
import type { Question, FileValidation } from '@/libs/forms/store/types';

interface FileQuestionProps {
  question: Question;
  isPreview?: boolean;
  value?: unknown;
  onAnswer?: (v: unknown) => void;
}

export function FileQuestion({
  question,
  isPreview,
  value,
  onAnswer,
}: FileQuestionProps) {
  const v = question.validation as FileValidation;
  const isRespond = value !== undefined || !!onAnswer;
  const fileNames = Array.isArray(value) ? (value as string[]) : [];

  if (isRespond) {
    return (
      <div className='mt-3'>
        <label className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0B1AA0]/30 bg-[#0B1AA0]/5 py-8 text-center transition-colors hover:border-[#0B1AA0]/50 hover:bg-[#0B1AA0]/10'>
          <input
            type='file'
            className='hidden'
            multiple={(v?.maxFiles ?? 1) > 1}
            accept={v?.allowedTypes?.join(',') || undefined}
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              onAnswer?.(names);
            }}
          />
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1AA0]/10'>
            <Upload className='h-5 w-5 text-[#0B1AA0]' />
          </div>
          <div>
            <p className='text-sm font-medium text-[#0B1AA0]'>
              Click to upload
            </p>
            <p className='mt-0.5 text-xs text-slate-400'>
              Max {v?.maxSizeMb ?? 10} MB
              {v?.maxFiles && v.maxFiles > 1
                ? `, up to ${v.maxFiles} files`
                : ''}
            </p>
          </div>
          {fileNames.length > 0 && (
            <ul className='mt-1 text-xs text-slate-600'>
              {fileNames.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          )}
        </label>
      </div>
    );
  }

  return (
    <div className='mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100'>
        <Upload className='h-5 w-5 text-slate-400' />
      </div>
      <div>
        <p className='text-sm font-medium text-slate-600'>
          {isPreview ? 'Click to upload' : 'File upload area'}
        </p>
        <p className='mt-0.5 text-xs text-slate-400'>
          Max {v?.maxSizeMb ?? 10} MB
          {v?.maxFiles && v.maxFiles > 1 ? `, up to ${v.maxFiles} files` : ''}
          {v?.allowedTypes?.length ? ` · ${v.allowedTypes.join(', ')}` : ''}
        </p>
      </div>
    </div>
  );
}
