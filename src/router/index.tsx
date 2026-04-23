import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { ROUTES } from './routes';

const LandingPage = lazy(() => import('@/libs/home/feature'));
const SurveysListPage = lazy(() => import('@/libs/forms/feature/forms-list'));
const SurveysCreatePage = lazy(
  () => import('@/libs/forms/feature/forms-create'),
);
const SurveysEditPage = lazy(() => import('@/libs/forms/feature/forms-edit'));
const SurveyPreviewPage = lazy(
  () => import('@/libs/forms/feature/survey-preview'),
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
    path: ROUTES.SURVEYS_PREVIEW,
    element: (
      <Lazy>
        <SurveyPreviewPage />
      </Lazy>
    ),
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.SURVEYS,
        element: (
          <Lazy>
            <SurveysListPage />
          </Lazy>
        ),
      },
      {
        path: ROUTES.SURVEYS_NEW,
        element: (
          <Lazy>
            <SurveysCreatePage />
          </Lazy>
        ),
      },
      {
        path: ROUTES.SURVEYS_EDIT,
        element: (
          <Lazy>
            <SurveysEditPage />
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
