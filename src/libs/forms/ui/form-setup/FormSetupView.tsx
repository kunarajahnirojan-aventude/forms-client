import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, FileText } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ROUTES } from '@/router/routes';

interface FormSetupViewProps {
  onSubmit: (title: string, description: string) => void;
}

export function FormSetupView({ onSubmit }: FormSetupViewProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description);
  }

  return (
    <div className='flex min-h-[calc(100vh-3.5rem)] flex-col bg-slate-50'>
      {/* Top bar */}
      <div className='flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 shadow-sm'>
        <button
          type='button'
          onClick={() => navigate(ROUTES.SURVEYS)}
          className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Forms
        </button>

        <div className='flex items-center gap-2'>
          <span className='flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1AA0] text-[10px] font-bold text-white'>
            1
          </span>
          <span className='text-xs text-slate-400'>Step 1 of 2</span>
          <span className='mx-1 text-slate-200'>·</span>
          <span className='text-xs text-slate-300'>Step 2: Add questions</span>
        </div>
      </div>

      {/* Main content */}
      <div className='flex flex-1 items-start justify-center px-4 py-16'>
        <div className='w-full max-w-2xl'>
          {/* Icon + heading */}
          <div className='mb-10 text-center'>
            <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B1AA0]/10 ring-4 ring-[#0B1AA0]/5'>
              <FileText className='h-8 w-8 text-[#0B1AA0]' />
            </div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
              Let's start with the basics
            </h1>
            <p className='mt-2.5 text-sm text-slate-500'>
              Give your survey a name and an optional description.
              <br />
              You can always update these later.
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-7'
          >
            {/* Title */}
            <div>
              <label
                htmlFor='form-title'
                className='mb-2 block text-sm font-semibold text-slate-700'
              >
                Survey title <span className='text-red-400'>*</span>
              </label>
              <input
                id='form-title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g. Passport Filling Survey'
                autoFocus
                className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 transition-all focus:border-[#0B1AA0] focus:ring-2 focus:ring-[#0B1AA0]/15'
              />
            </div>

            {/* Description */}
            <div>
              <label className='mb-2 block text-sm font-semibold text-slate-700'>
                Description{' '}
                <span className='text-xs font-normal text-slate-400'>
                  — optional
                </span>
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder='Describe what this survey is about, who should fill it out, any instructions…'
                minHeight='9rem'
              />
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between pt-1'>
              <p className='text-xs text-slate-400'>
                <span className='text-red-400'>*</span> Required
              </p>
              <button
                type='submit'
                disabled={!title.trim()}
                className='flex items-center gap-2 rounded-xl bg-[#0B1AA0] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a179a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'
              >
                Continue to questions
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
