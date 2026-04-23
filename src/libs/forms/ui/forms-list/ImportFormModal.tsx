import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Check, ExternalLink } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import type { ImportPlatform } from '@/libs/forms/feature/importing/importForm';

// ── Platform definitions ──────────────────────────────────────────────────────

const PLATFORMS: {
  id: ImportPlatform;
  name: string;
  tagline: string;
  color: string;
  bg: string;
  initial: string;
}[] = [
  {
    id: 'google',
    name: 'Google Forms',
    tagline: 'Import from Google Forms',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    initial: 'G',
  },
  {
    id: 'microsoft',
    name: 'Microsoft Forms',
    tagline: 'Import from Microsoft Forms',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    initial: 'M',
  },
  {
    id: 'surveymonkey',
    name: 'Survey Monkey',
    tagline: 'Import from Survey Monkey',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    initial: 'S',
  },
];

const MODE_LABELS: Record<string, string> = {
  page: 'Page by page',
  question: 'Question by question',
  all: 'All in one page',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface ImportFormModalProps {
  onClose: () => void;
  onImport: (platform: ImportPlatform) => Form;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function ImportFormModal({
  onClose,
  onImport,
  onEdit,
  onPreview,
}: ImportFormModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [platform, setPlatform] = useState<ImportPlatform | null>(null);
  const [url, setUrl] = useState('');
  const [importedForm, setImportedForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSelectPlatform(p: ImportPlatform) {
    setPlatform(p);
    setStep(2);
  }

  async function handleLoadSample() {
    if (!platform) return;
    setLoading(true);
    // Simulate a brief async fetch
    await new Promise((r) => setTimeout(r, 600));
    const form = onImport(platform);
    setImportedForm(form);
    setLoading(false);
    setStep(3);
  }

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform);
  const totalQuestions = importedForm?.pages.reduce(
    (sum, page) =>
      sum + page.questions.filter((q) => q.type !== 'section').length,
    0,
  );

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className='relative w-full max-w-lg rounded-2xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
          aria-label='Close'
        >
          <X className='h-5 w-5' />
        </button>

        {/* ── Step 1: Platform picker ────────────────────────────────────── */}
        {step === 1 && (
          <div className='p-8'>
            <h2 className='text-xl font-bold text-slate-900'>Import a Form</h2>
            <p className='mt-1.5 text-sm text-slate-500'>
              Choose the platform you want to import from. We'll load a sample
              form for you.
            </p>

            <div className='mt-6 space-y-3'>
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlatform(p.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition-all hover:shadow-sm ${p.bg} hover:border-current`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 ${p.bg} ${p.color} text-lg font-bold`}
                  >
                    {p.initial}
                  </div>
                  <div>
                    <p className={`font-semibold ${p.color}`}>{p.name}</p>
                    <p className='text-xs text-slate-500'>{p.tagline}</p>
                  </div>
                  <ExternalLink className='ml-auto h-4 w-4 text-slate-300' />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: URL input ──────────────────────────────────────────── */}
        {step === 2 && selectedPlatform && (
          <div className='p-8'>
            <button
              onClick={() => setStep(1)}
              className='mb-5 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700'
            >
              <ArrowLeft className='h-4 w-4' />
              Back
            </button>

            <div className={`mb-5 flex items-center gap-3`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 ${selectedPlatform.bg} ${selectedPlatform.color} text-lg font-bold`}
              >
                {selectedPlatform.initial}
              </div>
              <div>
                <h2 className='text-lg font-bold text-slate-900'>
                  {selectedPlatform.name}
                </h2>
                <p className='text-xs text-slate-500'>
                  Paste your form link below
                </p>
              </div>
            </div>

            <div className='mb-4'>
              <label className='mb-1.5 block text-sm font-medium text-slate-700'>
                Form URL
              </label>
              <input
                type='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={`https://forms.${selectedPlatform.id === 'google' ? 'gle' : selectedPlatform.id === 'microsoft' ? 'office.com' : 'surveymonkey.com'}/...`}
                className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#0B1AA0] focus:outline-none focus:ring-2 focus:ring-[#0B1AA0]/20'
              />
              <p className='mt-1.5 text-xs text-slate-400'>
                We'll load a sample form to demonstrate the import. Live
                fetching requires a backend proxy.
              </p>
            </div>

            <button
              onClick={handleLoadSample}
              disabled={loading}
              className='w-full rounded-lg bg-[#0B1AA0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a] disabled:opacity-60'
            >
              {loading ? 'Loading sample…' : 'Load Sample Form'}
            </button>
          </div>
        )}

        {/* ── Step 3: Success summary ────────────────────────────────────── */}
        {step === 3 && importedForm && (
          <div className='p-8'>
            <div className='mb-5 flex items-center gap-2 text-emerald-600'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100'>
                <Check className='h-5 w-5' />
              </div>
              <span className='text-sm font-semibold'>Import successful</span>
            </div>

            <div className='mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4'>
              <h3 className='font-semibold text-slate-900'>
                {importedForm.title}
              </h3>
              {importedForm.description && (
                <p className='mt-1 text-xs text-slate-500 line-clamp-2'>
                  {importedForm.description}
                </p>
              )}
              <div className='mt-3 flex flex-wrap gap-3'>
                <Chip
                  label={`${importedForm.pages.length} page${importedForm.pages.length !== 1 ? 's' : ''}`}
                />
                <Chip
                  label={`${totalQuestions} question${totalQuestions !== 1 ? 's' : ''}`}
                />
                <Chip
                  label={`Mode: ${MODE_LABELS[importedForm.settings.defaultDisplayMode ?? 'all'] ?? 'All in one page'}`}
                  highlight
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => onEdit(importedForm.id)}
                className='flex-1 rounded-lg border border-[#0B1AA0] py-2.5 text-sm font-semibold text-[#0B1AA0] transition-colors hover:bg-[#0B1AA0]/5'
              >
                Edit Form
              </button>
              <button
                onClick={() => onPreview(importedForm.id)}
                className='flex-1 rounded-lg bg-[#0B1AA0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a]'
              >
                Preview Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        highlight
          ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
          : 'bg-slate-200 text-slate-600'
      }`}
    >
      {label}
    </span>
  );
}
