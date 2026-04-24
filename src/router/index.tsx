import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { ROUTES } from './routes';

const LandingPage = lazy(() => import('@/libs/home/feature'));
const FormsListPage = lazy(() => import('@/libs/forms/feature/forms-list'));
const FormsCreatePage = lazy(() => import('@/libs/forms/feature/forms-create'));
const FormsEditPage = lazy(() => import('@/libs/forms/feature/forms-edit'));
const FormPreviewPage = lazy(
  () => import('@/libs/forms/feature/survey-preview'),
);
const FormRespondPage = lazy(
  () => import('@/libs/forms/feature/rendering-engine'),
);

function PageLoader() {
  return (
    <div className='flex h-full min-h-[60vh] items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#0B1AA0] border-t-transparent' />
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: (
      <Lazy>
        <LandingPage />
      </Lazy>
    ),
  },
  {
    path: ROUTES.FORMS_PREVIEW,
    element: (
      <Lazy>
        <FormPreviewPage />
      </Lazy>
    ),
  },
  {
    path: ROUTES.FORMS_RESPOND,
    element: (
      <Lazy>
        <FormRespondPage />
      </Lazy>
    ),
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.FORMS,
        element: (
          <Lazy>
            <FormsListPage />
          </Lazy>
        ),
      },
      {
        path: ROUTES.FORMS_NEW,
        element: (
          <Lazy>
            <FormsCreatePage />
          </Lazy>
        ),
      },
      {
        path: ROUTES.FORMS_EDIT,
        element: (
          <Lazy>
            <FormsEditPage />
          </Lazy>
        ),
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Lazy>
            <LandingPage />
          </Lazy>
        ),
      },
    ],
  },
]);
