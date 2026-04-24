import { useFormsStore } from '@/store';
import { importForm, type ImportPlatform } from '@/libs/forms/hooks/importing';
import type { Form } from '@/libs/forms/store/types';

/**
 * Calls the importer for the given platform and URL, persists the result
 * to the forms store, and returns the saved Form.
 */
export function useImportForm() {
  const { addForm } = useFormsStore();

  async function importAndSave(
    platform: ImportPlatform,
    url: string,
  ): Promise<Form> {
    const form = await importForm(platform, url);
    addForm(form);
    return form;
  }

  return { importAndSave };
}
