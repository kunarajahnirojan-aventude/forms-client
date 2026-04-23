import type { Form } from '@/libs/forms/store/types';
import type { useRenderingEngine } from '@/libs/forms/feature/rendering-engine/hooks/useRenderingEngine';
import { QuestionBlock } from '../QuestionBlock';
import { NavigationButtons } from '../NavigationButtons';
import { ProgressBar } from '../ProgressBar';

interface QuestionModeRendererProps {
  form: Form;
  engine: ReturnType<typeof useRenderingEngine>;
  onSubmit: () => void;
}

export function QuestionModeRenderer({
  form: _form,
  engine,
  onSubmit,
}: QuestionModeRendererProps) {
  const {
    currentQuestion,
    currentQuestionIndex,
    allQuestions,
    currentAnswerableIndex,
    answers,
    setAnswer,
    canGoBack,
    canGoNext,
    isLast,
    next,
    prev,
  } = engine;

  if (!currentQuestion) return null;

  return (
    <div>
      <div className='mb-6'>
        <ProgressBar
          current={currentQuestionIndex}
          total={allQuestions.length}
          label='Question'
        />
      </div>

      <QuestionBlock
        question={currentQuestion}
        value={answers[currentQuestion.id]}
        onAnswer={setAnswer}
        index={currentAnswerableIndex >= 0 ? currentAnswerableIndex : undefined}
      />

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
