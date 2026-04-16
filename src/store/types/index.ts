import type { StateCreator } from 'zustand';
import type { FormsState, FormEditorState } from '@/libs/forms/store/types';

export type { FormsState, FormEditorState };

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// ---------------------------------------------------------------------------
// Slice state shapes
// ---------------------------------------------------------------------------

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface UIState {
  isLoading: boolean;
  theme: 'light' | 'dark';

  // Actions
  setLoading: (loading: boolean) => void;
  toggleTheme: () => void;
}

// ---------------------------------------------------------------------------
// Combined store type
// ---------------------------------------------------------------------------

export type AppState = AuthState & UIState & FormsState & FormEditorState;

// ---------------------------------------------------------------------------
// Slice creator helper type
// ---------------------------------------------------------------------------

export type SliceCreator<T> = StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  T
>;
