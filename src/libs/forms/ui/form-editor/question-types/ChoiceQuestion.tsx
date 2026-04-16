import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { GripVertical, Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import type {
  Question,
  ChoiceOption,
  ChoiceValidation,
} from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface ChoiceQuestionProps {
  question: Question;
  onChange?: (updates: Partial<Question>) => void;
  isPreview?: boolean;
  type: 'radio' | 'checkbox' | 'dropdown';
}

function SortableOption({
  option,
  inputType,
  onChange,
  onDelete,
  canDelete,
}: {
  option: ChoiceOption;
  inputType: 'radio' | 'checkbox';
  onChange: (label: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
        isDragging ? 'bg-[#0B1AA0]/5 shadow-sm z-10' : 'hover:bg-slate-50',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className='cursor-grab touch-none text-slate-300 hover:text-slate-500'
        aria-label='Drag to reorder'
      >
        <GripVertical className='h-4 w-4' />
      </button>
      <div
        className={cn(
          'h-4 w-4 shrink-0 border-2 border-slate-300',
          inputType === 'radio' ? 'rounded-full' : 'rounded',
        )}
      />
      <input
        value={option.label}
        onChange={(e) => onChange(e.target.value)}
        className='flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
        placeholder='Option label'
      />
      {canDelete && (
        <button
          onClick={onDelete}
          className='text-slate-300 hover:text-red-400 transition-colors'
        >
          <X className='h-3.5 w-3.5' />
        </button>
      )}
    </div>
  );
}

export function ChoiceQuestion({
  question,
  onChange,
  isPreview,
  type,
}: ChoiceQuestionProps) {
  const options = question.options ?? [];
  const validation = question.validation as ChoiceValidation;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = options.findIndex((o) => o.id === active.id);
    const newIdx = options.findIndex((o) => o.id === over.id);
    onChange?.({ options: arrayMove(options, oldIdx, newIdx) });
  }

  function addOption() {
    onChange?.({
      options: [
        ...options,
        { id: nanoid(), label: `Option ${options.length + 1}` },
      ],
    });
  }

  function updateOption(id: string, label: string) {
    onChange?.({
      options: options.map((o) => (o.id === id ? { ...o, label } : o)),
    });
  }

  function removeOption(id: string) {
    onChange?.({ options: options.filter((o) => o.id !== id) });
  }

  if (type === 'dropdown' && !isPreview) {
    return (
      <div className='mt-3 space-y-1'>
        {options.map((opt, i) => (
          <div
            key={opt.id}
            className='flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50'
          >
            <span className='w-5 text-right text-xs text-slate-400'>
              {i + 1}.
            </span>
            <input
              value={opt.label}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              className='flex-1 bg-transparent text-sm text-slate-700 outline-none'
            />
            {options.length > 1 && (
              <button
                onClick={() => removeOption(opt.id)}
                className='text-slate-300 hover:text-red-400'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          className='flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#0B1AA0] hover:text-[#0a179a] transition-colors'
        >
          <Plus className='h-3.5 w-3.5' /> Add option
        </button>
      </div>
    );
  }

  const inputType = type === 'checkbox' ? 'checkbox' : 'radio';

  if (isPreview) {
    return (
      <div className='mt-3 space-y-2'>
        {options.map((opt) => (
          <label
            key={opt.id}
            className='flex items-center gap-2.5 cursor-pointer'
          >
            <input
              type={inputType}
              disabled
              className='h-4 w-4 accent-blue-600'
            />
            <span className='text-sm text-slate-700'>{opt.label}</span>
          </label>
        ))}
        {validation.allowOther && (
          <label className='flex items-center gap-2.5 cursor-pointer'>
            <input
              type={inputType}
              disabled
              className='h-4 w-4 accent-blue-600'
            />
            <span className='text-sm text-slate-500 italic'>Other…</span>
          </label>
        )}
      </div>
    );
  }

  return (
    <div className='mt-3'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={options.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='space-y-0.5'>
            {options.map((opt) => (
              <SortableOption
                key={opt.id}
                option={opt}
                inputType={inputType}
                onChange={(label) => updateOption(opt.id, label)}
                onDelete={() => removeOption(opt.id)}
                canDelete={options.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className='mt-1 flex items-center gap-3 px-2'>
        <button
          onClick={addOption}
          className='flex items-center gap-1.5 py-1.5 text-xs font-medium text-[#0B1AA0] hover:text-[#0a179a] transition-colors'
        >
          <Plus className='h-3.5 w-3.5' /> Add option
        </button>
        {validation.allowOther && (
          <span className='text-xs text-slate-400 italic'>
            + "Other" field enabled
          </span>
        )}
      </div>
    </div>
  );
}
