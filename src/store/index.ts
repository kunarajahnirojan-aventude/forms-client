import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { devtools, persist } from 'zustand/middleware';
import type { AppState } from '@/store/types';
import { createAuthSlice } from '@/store/features/auth.slice';
import { createUISlice } from '@/store/features/ui.slice';
import { createFormsSlice } from '@/libs/forms/store/forms.slice';
import { createFormEditorSlice } from '@/libs/forms/store/form-editor.slice';
import { persistConfig } from '@/store/persist';

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createUISlice(...args),
        ...createFormsSlice(...args),
        ...createFormEditorSlice(...args),
      }),
      persistConfig,
    ),
    {
      name: 'AppStore',
      enabled: import.meta.env.DEV,
    },
  ),
);

// ---------------------------------------------------------------------------
// Selector hooks (avoid re-renders when only part of the state changes)
// ---------------------------------------------------------------------------

export const useAuth = () =>
  useAppStore(
    useShallow((s) => ({
      user: s.user,
      token: s.token,
      isAuthenticated: s.isAuthenticated,
      login: s.login,
      logout: s.logout,
      setUser: s.setUser,
      setToken: s.setToken,
    })),
  );

export const useUI = () =>
  useAppStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      theme: s.theme,
      setLoading: s.setLoading,
      toggleTheme: s.toggleTheme,
    })),
  );

export const useFormsStore = () =>
  useAppStore(
    useShallow((s) => ({
      forms: s.forms,
      searchQuery: s.searchQuery,
      statusFilter: s.statusFilter,
      setForms: s.setForms,
      addForm: s.addForm,
      updateForm: s.updateForm,
      deleteForm: s.deleteForm,
      duplicateForm: s.duplicateForm,
      setSearchQuery: s.setSearchQuery,
      setStatusFilter: s.setStatusFilter,
    })),
  );

export const useFormEditor = () =>
  useAppStore(
    useShallow((s) => ({
      activeFormId: s.activeFormId,
      selectedQuestionId: s.selectedQuestionId,
      isDirty: s.isDirty,
      isSaving: s.isSaving,
      lastSavedAt: s.lastSavedAt,
      rightPanel: s.rightPanel,
      undoStack: s.undoStack,
      redoStack: s.redoStack,
      openEditor: s.openEditor,
      closeEditor: s.closeEditor,
      setSelectedQuestion: s.setSelectedQuestion,
      setIsDirty: s.setIsDirty,
      setIsSaving: s.setIsSaving,
      setLastSavedAt: s.setLastSavedAt,
      setRightPanel: s.setRightPanel,
      pushUndoSnapshot: s.pushUndoSnapshot,
      undo: s.undo,
      redo: s.redo,
    })),
  );
