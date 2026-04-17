import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useFormsStore } from '@/store';
import { surveysEditPath } from '@/router/routes';
import { TextQuestion } from '@/libs/forms/ui/form-editor/question-types/TextQuestion';
import { ChoiceQuestion } from '@/libs/forms/ui/form-editor/question-types/ChoiceQuestion';
import { DateQuestion } from '@/libs/forms/ui/form-editor/question-types/DateQuestion';
import { RatingQuestion } from '@/libs/forms/ui/form-editor/question-types/RatingQuestion';
import { LinearScaleQuestion } from '@/libs/forms/ui/form-editor/question-types/LinearScaleQuestion';
import { SectionQuestion } from '@/libs/forms/ui/form-editor/question-types/SectionQuestion';
import { FileQuestion } from '@/libs/forms/ui/form-editor/question-types/FileQuestion';
import { YesNoQuestion } from '@/libs/forms/ui/form-editor/question-types/YesNoQuestion';
import { MatrixQuestion } from '@/libs/forms/ui/form-editor/question-types/MatrixQuestion';
import { PhoneQuestion } from '@/libs/forms/ui/form-editor/question-types/PhoneQuestion';
import type { Question } from '@/libs/forms/store/types';
import { cn } from '@/utils';

const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-[#0B1AA0] to-indigo-700',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-400 to-rose-500',
  pink: 'from-pink-500 to-fuchsia-600',
  slate: 'from-slate-500 to-gray-700',
  custom: 'from-indigo-500 to-purple-600',
};

function QuestionBody({ question }: { question: Question }) {
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

export default function SurveyPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  const survey = forms.find((f) => f.id === id);

  if (!survey) {
    return (
      <div className='flex h-screen items-center justify-center text-slate-400'>
        Survey not found.
      </div>
    );
  }

  const totalPages = survey.pages.length;
  const currentPage = survey.pages[currentPageIdx];
  const gradient = GRADIENT_MAP[survey.theme.color] ?? GRADIENT_MAP.blue;
  const isFirst = currentPageIdx === 0;
  const isLast = currentPageIdx === totalPages - 1;

  return (
    <div className='min-h-screen bg-slate-100'>
      {/* Preview banner */}
      <div className='sticky top-0 z-20 flex items-center justify-between border-b border-amber-200 bg-amber-50 px-4 py-2'>
        <button
          onClick={() => navigate(surveysEditPath(id!))}
          className='flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to editor
        </button>
        <span className='rounded-full bg-amber-200 px-3 py-0.5 text-xs font-semibold text-amber-800'>
          Preview Mode
        </span>
        <button
          onClick={() => window.close()}
          className='rounded p-1 text-amber-600 hover:bg-amber-100'
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      {/* Hero banner */}
      <div className={cn('h-32 bg-gradient-to-br', gradient)} />

      {/* Content */}
      <div className='mx-auto -mt-6 max-w-2xl px-4 pb-16'>
        <div className='overflow-hidden rounded-2xl bg-white shadow-xl'>
          {/* Survey title (first page) */}
          {isFirst && (
            <div className='border-b border-slate-100 px-8 py-6'>
              <h1 className='text-2xl font-bold text-slate-900'>
                {survey.title || 'Untitled Survey'}
              </h1>
              {survey.description && (
                <div
                  className='rich-text-content mt-2 text-sm text-slate-500'
                  dangerouslySetInnerHTML={{ __html: survey.description }}
                />
              )}
            </div>
          )}

          {/* Page header */}
          <div className='border-b border-slate-100 bg-slate-50/60 px-8 py-4'>
            {/* Progress bar */}
            <div className='mb-3 flex items-center gap-2'>
              <div className='h-1.5 flex-1 rounded-full bg-slate-200'>
                <div
                  className='h-1.5 rounded-full bg-[#0B1AA0] transition-all duration-500'
                  style={{
                    width: `${((currentPageIdx + 1) / totalPages) * 100}%`,
                  }}
                />
              </div>
              <span className='shrink-0 text-xs text-slate-400'>
                {currentPageIdx + 1} / {totalPages}
              </span>
            </div>

            <h2 className='text-base font-semibold text-slate-800'>
              {currentPage.title}
            </h2>
            {currentPage.description && (
              <p className='mt-0.5 text-sm text-slate-500'>
                {currentPage.description}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className='px-8 py-6'>
            {currentPage.questions.length === 0 ? (
              <p className='py-8 text-center text-sm text-slate-400'>
                No questions on this page yet.
              </p>
            ) : (
              <div className='space-y-8'>
                {currentPage.questions.map((q, idx) => {
                  const isSection = q.type === 'section';
                  if (isSection) {
                    return (
                      <div key={q.id} className='pt-2'>
                        <QuestionBody question={q} />
                      </div>
                    );
                  }
                  return (
                    <div key={q.id} className='space-y-2'>
                      <div className='flex items-start gap-2'>
                        <span className='mt-0.5 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500'>
                          {idx + 1}
                        </span>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-slate-800'>
                            {q.title || 'Untitled question'}
                            {q.required && (
                              <span className='ml-1 text-red-500'>*</span>
                            )}
                          </p>
                          {q.description && q.showDescription && (
                            <p className='mt-0.5 text-xs text-slate-500'>
                              {q.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='pl-8'>
                        <QuestionBody question={q} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Page navigation */}
          <div className='flex items-center justify-between border-t border-slate-100 px-8 py-5'>
            <button
              onClick={() => setCurrentPageIdx((i) => i - 1)}
              disabled={isFirst}
              className='flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </button>

            {isLast ? (
              <button className='rounded-xl bg-[#0B1AA0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0a179a]'>
                Submit Survey
              </button>
            ) : (
              <button
                onClick={() => setCurrentPageIdx((i) => i + 1)}
                className='flex items-center gap-1.5 rounded-xl bg-[#0B1AA0] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a]'
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
