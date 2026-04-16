import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/providers';
import { useAppStore } from '@/store';
import { setAxiosStoreAccessor } from '@/config/axios';
import '@/styles/index.css';

// Wire up the axios interceptors to Zustand store (avoids circular deps)
setAxiosStoreAccessor({
  getToken: () => useAppStore.getState().token,
  logout: () => useAppStore.getState().logout(),
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);
