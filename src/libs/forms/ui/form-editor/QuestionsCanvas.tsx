import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Question, QuestionType } from '@/libs/forms/store/types';
import { QuestionCard } from './QuestionCard';
import { QuestionTypeMenu } from './QuestionTypeMenu';
import { useFormDnd } from '@/libs/forms/feature/hooks/useFormDnd';

interface QuestionsCanvasProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onReorderQuestions: (questions: Question[]) => void;
  onAddQuestion: (type: QuestionType) => void;
}

export function QuestionsCanvas({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
  onAddQuestion,
}: QuestionsCanvasProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const { sensors, handleDragEnd, DndContext, closestCenter, modifiers } =
    useFormDnd({ items: questions, onReorder: onReorderQuestions });

  const activeQuestion =
    questions.find((q) => q.id === selectedQuestionId) ?? null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='space-y-3 pb-6'>
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isSelected={q.id === selectedQuestionId}
              onSelect={() => onSelectQuestion(q.id)}
              onChange={(updates) => onUpdateQuestion(q.id, updates)}
              onDelete={() => onDeleteQuestion(q.id)}
              onDuplicate={() => onDuplicateQuestion(q.id)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Invisible drag overlay to keep spacing */}
      <DragOverlay>
        {activeQuestion ? (
          <div className='rounded-2xl border border-[#0B1AA0]/40 bg-white shadow-xl opacity-90 p-4'>
            <span className='text-sm font-medium text-slate-700'>
              {activeQuestion.title || 'Question'}
            </span>
          </div>
        ) : null}
      </DragOverlay>

      {/* Add question button */}
      <div className='relative'>
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className='flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 transition-colors hover:border-[#0B1AA0]/40 hover:bg-[#0B1AA0]/5 hover:text-[#0B1AA0]'
        >
          <Plus className='h-4 w-4' />
          Add question
        </button>

        {showAddMenu && (
          <>
            <div
              className='fixed inset-0 z-10 bg-black/20 backdrop-blur-[1px]'
              onClick={() => setShowAddMenu(false)}
            />
            <div className='fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
              <QuestionTypeMenu
                onSelect={(type) => {
                  onAddQuestion(type);
                  setShowAddMenu(false);
                }}
                onClose={() => setShowAddMenu(false)}
              />
            </div>
          </>
        )}
      </div>
    </DndContext>
  );
}
