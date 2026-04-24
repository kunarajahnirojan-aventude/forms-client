import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import type { ImportPlatform } from '@/libs/forms/hooks/importing';

// ── URL validation ───────────────────────────────────────────────────────────

const GOOGLE_URL_PATTERN =
  /^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/).+/i;
const GOOGLE_URL_HINT =
  'Must start with https://docs.google.com/forms/ or https://forms.gle/';

function validateUrl(url: string): string | null {
  if (!url.trim()) return 'Please enter a URL.';
  try {
    new URL(url);
  } catch {
    return 'Please enter a valid URL (e.g. https://…).';
  }
  if (!GOOGLE_URL_PATTERN.test(url)) {
    return GOOGLE_URL_HINT;
  }
  return null;
}

const MODE_LABELS: Record<string, string> = {
  page: 'Page by page',
  question: 'Question by question',
  all: 'All in one page',
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface ImportFormModalProps {
  onClose: () => void;
  onImport: (platform: ImportPlatform, url: string) => Promise<Form>;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlTouched, setUrlTouched] = useState(false);
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

  async function handleImport() {
    const error = validateUrl(url);
    setUrlTouched(true);
    setUrlError(error);
    if (error) return;
    setLoading(true);
    try {
      const form = await onImport('google', url);
      setImportedForm(form);
      setStep(2);
    } catch (err) {
      setUrlError(
        err instanceof Error ? err.message : 'Import failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

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

        {/* ── Step 1: URL input ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className='p-8'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg border-2 bg-blue-50 border-blue-200 text-lg font-bold text-blue-600'>
                G
              </div>
              <div>
                <h2 className='text-lg font-bold text-slate-900'>
                  Import from Google Forms
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
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlTouched) setUrlError(validateUrl(e.target.value));
                }}
                onBlur={() => {
                  setUrlTouched(true);
                  setUrlError(validateUrl(url));
                }}
                placeholder='https://docs.google.com/forms/d/…/viewform'
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 ${
                  urlTouched && urlError
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-200 focus:border-[#0B1AA0] focus:ring-[#0B1AA0]/20'
                }`}
              />
              {urlTouched && urlError ? (
                <p className='mt-1.5 text-xs text-red-500'>{urlError}</p>
              ) : (
                <p className='mt-1.5 text-xs text-slate-400'>
                  Paste the URL of a public Google Form (sign-in not required).
                </p>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className='w-full rounded-lg bg-[#0B1AA0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0a179a] disabled:opacity-60'
            >
              {loading ? 'Importing…' : 'Import Form'}
            </button>
          </div>
        )}

        {/* ── Step 2: Success summary ────────────────────────────────────── */}
        {step === 2 && importedForm && (
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
