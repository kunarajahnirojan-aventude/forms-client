import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormsStore, useFormEditor } from '@/store';
import { FormEditorView } from '@/libs/forms/ui/form-editor';
import { ROUTES } from '@/router/routes';

export default function FormsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();
  const { openEditor, activeFormId } = useFormEditor();

  const form = forms.find((f) => f.id === id);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.FORMS, { replace: true });
      return;
    }
    if (!form) {
      // Form not found → redirect to list
      navigate(ROUTES.FORMS, { replace: true });
      return;
    }
    openEditor(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!activeFormId || activeFormId !== id) {
    return (
      <div className='flex h-full items-center justify-center text-slate-400'>
        Loading editor…
      </div>
    );
  }

  return <FormEditorView />;
}
