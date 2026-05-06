import type { Form } from '@/libs/forms/store/types';
import type { useRenderingEngine } from '@/libs/forms/hooks/use-rendering-engine';
import { QuestionBlock } from '../../question-block';
import { NavigationButtons } from '../../navigation-buttons';
import { ProgressBar } from '../../progress-bar';

interface PageModeRendererProps {
  form: Form;
  engine: ReturnType<typeof useRenderingEngine>;
  onSubmit: () => void;
}

export function PageModeRenderer({
  form,
  engine,
  onSubmit,
}: PageModeRendererProps) {
  const {
    currentPage,
    currentPageIndex,
    answers,
    errors,
    setAnswer,
    canGoBack,
    canGoNext,
    isLast,
    next,
    prev,
  } = engine;

  if (!currentPage) return null;

  // Build sequential numbering for answerable questions on this page
  const questionsBeforeThisPage = form.pages
    .slice(0, currentPageIndex)
    .flatMap((p) => p.questions)
    .filter((q) => q.type !== 'section').length;

  let answerableCount = questionsBeforeThisPage;

  return (
    <div>
      <div className='mb-6'>
        <ProgressBar
          current={currentPageIndex}
          total={form.pages.length}
          label='Section'
        />
      </div>

      {/* Section header card — shown when the page has a title or description */}
      {(currentPage.title || currentPage.description) && (
        <div className='mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
          <div className='h-1.5 bg-[#0B1AA0]' />
          <div className='p-5'>
            {currentPage.title && (
              <h2 className='text-xl font-semibold text-slate-800'>
                {currentPage.title}
              </h2>
            )}
            {currentPage.description && (
              <p
                className={`text-sm text-slate-500${
                  currentPage.title ? ' mt-2' : ''
                }`}
              >
                {currentPage.description}
              </p>
            )}
          </div>
        </div>
      )}

      <div className='space-y-4'>
        {currentPage.questions.map((q) => {
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

      <NavigationButtons
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        isLast={isLast}
        onPrev={prev}
        onNext={next}
        onSubmit={onSubmit}
      />
    </div>
  );
}
