import type { Form, DisplayMode } from '@/libs/forms/store/types';
import { resolveInitialMode } from '@/libs/forms/feature/rendering-engine/resolveInitialMode';
import { convertGoogleForm } from './converters/googleForms';
import { convertMicrosoftForm } from './converters/microsoftForms';
import { convertSurveyMonkeyForm } from './converters/surveyMonkey';

export type ImportPlatform = 'google' | 'microsoft' | 'surveymonkey';

/**
 * Converts a platform mock into a normalized Form, then auto-sets
 * defaultDisplayMode based on the detected structure.
 */
export function importForm(platform: ImportPlatform): Form {
  let form: Form;

  switch (platform) {
    case 'google':
      form = convertGoogleForm();
      break;
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
