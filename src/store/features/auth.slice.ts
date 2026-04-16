import type { AuthState, SliceCreator } from '@/store/types';

export const createAuthSlice: SliceCreator<AuthState> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }, false, 'auth/setUser'),

  setToken: (token) => set({ token }, false, 'auth/setToken'),

  login: (user, token) =>
    set({ user, token, isAuthenticated: true }, false, 'auth/login'),

  logout: () =>
    set(
      { user: null, token: null, isAuthenticated: false },
      false,
      'auth/logout',
    ),
});
