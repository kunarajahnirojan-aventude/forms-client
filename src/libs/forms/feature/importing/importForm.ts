import type { Form, DisplayMode } from '@/libs/forms/store/types';
import { resolveInitialMode } from '@/libs/forms/feature/rendering-engine/resolveInitialMode';
import { convertGoogleForm } from './converters/googleForms';
import { convertMicrosoftForm } from './converters/microsoftForms';
import { convertSurveyMonkeyForm } from './converters/surveyMonkey';
import { fetchGoogleFormData } from './fetchGoogleFormHtml';
import { convertGoogleFormPublic } from './converters/googleFormsPublic';

export type ImportPlatform = 'google' | 'microsoft' | 'surveymonkey';

/**
 * Fetches/converts a form from the given platform URL into a normalized Form,
 * then auto-sets defaultDisplayMode based on the detected structure.
 *
 * Google Forms: fetches the real form via the dev proxy (no OAuth needed for
 * public forms). Microsoft Forms & SurveyMonkey fall back to mock data until
 * a backend OAuth integration is available.
 */
export async function importForm(
  platform: ImportPlatform,
  url: string,
): Promise<Form> {
  let form: Form;

  switch (platform) {
    case 'google': {
      const data = await fetchGoogleFormData(url);
      form = convertGoogleFormPublic(data);
      break;
    }
    case 'microsoft':
      form = convertMicrosoftForm();
      break;
    case 'surveymonkey':
      form = convertSurveyMonkeyForm();
      break;
  }

  // Set defaultDisplayMode based on structure
  const detectedMode: DisplayMode = resolveInitialMode(form);
  form = {
    ...form,
    settings: { ...form.settings, defaultDisplayMode: detectedMode },
  };

  return form;
}
