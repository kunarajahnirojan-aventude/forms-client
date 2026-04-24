import { Check } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import type { useRenderingEngine } from '@/libs/forms/hooks/use-rendering-engine';
import { QuestionBlock } from '../QuestionBlock';

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
            {/* Show page title only when there are multiple pages */}
            {form.pages.length > 1 && (
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-slate-800'>
                  {page.title}
                </h2>
                {page.description && (
                  <p className='mt-1 text-sm text-slate-500'>
                    {page.description}
                  </p>
                )}
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
