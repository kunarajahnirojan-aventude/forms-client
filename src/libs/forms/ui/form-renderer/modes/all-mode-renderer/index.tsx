import { Check } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import type { useRenderingEngine } from '@/libs/forms/hooks/use-rendering-engine';
import { QuestionBlock } from '../../question-block';

interface AllModeRendererProps {
  form: Form;
  engine: ReturnType<typeof useRenderingEngine>;
  onSubmit: () => void;
}

export function AllModeRenderer({
  form,
  engine,
  onSubmit,
}: AllModeRendererProps) {
  const { answers, setAnswer, errors } = engine;

  let answerableCount = 0;

  return (
    <div>
      <div className='space-y-8'>
        {form.pages.map((page, pageIdx) => (
          <div key={page.id}>
            {/* Show page header only when there are multiple pages and the page has a title or description */}
            {form.pages.length > 1 && (page.title || page.description) && (
              <div className='mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
                <div className='h-1.5 bg-[#0B1AA0]' />
                <div className='px-5 py-4'>
                  {page.title && (
                    <h2 className='text-lg font-semibold text-slate-800'>
                      {page.title}
                    </h2>
                  )}
                  {page.description && (
                    <p
                      className={`text-sm text-slate-500${page.title ? ' mt-1' : ''}`}
                    >
                      {page.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className='space-y-4'>
              {page.questions.map((q) => {
                const idx = q.type !== 'section' ? answerableCount : undefined;
                if (q.type !== 'section') answerableCount++;
                return (
                  <QuestionBlock
                    key={q.id}
                    question={q}
                    value={answers[q.id]}
                    onAnswer={setAnswer}
                    index={idx}
                    error={errors[q.id]}
                  />
                );
              })}
            </div>

            {pageIdx < form.pages.length - 1 && (
              <hr className='mt-6 border-slate-200' />
            )}
          </div>
        ))}
      </div>

      <div className='mt-8 flex justify-end'>
        <button
          onClick={onSubmit}
          className='flex items-center gap-2 rounded-lg bg-[#0B1AA0] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a]'
        >
          Submit
          <Check className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
