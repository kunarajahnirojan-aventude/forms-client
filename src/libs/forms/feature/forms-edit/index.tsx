import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormsStore, useFormEditor } from '@/store';
import { SurveyEditorView } from '@/libs/forms/ui/form-editor';
import { ROUTES } from '@/router/routes';

export default function SurveysEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();
  const { openEditor, activeFormId } = useFormEditor();

  const form = forms.find((f) => f.id === id);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.SURVEYS, { replace: true });
      return;
    }
    if (!form) {
      navigate(ROUTES.SURVEYS, { replace: true });
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

  return <SurveyEditorView />;
}
