import type { Form } from '@/libs/forms/store/types';
import type { useRenderingEngine } from '@/libs/forms/hooks/use-rendering-engine';
import { QuestionBlock } from '../QuestionBlock';
import { NavigationButtons } from '../NavigationButtons';
import { ProgressBar } from '../ProgressBar';

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
          label='Page'
        />
      </div>

      {currentPage.title && (
        <h2 className='mb-2 text-xl font-semibold text-slate-800'>
          {currentPage.title}
        </h2>
      )}
      {currentPage.description && (
        <p className='mb-6 text-sm text-slate-500'>{currentPage.description}</p>
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
