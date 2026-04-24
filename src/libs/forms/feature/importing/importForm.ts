import type { Form, DisplayMode } from '@/libs/forms/store/types';
import { resolveInitialMode } from '@/libs/forms/feature/rendering-engine/resolveInitialMode';
import { fetchGoogleFormData } from './fetchGoogleFormHtml';
import { convertGoogleFormPublic } from './converters/googleFormsPublic';

export type ImportPlatform = 'google';

export async function importForm(
  _platform: ImportPlatform,
  url: string,
): Promise<Form> {
  const data = await fetchGoogleFormData(url);
  let form = convertGoogleFormPublic(data);

  const detectedMode: DisplayMode = resolveInitialMode(form);
  form = {
    ...form,
    settings: { ...form.settings, defaultDisplayMode: detectedMode },
  };

  return form;
}
