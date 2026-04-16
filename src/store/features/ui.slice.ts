import type { UIState, SliceCreator } from '@/store/types';

export const createUISlice: SliceCreator<UIState> = (set) => ({
  isLoading: false,
  theme: 'light',

  setLoading: (isLoading) => set({ isLoading }, false, 'ui/setLoading'),

  toggleTheme: () =>
    set(
      (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
      false,
      'ui/toggleTheme',
    ),
});
