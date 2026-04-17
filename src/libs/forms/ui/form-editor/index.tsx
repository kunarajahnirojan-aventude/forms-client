import {
  Undo2,
  Redo2,
  Eye,
  Send,
  Save,
  Check,
  Settings,
  Palette,
  ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormEditor_ } from '@/libs/forms/feature/hooks/useFormEditor';
import { QuestionsCanvas } from './QuestionsCanvas';
import { SettingsPanel } from './SettingsPanel';
import { ThemePanel } from './ThemePanel';
import { PagesSidebar } from './PagesSidebar';
import { cn } from '@/utils';
import { ROUTES, surveysPreviewPath } from '@/router/routes';

export function SurveyEditorView() {
  const navigate = useNavigate();
  const editor = useFormEditor_();

  const {
    activeForm,
    activePageId,
    setActivePage,
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
    addPage,
    updatePage,
    deletePage,
    updateFormSettings,
    updateFormTheme,
  } = editor;

  if (!activeForm) {
    return (
      <div className='flex h-full items-center justify-center text-slate-400'>
        No survey selected.
      </div>
    );
  }

  const activePage = activeForm.pages.find((p) => p.id === activePageId) ?? null;

  function handlePublishToggle() {
    updateFormSettings({
      acceptingResponses: activeForm!.status !== 'published',
    });
  }

  const saveStatus = isSaving
    ? 'Saving…'
    : lastSavedAt
      ? 'Saved'
      : isDirty
        ? 'Unsaved changes'
        : 'All changes saved';

  function togglePanel(panel: 'settings' | 'theme') {
    setRightPanel(rightPanel === panel ? null : panel);
  }

  return (
    <div className='flex h-[calc(100vh-3.5rem)] flex-col bg-slate-50'>
      {/* ── Top toolbar ──────────────────────────────────────────────────── */}
      <div className='flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5'>
        <button
          onClick={() => navigate(ROUTES.SURVEYS)}
          className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'
        >
          <ChevronLeft className='h-4 w-4' />
          Surveys
        </button>

        <div className='h-5 w-px bg-slate-200' />

        {/* Undo / Redo */}
        <div className='flex items-center gap-1'>
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className='rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30'
            title='Undo (⌘Z)'
          >
            <Undo2 className='h-4 w-4' />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className='rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30'
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

        {/* Survey title (centre) */}
        <div className='flex-1 text-center'>
          <span className='mx-auto block max-w-xs truncate text-sm font-semibold text-slate-800'>
            {activeForm.title}
          </span>
        </div>

        {/* Panel toggles */}
        <button
          onClick={() => togglePanel('settings')}
          className={cn(
            'rounded-lg p-1.5 transition-colors',
            rightPanel === 'settings'
              ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
              : 'text-slate-500 hover:bg-slate-100',
          )}
          title='Settings'
        >
          <Settings className='h-4 w-4' />
        </button>
        <button
          onClick={() => togglePanel('theme')}
          className={cn(
            'rounded-lg p-1.5 transition-colors',
            rightPanel === 'theme'
              ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
              : 'text-slate-500 hover:bg-slate-100',
          )}
          title='Theme'
        >
          <Palette className='h-4 w-4' />
        </button>

        <div className='h-5 w-px bg-slate-200' />

        <button
          onClick={() =>
            window.open(surveysPreviewPath(activeForm.id), '_blank')
          }
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

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left: Pages sidebar */}
        <PagesSidebar
          pages={activeForm.pages}
          activePageId={activePageId}
          onSelectPage={setActivePage}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onUpdatePage={updatePage}
        />

        {/* Centre: Page questions editor */}
        <div className='flex-1 overflow-y-auto px-6 py-6'>
          {activePage ? (
            <div className='mx-auto max-w-2xl'>
              {/* Survey description banner (first page only) */}
              {activeForm.pages[0]?.id === activePage.id &&
                activeForm.description && (
                  <div className='mb-4 rounded-xl border border-slate-100 bg-white px-5 py-4'>
                    <p className='mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400'>
                      Survey Description
                    </p>
                    <div
                      className='rich-text-content text-sm text-slate-600'
                      dangerouslySetInnerHTML={{
                        __html: activeForm.description,
                      }}
                    />
                  </div>
                )}

              {/* Page title / description */}
              <div className='mb-4 rounded-xl border border-slate-200 bg-white px-5 py-4'>
                <label className='mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400'>
                  Page Title
                </label>
                <input
                  value={activePage.title}
                  onChange={(e) =>
                    updatePage(activePage.id, { title: e.target.value })
                  }
                  placeholder='Untitled page'
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base font-semibold text-slate-800 outline-none transition-colors focus:border-[#0B1AA0] focus:ring-2 focus:ring-[#0B1AA0]/15'
                />
                <input
                  value={activePage.description ?? ''}
                  onChange={(e) =>
                    updatePage(activePage.id, {
                      description: e.target.value || undefined,
                    })
                  }
                  placeholder='Page description (optional)'
                  className='mt-2 w-full rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-sm text-slate-500 outline-none transition-colors placeholder:text-slate-300 focus:border-slate-200 focus:bg-slate-50'
                />
              </div>

              {/* Questions canvas (inline add, no modal) */}
              <QuestionsCanvas
                questions={activePage.questions}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={setSelectedQuestion}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onDuplicateQuestion={duplicateQuestion}
                onReorderQuestions={(newOrder) =>
                  reorderQuestions(activePage.id, newOrder)
                }
                onAddQuestion={(type) => addQuestion(type, activePage.id)}
              />
            </div>
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-slate-400'>
              Select a page from the sidebar
            </div>
          )}
        </div>

        {/* Right: collapsible settings / theme panel */}
        {rightPanel && (
          <div className='w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white'>
            {rightPanel === 'settings' ? (
              <SettingsPanel
                settings={activeForm.settings}
                onChange={updateFormSettings}
              />
            ) : (
              <ThemePanel theme={activeForm.theme} onChange={updateFormTheme} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

