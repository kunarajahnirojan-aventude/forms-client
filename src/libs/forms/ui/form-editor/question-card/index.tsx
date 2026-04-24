import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Type,
  CheckSquare,
  Circle,
  ChevronDownSquare,
  Calendar,
  Star,
  BarChart2,
  Upload,
  Minus,
  ToggleLeft,
  Phone,
  Grid3x3,
  Settings2,
} from 'lucide-react';
import type { Question, QuestionType } from '@/libs/forms/store/types';
import { cn } from '@/utils';
import { TextQuestion } from '../question-types/text-question';
import { ChoiceQuestion } from '../question-types/choice-question';
import { DateQuestion } from '../question-types/date-question';
import { RatingQuestion } from '../question-types/rating-question';
import { LinearScaleQuestion } from '../question-types/linear-scale-question';
import { SectionQuestion } from '../question-types/section-question';
import { FileQuestion } from '../question-types/file-question';
import { YesNoQuestion } from '../question-types/yes-no-question';
import { MatrixQuestion } from '../question-types/matrix-question';
import { PhoneQuestion } from '../question-types/phone-question';
import { TextValidationPanel } from '../validation-panels/text-validation-panel';
import { ChoiceValidationPanel } from '../validation-panels/choice-validation-panel';
import { DateValidationPanel } from '../validation-panels/date-validation-panel';
import { FileValidationPanel } from '../validation-panels/file-validation-panel';
import {
  RatingValidationPanel,
  LinearScaleValidationPanel,
} from '../validation-panels/scale-validation-panel';
import { Toggle } from '../validation-panels/text-validation-panel';

const TYPE_META: Record<
  QuestionType,
  { icon: React.ElementType; label: string; color: string }
> = {
  text: { icon: Type, label: 'Text', color: 'bg-[#0B1AA0]/10 text-[#0B1AA0]' },
  radio: {
    icon: Circle,
    label: 'Multiple choice',
    color: 'bg-purple-100 text-purple-600',
  },
  checkbox: {
    icon: CheckSquare,
    label: 'Checkboxes',
    color: 'bg-indigo-100 text-indigo-600',
  },
  dropdown: {
    icon: ChevronDownSquare,
    label: 'Dropdown',
    color: 'bg-cyan-100 text-cyan-600',
  },
  date: {
    icon: Calendar,
    label: 'Date',
    color: 'bg-orange-100 text-orange-600',
  },
  rating: {
    icon: Star,
    label: 'Rating',
    color: 'bg-yellow-100 text-yellow-600',
  },
  linear_scale: {
    icon: BarChart2,
    label: 'Linear scale',
    color: 'bg-teal-100 text-teal-600',
  },
  file_upload: {
    icon: Upload,
    label: 'File upload',
    color: 'bg-rose-100 text-rose-600',
  },
  section: {
    icon: Minus,
    label: 'Section',
    color: 'bg-slate-100 text-slate-600',
  },
  yes_no: {
    icon: ToggleLeft,
    label: 'Yes / No',
    color: 'bg-green-100 text-green-600',
  },
  phone: { icon: Phone, label: 'Phone', color: 'bg-sky-100 text-sky-600' },
  matrix: {
    icon: Grid3x3,
    label: 'Matrix',
    color: 'bg-violet-100 text-violet-600',
  },
};

interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function ValidationPanel({
  question,
  onChange,
}: {
  question: Question;
  onChange: (p: Partial<Question>) => void;
}) {
  switch (question.type) {
    case 'text':
      return <TextValidationPanel question={question} onChange={onChange} />;
    case 'radio':
    case 'checkbox':
    case 'dropdown':
      return <ChoiceValidationPanel question={question} onChange={onChange} />;
    case 'date':
      return <DateValidationPanel question={question} onChange={onChange} />;
    case 'file_upload':
      return <FileValidationPanel question={question} onChange={onChange} />;
    case 'rating':
      return <RatingValidationPanel question={question} onChange={onChange} />;
    case 'linear_scale':
      return (
        <LinearScaleValidationPanel question={question} onChange={onChange} />
      );
    default:
      return (
        <Toggle
          label='Required'
          checked={question.required}
          onChange={(c) => onChange({ required: c })}
        />
      );
  }
}

function QuestionBody({
  question,
  onChange,
}: {
  question: Question;
  onChange: (p: Partial<Question>) => void;
}) {
  const props = { question, onChange };
  switch (question.type) {
    case 'text':
      return <TextQuestion question={question} />;
    case 'phone':
      return <PhoneQuestion question={question} />;
    case 'radio':
      return <ChoiceQuestion {...props} type='radio' />;
    case 'checkbox':
      return <ChoiceQuestion {...props} type='checkbox' />;
    case 'dropdown':
      return <ChoiceQuestion {...props} type='dropdown' />;
    case 'date':
      return <DateQuestion question={question} />;
    case 'rating':
      return <RatingQuestion question={question} />;
    case 'linear_scale':
      return <LinearScaleQuestion question={question} />;
    case 'file_upload':
      return <FileQuestion question={question} />;
    case 'section':
      return <SectionQuestion question={question} />;
    case 'yes_no':
      return <YesNoQuestion question={question} />;
    case 'matrix':
      return <MatrixQuestion {...props} />;
    default:
      return null;
  }
}

export function QuestionCard({
  question,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  onDuplicate,
}: QuestionCardProps) {
  const [showValidation, setShowValidation] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
  });

  const meta = TYPE_META[question.type];
  const Icon = meta.icon;
  const isSection = question.type === 'section';

  // Auto-resize title textarea
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [question.title]);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={cn(
        'group relative rounded-2xl border bg-white transition-all duration-150',
        isDragging && 'opacity-50 shadow-2xl',
        isSelected
          ? 'border-[#0B1AA0]/60 shadow-md shadow-[#0B1AA0]/10 ring-2 ring-[#0B1AA0]/20'
          : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md',
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border border-slate-200 bg-white p-0.5 text-slate-300 shadow-sm opacity-0 transition-opacity hover:text-slate-500',
          'group-hover:opacity-100',
          isSelected && 'opacity-100',
        )}
        aria-label='Drag to reorder'
      >
        <GripVertical className='h-4 w-4' />
      </button>

      <div className='p-5'>
        {/* Header */}
        <div className='flex items-start gap-3'>
          <span
            className={cn(
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs',
              meta.color,
            )}
          >
            <Icon className='h-3.5 w-3.5' />
          </span>

          <div className='flex-1 min-w-0'>
            {isSection ? (
              <textarea
                ref={titleRef}
                value={question.title}
                onChange={(e) => onChange({ title: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder='Section title'
                rows={1}
                className='w-full resize-none bg-transparent text-base font-semibold text-slate-800 placeholder:text-slate-300 outline-none leading-snug overflow-hidden'
              />
            ) : (
              <textarea
                ref={titleRef}
                value={question.title}
                onChange={(e) => onChange({ title: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder='Question'
                rows={1}
                className='w-full resize-none bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none leading-snug overflow-hidden'
              />
            )}

            {/* Description */}
            {question.showDescription && (
              <textarea
                value={question.description ?? ''}
                onChange={(e) => onChange({ description: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                placeholder='Description (optional)'
                rows={1}
                className='mt-1 w-full resize-none bg-transparent text-xs text-slate-500 placeholder:text-slate-300 outline-none leading-snug'
              />
            )}
          </div>

          {/* Required badge */}
          {question.required && !isSection && (
            <span className='mt-0.5 shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500'>
              Required
            </span>
          )}
        </div>

        {/* Question body */}
        {!isSection && (
          <div className='ml-10'>
            <QuestionBody question={question} onChange={onChange} />
          </div>
        )}
        {isSection && (
          <div className='ml-10 mt-2'>
            <SectionQuestion question={question} />
          </div>
        )}

        {/* Validation panel */}
        {isSelected && showValidation && !isSection && (
          <div
            onClick={(e) => e.stopPropagation()}
            className='ml-10 mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4'
          >
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
              Validation
            </p>
            <ValidationPanel question={question} onChange={onChange} />
          </div>
        )}
      </div>

      {/* Footer actions (visible when selected) */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className='flex items-center justify-between border-t border-slate-100 px-5 py-2.5'
        >
          <div className='flex items-center gap-3'>
            <Toggle
              label='Required'
              checked={question.required}
              onChange={(c) => onChange({ required: c })}
            />
            <Toggle
              label='Description'
              checked={question.showDescription ?? false}
              onChange={(c) => onChange({ showDescription: c })}
            />
          </div>

          <div className='flex items-center gap-1'>
            {!isSection && (
              <button
                onClick={() => setShowValidation((v) => !v)}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  showValidation
                    ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
                    : 'text-slate-500 hover:bg-slate-100',
                )}
                title='Validation rules'
              >
                <Settings2 className='h-3.5 w-3.5' />
                {showValidation ? (
                  <ChevronUp className='h-3 w-3' />
                ) : (
                  <ChevronDown className='h-3 w-3' />
                )}
              </button>
            )}
            <button
              onClick={onDuplicate}
              className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors'
              title='Duplicate'
            >
              <Copy className='h-4 w-4' />
            </button>
            <button
              onClick={onDelete}
              className='rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors'
              title='Delete'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
