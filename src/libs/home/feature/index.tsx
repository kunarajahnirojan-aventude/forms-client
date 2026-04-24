import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center bg-white px-4'>
      {/* Top accent bar */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#0B1AA0]' />

      <div className='flex w-full max-w-4xl flex-col items-center text-center'>
        {/* Badge */}

        {/* Headline */}
        <h1 className='text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl'>
          Admin Workspace
        </h1>
        <p className='mt-5 max-w-xl text-base text-slate-500'>
          Internal tools for the team. Select a module below to manage surveys,
          cases, and operations.
        </p>

        {/* Product cards */}
        <div className='mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2'>
          {/* Surveys card */}
          <button
            onClick={() => navigate(ROUTES.FORMS)}
            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:border-[#0B1AA0]/30 hover:shadow-lg'
          >
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1AA0]/10 ring-1 ring-[#0B1AA0]/20 transition-colors group-hover:bg-[#0B1AA0]/15'>
              <FileText className='h-6 w-6 text-[#0B1AA0]' />
            </div>
            <h2 className='text-lg font-semibold text-slate-900'>Surveys</h2>
            <p className='mt-2 text-sm leading-relaxed text-slate-500'>
              Create multi-page surveys, manage questions per page, collect
              staff or client responses, and review submission data.
            </p>
            <div className='mt-6 flex items-center gap-1.5 text-sm font-medium text-[#0B1AA0] opacity-0 transition-all duration-200 group-hover:opacity-100'>
              Open Surveys{' '}
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </div>
          </button>

          {/* Case Handler card */}
          <button
            onClick={() => (window.location.href = '/case-handler')}
            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:border-violet-300/60 hover:shadow-lg'
          >
            <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-200 transition-colors group-hover:bg-violet-100'>
              <Briefcase className='h-6 w-6 text-violet-600' />
            </div>
            <h2 className='text-lg font-semibold text-slate-900'>
              Case Handler
            </h2>
            <p className='mt-2 text-sm leading-relaxed text-slate-500'>
              Track, assign, and resolve operational cases. Manage workloads and
              collaborate with your team in one place.
            </p>
            <div className='mt-6 flex items-center gap-1.5 text-sm font-medium text-violet-600 opacity-0 transition-all duration-200 group-hover:opacity-100'>
              Open Case Handler{' '}
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
