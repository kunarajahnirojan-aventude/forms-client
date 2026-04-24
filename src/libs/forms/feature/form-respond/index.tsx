import { useParams, useNavigate } from 'react-router-dom';
import { useFormsStore } from '@/store';
import { FormRenderer } from '@/libs/forms/ui/form-renderer';
import { ROUTES } from '@/router/routes';

interface FormRespondPageProps {
  isPreview?: boolean;
}

export default function FormRespondPage({
  isPreview = false,
}: FormRespondPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();

  const form = forms.find((f) => f.id === id);

  if (!form) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4 bg-slate-50'>
        <p className='text-slate-400'>Form not found.</p>
        <button
          onClick={() => navigate(ROUTES.FORMS)}
          className='text-sm font-medium text-[#0B1AA0] hover:underline'
        >
          Back to forms
        </button>
      </div>
    );
  }

  return <FormRenderer form={form} isPreview={isPreview} />;
}
