import type { Question } from '@/libs/forms/store/types';
import { AlertCircle } from 'lucide-react';
import { TextQuestion } from '@/libs/forms/ui/form-editor/question-types/TextQuestion';
import { ChoiceQuestion } from '@/libs/forms/ui/form-editor/question-types/ChoiceQuestion';
import { DateQuestion } from '@/libs/forms/ui/form-editor/question-types/DateQuestion';
import { RatingQuestion } from '@/libs/forms/ui/form-editor/question-types/RatingQuestion';
import { LinearScaleQuestion } from '@/libs/forms/ui/form-editor/question-types/LinearScaleQuestion';
import { FileQuestion } from '@/libs/forms/ui/form-editor/question-types/FileQuestion';
import { YesNoQuestion } from '@/libs/forms/ui/form-editor/question-types/YesNoQuestion';
import { MatrixQuestion } from '@/libs/forms/ui/form-editor/question-types/MatrixQuestion';
import { PhoneQuestion } from '@/libs/forms/ui/form-editor/question-types/PhoneQuestion';

interface QuestionBodyRespondProps {
  question: Question;
  value: unknown;
  onAnswer: (v: unknown) => void;
}

function QuestionBodyRespond({
  question,
  value,
  onAnswer,
}: QuestionBodyRespondProps) {
  const props = { question, value, onAnswer };
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
    case 'yes_no':
      return <YesNoQuestion {...props} />;
    case 'matrix':
      return <MatrixQuestion {...props} />;
    case 'section':
      return null;
    default:
      return null;
  }
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionDivider({ question }: { question: Question }) {
  return (
    <div className='py-4'>
      <h3 className='text-lg font-semibold text-slate-800'>{question.title}</h3>
      {question.description && (
        <p className='mt-1 text-sm text-slate-500'>{question.description}</p>
      )}
      <div className='mt-3 border-b-2 border-[#0B1AA0]/20' />
    </div>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

interface QuestionBlockProps {
  question: Question;
  value: unknown;
  onAnswer: (qId: string, v: unknown) => void;
  /** 0-based index among answerable (non-section) questions, for display numbering */
  index?: number;
  error?: string;
}

export function QuestionBlock({
  question,
  value,
  onAnswer,
  index,
  error,
}: QuestionBlockProps) {
  if (question.type === 'section') {
    return <SectionDivider question={question} />;
  }

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-colors ${
        error ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-white'
      }`}
    >
      {index !== undefined && (
        <span className='mb-1 inline-block text-xs font-semibold text-[#0B1AA0]/50'>
          Q{index + 1}
        </span>
      )}
      <h3 className='text-sm font-semibold text-slate-800'>
        {question.title}
        {question.required && <span className='ml-1 text-red-500'>*</span>}
      </h3>
      {question.description && question.showDescription && (
        <p className='mt-1 text-xs text-slate-500'>{question.description}</p>
      )}
      <QuestionBodyRespond
        question={question}
        value={value}
        onAnswer={(v) => onAnswer(question.id, v)}
      />
      {error && (
        <div className='mt-2.5 flex items-center gap-1.5 text-xs font-medium text-red-500'>
          <AlertCircle className='h-3.5 w-3.5 shrink-0' />
          {error}
        </div>
      )}
    </div>
  );
}
