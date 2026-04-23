export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SURVEYS: '/surveys',
  SURVEYS_NEW: '/surveys/new',
  SURVEYS_EDIT: '/surveys/:id/edit',
  SURVEYS_PREVIEW: '/surveys/:id/preview',
  SURVEYS_RESPOND: '/surveys/:id/respond',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function surveysEditPath(id: string) {
  return `/surveys/${id}/edit`;
}

export function surveysPreviewPath(id: string) {
  return `/surveys/${id}/preview`;
}

export function surveysRespondPath(id: string) {
  return `/surveys/${id}/respond`;
}

// Legacy aliases kept so old imports don't break during refactor
export const FORMS = '/surveys';
export function formsEditPath(id: string) {
  return surveysEditPath(id);
}
