import { useFormsStore } from '@/store';
import {
  importForm,
  type ImportPlatform,
} from '@/libs/forms/feature/importing/importForm';
import type { Form } from '@/libs/forms/store/types';

/**
 * Calls the mock importer for the given platform, persists the result
 * to the forms store, and returns the saved Form.
 */
export function useImportForm() {
  const { addForm } = useFormsStore();

  function importAndSave(platform: ImportPlatform): Form {
    const form = importForm(platform);
    addForm(form);
    return form;
  }

  return { importAndSave };
}
