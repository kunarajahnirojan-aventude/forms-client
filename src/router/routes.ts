export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  FORMS: '/forms',
  FORMS_NEW: '/forms/new',
  FORMS_EDIT: '/forms/:id/edit',
  FORMS_PREVIEW: '/forms/:id/preview',
  FORMS_RESPOND: '/forms/:id/respond',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export function formsEditPath(id: string) {
  return `/forms/${id}/edit`;
}

export function formsPreviewPath(id: string) {
  return `/forms/${id}/preview`;
}

export function formsRespondPath(id: string) {
  return `/forms/${id}/respond`;
}
