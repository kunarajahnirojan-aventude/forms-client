import { useState } from 'react';
import {
  Undo2,
  Redo2,
  Eye,
  Send,
  Save,
  Check,
  Settings,
  Palette,
  LayoutList,
  ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormEditor_ } from '@/libs/forms/feature/hooks/useFormEditor';
import { FormHeader } from './FormHeader';
import { QuestionsCanvas } from './QuestionsCanvas';
import { SettingsPanel } from './SettingsPanel';
import { ThemePanel } from './ThemePanel';
import { PreviewModal } from './PreviewModal';
import { cn } from '@/utils';
import type { FormEditorState } from '@/libs/forms/store/types';
import { ROUTES } from '@/router/routes';

type RightPanel = FormEditorState['rightPanel'];

const PANEL_TABS: {
  value: RightPanel;
  icon: React.ElementType;
  label: string;
}[] = [
  { value: 'questions', icon: LayoutList, label: 'Questions' },
  { value: 'settings', icon: Settings, label: 'Settings' },
  { value: 'theme', icon: Palette, label: 'Theme' },
];

export function FormEditorView() {
  const navigate = useNavigate();
  const editor = useFormEditor_();
  const [showPreview, setShowPreview] = useState(false);

  const {
    activeForm,
    selectedQuestionId,
    isDirty,
    isSaving,
    lastSavedAt,
    rightPanel,
    setSelectedQuestion,
    setRightPanel,
    undo,
    redo,
    undoStack,
    redoStack,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    updateFormMeta,
    updateFormSettings,
    updateFormTheme,
  } = editor;

  if (!activeForm) {
    return (
      <div className='flex h-full items-center justify-center text-slate-400'>
        No form selected.
      </div>
    );
  }

  function handlePublishToggle() {
    if (!activeForm) return;
    updateFormSettings({
      acceptingResponses: activeForm.status !== 'published',
    });
  }

  const saveStatus = isSaving
    ? 'Saving…'
    : lastSavedAt
      ? `Saved`
      : isDirty
        ? 'Unsaved changes'
        : 'All changes saved';

  return (
    <>
      <div className='flex h-[calc(100vh-3.5rem)] flex-col bg-slate-50'>
        {/* Top toolbar */}
        <div className='flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5'>
          <button
            onClick={() => navigate(ROUTES.FORMS)}
            className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'
          >
            <ChevronLeft className='h-4 w-4' />
            Back
          </button>

          <div className='h-5 w-px bg-slate-200' />

          {/* Undo / Redo */}
          <div className='flex items-center gap-1'>
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className='rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed'
              title='Undo (⌘Z)'
            >
              <Undo2 className='h-4 w-4' />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className='rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed'
              title='Redo (⌘⇧Z)'
            >
              <Redo2 className='h-4 w-4' />
            </button>
          </div>

          {/* Save status */}
          <div className='flex items-center gap-1.5 text-xs text-slate-400'>
            {isSaving ? (
              <Save className='h-3.5 w-3.5 animate-pulse' />
            ) : lastSavedAt ? (
              <Check className='h-3.5 w-3.5 text-emerald-500' />
            ) : null}
            <span>{saveStatus}</span>
          </div>

          {/* Spacer */}
          <div className='flex-1' />

          {/* Right actions */}
          <button
            onClick={() => setShowPreview(true)}
            className='flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50'
          >
            <Eye className='h-4 w-4' />
            Preview
          </button>

          <button
            onClick={handlePublishToggle}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
              activeForm.status === 'published'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#0B1AA0] text-white hover:bg-[#0a179a]',
            )}
          >
            <Send className='h-4 w-4' />
            {activeForm.status === 'published' ? 'Published' : 'Publish'}
          </button>
        </div>

        {/* Body */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Center canvas */}
          <div className='flex-1 overflow-y-auto px-4 py-6'>
            <div className='mx-auto max-w-2xl'>
              <FormHeader
                title={activeForm.title}
                description={activeForm.description}
                themeColor={activeForm.theme.color}
                onTitleChange={(v) => updateFormMeta({ title: v })}
                onDescriptionChange={(v) => updateFormMeta({ description: v })}
              />
              <div className='mt-4'>
                <QuestionsCanvas
                  questions={activeForm.questions}
                  selectedQuestionId={selectedQuestionId}
                  onSelectQuestion={setSelectedQuestion}
                  onUpdateQuestion={updateQuestion}
                  onDeleteQuestion={deleteQuestion}
                  onDuplicateQuestion={duplicateQuestion}
                  onReorderQuestions={reorderQuestions}
                  onAddQuestion={addQuestion}
                />
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className='w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white'>
            {/* Panel tabs */}
            <div className='flex border-b border-slate-100'>
              {PANEL_TABS.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setRightPanel(value)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors',
                    rightPanel === value
                      ? 'border-b-2 border-[#0B1AA0] text-[#0B1AA0]'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  <Icon className='h-4 w-4' />
                  {label}
                </button>
              ))}
            </div>

            <div className='p-4'>
              {rightPanel === 'settings' && (
                <SettingsPanel
                  settings={activeForm.settings}
                  onChange={updateFormSettings}
                />
              )}
              {rightPanel === 'theme' && (
                <ThemePanel
                  theme={activeForm.theme}
                  onChange={updateFormTheme}
                />
              )}
              {rightPanel === 'questions' && (
                <div className='space-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3'>
                    {activeForm.questions.length} question
                    {activeForm.questions.length !== 1 ? 's' : ''}
                  </p>
                  {activeForm.questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestion(q.id);
                        // Scroll to question on canvas (best-effort)
                        document
                          .getElementById(`question-${q.id}`)
                          ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                          });
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                        selectedQuestionId === q.id
                          ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
                          : 'text-slate-600 hover:bg-slate-50',
                      )}
                    >
                      <span className='w-4 shrink-0 text-right text-slate-400'>
                        {i + 1}.
                      </span>
                      <span className='truncate'>
                        {q.title || 'Untitled question'}
                      </span>
                    </button>
                  ))}
                  {activeForm.questions.length === 0 && (
                    <p className='text-xs text-slate-400'>
                      No questions yet. Click "Add question" to start.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <PreviewModal form={activeForm} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
