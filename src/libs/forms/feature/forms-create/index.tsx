import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useFormsStore, useFormEditor } from '@/store';
import { FormSetupView } from '@/libs/forms/ui/form-setup/form-setup-view';
import { formsEditPath } from '@/router/routes';
import type { Form } from '@/libs/forms/store/types';

export default function SurveysCreatePage() {
  const navigate = useNavigate();
  const { addForm } = useFormsStore();
  const { openEditor } = useFormEditor();

  function handleSetupSubmit(title: string, description: string) {
    const id = nanoid();
    const now = new Date().toISOString();
    const newForm: Form = {
      id,
      title,
      description,
      status: 'draft',
      pages: [{ id: nanoid(), title: 'Page 1', questions: [] }],
      settings: {
        acceptingResponses: true,
        confirmationMessage: 'Thank you for completing this survey.',
        showProgressBar: false,
        allowMultipleSubmissions: false,
        requireSignIn: false,
        shuffleQuestions: false,
      },
      theme: {
        color: 'blue',
        fontFamily: 'system',
        darkMode: false,
      },
      responseCount: 0,
      createdAt: now,
      updatedAt: now,
      shareToken: nanoid(12),
    };
    addForm(newForm);
    openEditor(id);
    navigate(formsEditPath(id), { replace: true });
  }

  return <FormSetupView onSubmit={handleSetupSubmit} />;
}
