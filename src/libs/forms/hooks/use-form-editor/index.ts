import { useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { nanoid } from 'nanoid';
import { useAppStore, useFormEditor, useFormsStore } from '@/store';
import type {
  Question,
  QuestionType,
  QuestionValidation,
  EditorSnapshot,
  ChoiceOption,
  FormPage,
} from '@/libs/forms/store/types';

function defaultValidation(type: QuestionType): QuestionValidation {
  switch (type) {
    case 'text':
    case 'phone':
      return {
        subtype: type === 'phone' ? 'phone' : 'single_line',
        required: false,
      };
    case 'radio':
    case 'checkbox':
    case 'dropdown':
      return { required: false, allowOther: false, shuffleOptions: false };
    case 'date':
      return { required: false, includeTime: false };
    case 'rating':
      return { required: false, maxRating: 5, showLabels: false };
    case 'linear_scale':
      return { required: false, min: 1, max: 5, labelLow: '', labelHigh: '' };
    case 'file_upload':
      return { required: false, maxSizeMb: 10, maxFiles: 1 };
    case 'matrix':
      return { required: false, multiplePerRow: false };
    default:
      return { required: false };
  }
}

function defaultOptions(type: QuestionType): ChoiceOption[] | undefined {
  if (['radio', 'checkbox', 'dropdown'].includes(type)) {
    return [
      { id: nanoid(), label: 'Option 1' },
      { id: nanoid(), label: 'Option 2' },
    ];
  }
  if (type === 'yes_no') {
    return [
      { id: nanoid(), label: 'Yes' },
      { id: nanoid(), label: 'No' },
    ];
  }
  return undefined;
}

function buildSnapshot(
  forms: ReturnType<typeof useFormsStore>['forms'],
  activeFormId: string | null,
): EditorSnapshot | null {
  const form = forms.find((f) => f.id === activeFormId);
  if (!form) return null;
  return {
    title: form.title,
    description: form.description,
    pages: form.pages,
    settings: form.settings,
    theme: form.theme,
  };
}

export function useFormEditor_() {
  const { updateForm, forms } = useFormsStore();
  const editor = useFormEditor();
  const {
    activeFormId,
    activePageId,
    pushUndoSnapshot,
    setIsSaving,
    setLastSavedAt,
    setActivePage,
  } = editor;

  const activeForm = forms.find((f) => f.id === activeFormId) ?? null;

  // Default to first page when editor opens
  useEffect(() => {
    if (activeForm && activeForm.pages.length > 0 && !activePageId) {
      setActivePage(activeForm.pages[0].id);
    }
  }, [activeForm, activePageId, setActivePage]);

  // Auto-save: debounce 1.5s after isDirty
  const [debouncedDirty] = useDebounce(editor.isDirty, 1500);
  useEffect(() => {
    if (debouncedDirty && activeFormId) {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSavedAt(new Date().toISOString());
        useAppStore.getState().setIsDirty(false);
      }, 600);
    }
  }, [debouncedDirty, activeFormId, setIsSaving, setLastSavedAt]);

  // Undo/Redo keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          editor.redo();
        } else {
          editor.undo();
        }
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editor]);

  // ── Question actions (all scoped to a pageId) ──────────────────────────────

  const addQuestion = useCallback(
    (type: QuestionType, pageId: string) => {
      if (!activeFormId || !activeForm) return;
      const snap = buildSnapshot(forms, activeFormId);
      if (snap) pushUndoSnapshot(snap);

      const newQ: Question = {
        id: nanoid(),
        type,
        title: type === 'section' ? 'Section' : 'Untitled question',
        required: false,
        validation: defaultValidation(type),
        options: defaultOptions(type),
        rows:
          type === 'matrix'
            ? [
                { id: nanoid(), label: 'Row 1' },
                { id: nanoid(), label: 'Row 2' },
              ]
            : undefined,
        columns:
          type === 'matrix'
            ? [
                { id: nanoid(), label: 'Column 1' },
                { id: nanoid(), label: 'Column 2' },
              ]
            : undefined,
      };

      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) =>
          p.id === pageId ? { ...p, questions: [...p.questions, newQ] } : p,
        ),
      });
      editor.setSelectedQuestion(newQ.id);
    },
    [activeFormId, activeForm, forms, pushUndoSnapshot, updateForm, editor],
  );

  const updateQuestion = useCallback(
    (id: string, patch: Partial<Question>) => {
      if (!activeFormId || !activeForm) return;
      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) => ({
          ...p,
          questions: p.questions.map((q) =>
            q.id === id ? { ...q, ...patch } : q,
          ),
        })),
      });
      editor.setIsDirty(true);
    },
    [activeFormId, activeForm, updateForm, editor],
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      if (!activeFormId || !activeForm) return;
      const snap = buildSnapshot(forms, activeFormId);
      if (snap) pushUndoSnapshot(snap);
      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) => ({
          ...p,
          questions: p.questions.filter((q) => q.id !== id),
        })),
      });
      if (editor.selectedQuestionId === id) editor.setSelectedQuestion(null);
    },
    [activeFormId, activeForm, forms, pushUndoSnapshot, updateForm, editor],
  );

  const duplicateQuestion = useCallback(
    (id: string) => {
      if (!activeFormId || !activeForm) return;
      const snap = buildSnapshot(forms, activeFormId);
      if (snap) pushUndoSnapshot(snap);
      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) => {
          const idx = p.questions.findIndex((q) => q.id === id);
          if (idx === -1) return p;
          const copy: Question = { ...p.questions[idx], id: nanoid() };
          const next = [...p.questions];
          next.splice(idx + 1, 0, copy);
          return { ...p, questions: next };
        }),
      });
    },
    [activeFormId, activeForm, forms, pushUndoSnapshot, updateForm],
  );

  const reorderQuestions = useCallback(
    (pageId: string, newOrder: Question[]) => {
      if (!activeFormId || !activeForm) return;
      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) =>
          p.id === pageId ? { ...p, questions: newOrder } : p,
        ),
      });
      editor.setIsDirty(true);
    },
    [activeFormId, activeForm, updateForm, editor],
  );

  // ── Page actions ────────────────────────────────────────────────────────────

  const addPage = useCallback(() => {
    if (!activeFormId || !activeForm) return;
    const snap = buildSnapshot(forms, activeFormId);
    if (snap) pushUndoSnapshot(snap);
    const newPage: FormPage = {
      id: nanoid(),
      title: `Page ${activeForm.pages.length + 1}`,
      questions: [],
    };
    updateForm(activeFormId, { pages: [...activeForm.pages, newPage] });
    setActivePage(newPage.id);
  }, [
    activeFormId,
    activeForm,
    forms,
    pushUndoSnapshot,
    updateForm,
    setActivePage,
  ]);

  const updatePage = useCallback(
    (pageId: string, patch: Partial<FormPage>) => {
      if (!activeFormId || !activeForm) return;
      updateForm(activeFormId, {
        pages: activeForm.pages.map((p) =>
          p.id === pageId ? { ...p, ...patch } : p,
        ),
      });
      editor.setIsDirty(true);
    },
    [activeFormId, activeForm, updateForm, editor],
  );

  const deletePage = useCallback(
    (pageId: string) => {
      if (!activeFormId || !activeForm) return;
      if (activeForm.pages.length <= 1) return; // keep at least one
      const snap = buildSnapshot(forms, activeFormId);
      if (snap) pushUndoSnapshot(snap);
      const remaining = activeForm.pages.filter((p) => p.id !== pageId);
      updateForm(activeFormId, { pages: remaining });
      if (activePageId === pageId) setActivePage(remaining[0]?.id ?? null);
    },
    [
      activeFormId,
      activeForm,
      forms,
      pushUndoSnapshot,
      updateForm,
      activePageId,
      setActivePage,
    ],
  );

  // ── Form meta / settings / theme ────────────────────────────────────────────

  const updateFormMeta = useCallback(
    (patch: { title?: string; description?: string }) => {
      if (!activeFormId) return;
      updateForm(activeFormId, patch);
      editor.setIsDirty(true);
    },
    [activeFormId, updateForm, editor],
  );

  const updateFormSettings = useCallback(
    (patch: Partial<NonNullable<typeof activeForm>['settings']>) => {
      if (!activeFormId || !activeForm) return;
      updateForm(activeFormId, {
        settings: { ...activeForm.settings, ...patch },
      });
      editor.setIsDirty(true);
    },
    [activeFormId, activeForm, updateForm, editor],
  );

  const updateFormTheme = useCallback(
    (patch: Partial<NonNullable<typeof activeForm>['theme']>) => {
      if (!activeFormId || !activeForm) return;
      updateForm(activeFormId, {
        theme: { ...activeForm.theme, ...patch },
      });
      editor.setIsDirty(true);
    },
    [activeFormId, activeForm, updateForm, editor],
  );

  return {
    activeForm,
    ...editor,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    addPage,
    updatePage,
    deletePage,
    updateFormMeta,
    updateFormSettings,
    updateFormTheme,
  };
}
