import { useParams, useNavigate } from 'react-router-dom';
import { useFormsStore } from '@/store';
import { FormRenderer } from '@/libs/forms/ui/form-renderer';

export default function RenderingEnginePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();

  const form = forms.find((f) => f.id === id);

  if (!form) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4 bg-slate-50'>
        <p className='text-slate-400'>Form not found.</p>
        <button
          onClick={() => navigate('/surveys')}
          className='text-sm font-medium text-[#0B1AA0] hover:underline'
        >
          Back to surveys
        </button>
      </div>
    );
  }

  return <FormRenderer form={form} />;
}
