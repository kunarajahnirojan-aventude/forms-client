import type { Form, DisplayMode } from '@/libs/forms/store/types';

/**
 * Determines the initial rendering mode for a form.
 *
 * Priority:
 *   1. Explicit `settings.defaultDisplayMode` on the schema
 *   2. Multiple pages → "page"
 *   3. Single page / flat questions → "all"
 */
export function resolveInitialMode(form: Form): DisplayMode {
  if (form.settings.defaultDisplayMode) {
    return form.settings.defaultDisplayMode;
  }
  if (form.pages.length > 1) {
    return 'page';
  }
  return 'all';
}
