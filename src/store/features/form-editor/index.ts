import type { FormEditorState, EditorSnapshot } from '@/libs/forms/store/types';
import type { StateCreator } from 'zustand';
import type { AppState } from '@/store/types';

const MAX_UNDO = 50;

export const createFormEditorSlice: StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  FormEditorState
> = (set) => ({
  activeFormId: null,
  activePageId: null,
  selectedQuestionId: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  rightPanel: null,
  undoStack: [],
  redoStack: [],

  openEditor: (formId) =>
    set(
      {
        activeFormId: formId,
        activePageId: null,
        selectedQuestionId: null,
        isDirty: false,
        isSaving: false,
        undoStack: [],
        redoStack: [],
        rightPanel: null,
      },
      false,
      'editor/openEditor',
    ),

  closeEditor: () =>
    set(
      {
        activeFormId: null,
        activePageId: null,
        selectedQuestionId: null,
        isDirty: false,
        isSaving: false,
        undoStack: [],
        redoStack: [],
      },
      false,
      'editor/closeEditor',
    ),

  setActivePage: (pageId) =>
    set({ activePageId: pageId }, false, 'editor/setActivePage'),

  setSelectedQuestion: (id) =>
    set({ selectedQuestionId: id }, false, 'editor/setSelectedQuestion'),

  setIsDirty: (isDirty) => set({ isDirty }, false, 'editor/setIsDirty'),

  setIsSaving: (isSaving) => set({ isSaving }, false, 'editor/setIsSaving'),

  setLastSavedAt: (lastSavedAt) =>
    set({ lastSavedAt }, false, 'editor/setLastSavedAt'),

  setRightPanel: (rightPanel) =>
    set({ rightPanel }, false, 'editor/setRightPanel'),

  pushUndoSnapshot: (snapshot) =>
    set(
      (s) => ({
        undoStack: [...s.undoStack.slice(-MAX_UNDO + 1), snapshot],
        redoStack: [],
        isDirty: true,
      }),
      false,
      'editor/pushUndoSnapshot',
    ),

  undo: () =>
    set(
      (s) => {
        if (s.undoStack.length === 0) return s;
        const prev = s.undoStack[s.undoStack.length - 1];
        const activeForm = s.forms.find((f) => f.id === s.activeFormId);
        if (!activeForm) return s;

        const currentSnapshot: EditorSnapshot = {
          title: activeForm.title,
          description: activeForm.description,
          pages: activeForm.pages,
          settings: activeForm.settings,
          theme: activeForm.theme,
        };

        return {
          forms: s.forms.map((f) =>
            f.id === s.activeFormId
              ? {
                  ...f,
                  title: prev.title,
                  description: prev.description,
                  pages: prev.pages,
                  settings: prev.settings,
                  theme: prev.theme,
                  updatedAt: new Date().toISOString(),
                }
              : f,
          ),
          undoStack: s.undoStack.slice(0, -1),
          redoStack: [...s.redoStack, currentSnapshot],
          isDirty: true,
        };
      },
      false,
      'editor/undo',
    ),

  redo: () =>
    set(
      (s) => {
        if (s.redoStack.length === 0) return s;
        const next = s.redoStack[s.redoStack.length - 1];
        const activeForm = s.forms.find((f) => f.id === s.activeFormId);
        if (!activeForm) return s;

        const currentSnapshot: EditorSnapshot = {
          title: activeForm.title,
          description: activeForm.description,
          pages: activeForm.pages,
          settings: activeForm.settings,
          theme: activeForm.theme,
        };

        return {
          forms: s.forms.map((f) =>
            f.id === s.activeFormId
              ? {
                  ...f,
                  title: next.title,
                  description: next.description,
                  pages: next.pages,
                  settings: next.settings,
                  theme: next.theme,
                  updatedAt: new Date().toISOString(),
                }
              : f,
          ),
          redoStack: s.redoStack.slice(0, -1),
          undoStack: [...s.undoStack, currentSnapshot],
          isDirty: true,
        };
      },
      false,
      'editor/redo',
    ),
});
