import type { PersistOptions } from 'zustand/middleware';
import type { AppState } from '@/store/types';
import { STORAGE_KEYS } from '@/constants';

/** Auth + forms list are persisted; editor state is ephemeral. */
type PersistedState = Pick<
  AppState,
  'user' | 'token' | 'isAuthenticated' | 'forms'
>;

export const persistConfig: PersistOptions<AppState, PersistedState> = {
  name: STORAGE_KEYS.AUTH,
  version: 2, // bump to clear old persisted state (questions→pages schema change)
  partialize: (state): PersistedState => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    forms: state.forms,
  }),
};
