import { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import { TextQuestion } from './question-types/TextQuestion';
import { ChoiceQuestion } from './question-types/ChoiceQuestion';
import { DateQuestion } from './question-types/DateQuestion';
import { RatingQuestion } from './question-types/RatingQuestion';
import { LinearScaleQuestion } from './question-types/LinearScaleQuestion';
import { SectionQuestion } from './question-types/SectionQuestion';
import { FileQuestion } from './question-types/FileQuestion';
import { YesNoQuestion } from './question-types/YesNoQuestion';
import { MatrixQuestion } from './question-types/MatrixQuestion';
import { PhoneQuestion } from './question-types/PhoneQuestion';
import { cn } from '@/utils';
import type { Question } from '@/libs/forms/store/types';

const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-400 to-rose-500',
  pink: 'from-pink-500 to-fuchsia-600',
  slate: 'from-slate-500 to-gray-700',
  custom: 'from-indigo-500 to-purple-600',
};

function PreviewQuestionBody({ question }: { question: Question }) {
  const props = { question, isPreview: true };
  switch (question.type) {
    case 'text':
      return <TextQuestion {...props} />;
    case 'phone':
      return <PhoneQuestion {...props} />;
    case 'radio':
      return <ChoiceQuestion {...props} type='radio' />;
    case 'checkbox':
      return <ChoiceQuestion {...props} type='checkbox' />;
    case 'dropdown':
      return <ChoiceQuestion {...props} type='dropdown' />;
    case 'date':
      return <DateQuestion {...props} />;
    case 'rating':
      return <RatingQuestion {...props} />;
    case 'linear_scale':
      return <LinearScaleQuestion {...props} />;
    case 'file_upload':
      return <FileQuestion {...props} />;
    case 'section':
      return <SectionQuestion question={question} />;
    case 'yes_no':
      return <YesNoQuestion {...props} />;
    case 'matrix':
      return <MatrixQuestion {...props} />;
    default:
      return null;
  }
}

interface PreviewModalProps {
  form: Form;
  onClose: () => void;
}

export function PreviewModal({ form, onClose }: PreviewModalProps) {
  const gradient = GRADIENT_MAP[form.theme.color] ?? GRADIENT_MAP.blue;

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className='fixed inset-0 z-50 flex items-stretch bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative mx-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className={cn('h-36 bg-gradient-to-br', gradient)} />

        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/30'
        >
          <X className='h-4 w-4' />
        </button>

        {/* Preview badge */}
        <div className='absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm'>
          Preview
        </div>

        {/* Form content */}
        <div className='flex-1 px-8 py-8'>
          {/* Title block */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-slate-900'>
              {form.title || 'Untitled form'}
            </h1>
            {form.description && (
              <div
                className='mt-2 text-sm rich-text-content text-slate-500'
                dangerouslySetInnerHTML={{ __html: form.description }}
              />
            )}
          </div>

          {/* Questions */}
          <div className='space-y-6'>
            {form.questions.map((q, idx) => {
              const isSection = q.type === 'section';
              if (isSection) {
                return (
                  <div key={q.id} className='pt-2'>
                    <h2
                      className={cn(
                        'text-base font-semibold',
                        form.theme.darkMode ? 'text-white' : 'text-slate-800',
                      )}
                    >
                      {q.title || `Section ${idx + 1}`}
                    </h2>
                    <SectionQuestion question={q} />
                  </div>
                );
              }
              return (
                <div
                  key={q.id}
                  className={cn(
                    'rounded-xl border p-5',
                    form.theme.darkMode
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-slate-100 bg-white shadow-sm',
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-medium',
                      form.theme.darkMode ? 'text-slate-200' : 'text-slate-800',
                    )}
                  >
                    {q.title || `Question ${idx + 1}`}
                    {q.required && <span className='ml-1 text-red-500'>*</span>}
                  </p>
                  {q.description && (
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        form.theme.darkMode
                          ? 'text-slate-400'
                          : 'text-slate-500',
                      )}
                    >
                      {q.description}
                    </p>
                  )}
                  <PreviewQuestionBody question={q} />
                </div>
              );
            })}
          </div>

          {/* Submit button */}
          <div className='mt-8'>
            <button
              className={cn(
                'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90',
                `bg-gradient-to-r ${gradient}`,
              )}
            >
              Submit <ChevronRight className='h-4 w-4' />
            </button>
            <p className='mt-2 text-xs text-slate-400'>
              Preview only — responses won't be saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
