import type { Form, DisplayMode } from '@/libs/forms/store/types';
import { resolveInitialMode } from '@/libs/forms/hooks/use-rendering-engine/resolveInitialMode';
import { fetchGoogleFormData } from '@/libs/forms/hooks/google-fetcher';
import { convertGoogleFormPublic } from '@/libs/forms/hooks/google-converter';

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
