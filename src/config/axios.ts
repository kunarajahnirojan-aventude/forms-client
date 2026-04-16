import axios from 'axios';
import { appConfig } from '@/config';
import { HTTP_STATUS } from '@/constants';

export const axiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Store accessor — lazily resolved to avoid circular dep at module init time
// ---------------------------------------------------------------------------

type StoreAccessor = {
  getToken: () => string | null;
  logout: () => void;
};

let _store: StoreAccessor | null = null;

/**
 * Call this once in `main.tsx` (or wherever the store is first created)
 * to wire up the axios interceptors to the Zustand store without creating
 * a circular module dependency.
 */
export function setAxiosStoreAccessor(accessor: StoreAccessor) {
  _store = accessor;
}

// ---------------------------------------------------------------------------
// Request interceptor — inject auth token
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = _store?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor — handle 401 (token expiry → logout)
// ---------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        _store?.logout();
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
