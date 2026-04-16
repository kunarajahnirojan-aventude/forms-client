import { Upload } from 'lucide-react';
import type { Question, FileValidation } from '@/libs/forms/store/types';

interface FileQuestionProps {
  question: Question;
  isPreview?: boolean;
}

export function FileQuestion({ question, isPreview }: FileQuestionProps) {
  const v = question.validation as FileValidation;

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
