import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useFormsStore } from '@/store';
import { formsEditPath } from '@/router/routes';
import { TextQuestion } from '@/libs/forms/ui/form-editor/question-types/TextQuestion';
import { ChoiceQuestion } from '@/libs/forms/ui/form-editor/question-types/ChoiceQuestion';
import { DateQuestion } from '@/libs/forms/ui/form-editor/question-types/DateQuestion';
import { RatingQuestion } from '@/libs/forms/ui/form-editor/question-types/RatingQuestion';
import { LinearScaleQuestion } from '@/libs/forms/ui/form-editor/question-types/LinearScaleQuestion';
import { SectionQuestion } from '@/libs/forms/ui/form-editor/question-types/SectionQuestion';
import { FileQuestion } from '@/libs/forms/ui/form-editor/question-types/FileQuestion';
import { YesNoQuestion } from '@/libs/forms/ui/form-editor/question-types/YesNoQuestion';
import { MatrixQuestion } from '@/libs/forms/ui/form-editor/question-types/MatrixQuestion';
import { PhoneQuestion } from '@/libs/forms/ui/form-editor/question-types/PhoneQuestion';
import type {
  Question,
  TextValidation,
  ChoiceValidation,
  MatrixValidation,
} from '@/libs/forms/store/types';
import { cn } from '@/utils';

/* ── theme gradients ───────────────────────────────────────────────────── */
const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-[#0B1AA0] via-indigo-600 to-blue-500',
  purple: 'from-purple-700 via-violet-600 to-purple-400',
  green: 'from-emerald-700 via-teal-600 to-emerald-400',
  orange: 'from-orange-600 via-rose-500 to-orange-400',
  pink: 'from-pink-700 via-fuchsia-600 to-pink-400',
  slate: 'from-slate-700 via-slate-600 to-slate-500',
  custom: 'from-indigo-700 via-purple-600 to-indigo-400',
};

/* ── question renderer ─────────────────────────────────────────────────── */
function QuestionBody({
  question,
  value,
  onAnswer,
}: {
  question: Question;
  value: unknown;
  onAnswer: (v: unknown) => void;
}) {
  const props = { question, value, onAnswer };
  switch (question.type) {
    case 'text':
      return <TextQuestion {...props} />;
    case 'phone':
      return <PhoneQuestion {...props} />;
    case 'radio':
      return <ChoiceQuestion {...props} type='radio' />;
    case 'checkbox':
      return <ChoiceQuestion {...props} type='checkbox' />;
    case 'dropdown':
      return <ChoiceQuestion {...props} type='dropdown' />;
    case 'date':
      return <DateQuestion {...props} />;
    case 'rating':
      return <RatingQuestion {...props} />;
    case 'linear_scale':
      return <LinearScaleQuestion {...props} />;
    case 'file_upload':
      return <FileQuestion {...props} />;
    case 'section':
      return <SectionQuestion question={question} />;
    case 'yes_no':
      return <YesNoQuestion {...props} />;
    case 'matrix':
      return <MatrixQuestion {...props} />;
    default:
      return null;
  }
}

/* ── confetti ──────────────────────────────────────────────────────────── */
const CONFETTI_COLORS = [
  '#0B1AA0',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#3b82f6',
];

function Confetti() {
  return (
    <div className='pointer-events-none fixed inset-0 z-50 overflow-hidden'>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 60 }, (_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const isCircle = i % 4 === 0;
        const size = 6 + (i % 4) * 3;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: `${(i * 7.3 + 3) % 100}%`,
              width: `${isCircle ? size : size * 0.55}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: isCircle ? '50%' : '2px',
              animation: `confettiFall ${2.4 + (i % 5) * 0.25}s ${(i * 0.06) % 2}s ease-in 1 forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────────────────── */
export default function SurveyPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forms } = useFormsStore();

  // -1 = intro, 0..n-1 = form pages, 'done' = congratulations
  const [step, setStep] = useState<number | 'done'>(-1);
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Answer + validation state ────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Flat list of all questions for lookup
  const allPreviewQuestions = useMemo(
    () => form?.pages.flatMap((p) => p.questions) ?? [],
    [form],
  );

  function setAnswer(qId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    // Only clear the error once the new value is actually valid
    setErrors((prev) => {
      if (!prev[qId]) return prev;
      const question = allPreviewQuestions.find((q) => q.id === qId);
      if (!question) return prev;
      const stillInvalid = getQuestionError(question, value);
      if (stillInvalid) return prev;
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });
  }

  function getQuestionError(q: Question, val: unknown): string | null {
    if (q.type === 'section') return null;

    // ── Required check ───────────────────────────────────────────────────
    if (q.required) {
      if (q.type === 'text') {
        if (typeof val !== 'string' || val.trim() === '')
          return 'This field is required.';
      } else if (q.type === 'phone') {
        if (typeof val !== 'string' || val.trim() === '')
          return 'This field is required.';
      } else if (
        q.type === 'radio' ||
        q.type === 'dropdown' ||
        q.type === 'yes_no'
      ) {
        if (typeof val !== 'string' || val === '')
          return 'Please select an option.';
      } else if (q.type === 'checkbox') {
        if (!Array.isArray(val) || val.length === 0)
          return 'Please select at least one option.';
      } else if (q.type === 'date') {
        if (typeof val !== 'string' || val === '')
          return 'Please select a date.';
      } else if (q.type === 'rating' || q.type === 'linear_scale') {
        if (typeof val !== 'number') return 'Please provide a rating.';
      } else if (q.type === 'matrix') {
        const mv = q.validation as MatrixValidation;
        const rows = q.rows ?? [];
        const rv = (val ?? {}) as Record<string, unknown>;
        const hasGap = rows.some((r) => {
          const cell = rv[r.id];
          return (
            cell === undefined ||
            cell === null ||
            (Array.isArray(cell) && cell.length === 0) ||
            (mv?.multiplePerRow === false && typeof cell !== 'string')
          );
        });
        if (hasGap) return 'Please answer all rows.';
      } else if (q.type === 'file_upload') {
        if (!val) return 'Please upload a file.';
      }
    }

    // ── Format validation (even when not required, if a value was entered) ─
    if (q.type === 'text' && typeof val === 'string' && val.trim() !== '') {
      const tv = q.validation as TextValidation;
      if (
        tv?.subtype === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
      )
        return 'Please enter a valid email address.';
      if (tv?.subtype === 'url') {
        try {
          new URL(val.trim());
        } catch {
          return 'Please enter a valid URL (e.g. https://…).';
        }
      }
      if (tv?.subtype === 'number' && (val.trim() === '' || isNaN(Number(val))))
        return 'Please enter a valid number.';
      if (tv?.maxLength && val.length > tv.maxLength)
        return `Maximum ${tv.maxLength} characters allowed.`;
    }

    // ── Checkbox min / max selections ────────────────────────────────────
    if (q.type === 'checkbox' && Array.isArray(val) && val.length > 0) {
      const cv = q.validation as ChoiceValidation;
      if (cv?.minSelections && val.length < cv.minSelections)
        return `Please select at least ${cv.minSelections} option${cv.minSelections > 1 ? 's' : ''}.`;
      if (cv?.maxSelections && val.length > cv.maxSelections)
        return `Please select no more than ${cv.maxSelections} option${cv.maxSelections > 1 ? 's' : ''}.`;
    }

    return null;
  }

  function validatePage(questions: Question[]): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const q of questions) {
      const err = getQuestionError(q, answers[q.id]);
      if (err) errs[q.id] = err;
    }
    return errs;
  }

  const survey = forms.find((f) => f.id === id);

  useEffect(() => {
    cardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3800);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  if (!survey) {
    return (
      <div className='flex h-screen items-center justify-center text-slate-400'>
        Survey not found.
      </div>
    );
  }

  const totalPages = survey.pages.length;
  const pageIdx = typeof step === 'number' && step >= 0 ? step : 0;
  const currentPage =
    typeof step === 'number' && step >= 0 ? survey.pages[step] : null;
  const gradient = GRADIENT_MAP[survey.theme.color] ?? GRADIENT_MAP.blue;
  const isIntro = step === -1;
  const isLast = typeof step === 'number' && step === totalPages - 1;
  const isDone = step === 'done';
  const totalQuestions = survey.pages.reduce(
    (s, p) => s + p.questions.length,
    0,
  );

  function handleNext() {
    if (!currentPage) return;
    const errs = validatePage(currentPage.questions);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      cardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setStep((i) => (typeof i === 'number' ? i + 1 : i));
  }

  function handleSubmit() {
    if (!currentPage) return;
    const errs = validatePage(currentPage.questions);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      cardRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setStep('done');
    setShowConfetti(true);
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200'>
      {showConfetti && <Confetti />}

      {/* ── Preview banner ─────────────────────────────────────────── */}
      <div className='sticky top-0 z-20 flex items-center justify-between border-b border-amber-200/60 bg-amber-50/95 px-4 py-2 backdrop-blur-sm'>
        <button
          onClick={() => navigate(formsEditPath(id!))}
          className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900'
        >
          <ArrowLeft className='h-3.5 w-3.5' />
          Back to editor
        </button>
        <div className='flex items-center gap-1.5 rounded-full bg-amber-200/70 px-3 py-1 text-xs font-semibold text-amber-800'>
          <Sparkles className='h-3 w-3' />
          Preview Mode
        </div>
        <button
          onClick={() => window.close()}
          className='rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-100'
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          'relative flex-shrink-0 overflow-hidden bg-gradient-to-br',
          gradient,
        )}
      >
        <div
          className='absolute inset-0 opacity-[0.07]'
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className='relative px-8 pb-16 pt-10 text-center'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-white/60'>
            {totalPages} page{totalPages !== 1 ? 's' : ''} · {totalQuestions}{' '}
            question{totalQuestions !== 1 ? 's' : ''}
          </p>
          <h1 className='text-3xl font-extrabold text-white drop-shadow-sm'>
            {survey.title || 'Untitled Survey'}
          </h1>
        </div>
      </div>

      {/* ── Card ───────────────────────────────────────────────────── */}
      <div className='mx-auto w-full max-w-2xl -translate-y-10 px-4 pb-16'>
        <div
          ref={cardRef}
          className='overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-400/25 ring-1 ring-slate-200/80'
        >
          {/* ── CONGRATULATIONS ─────────────────────────────────────── */}
          {isDone && (
            <div className='flex flex-col items-center px-8 py-14 text-center'>
              {/* Pulsing success badge */}
              <div className='relative mb-5 flex h-28 w-28 items-center justify-center'>
                <div
                  className={cn(
                    'absolute inset-0 animate-ping rounded-full bg-gradient-to-br opacity-20 [animation-duration:1.4s]',
                    gradient,
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-2 rounded-full bg-gradient-to-br opacity-10',
                    gradient,
                  )}
                />
                <div
                  className={cn(
                    'relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-xl',
                    gradient,
                  )}
                >
                  <CheckCircle2 className='h-12 w-12' strokeWidth={1.8} />
                </div>
              </div>

              <div className='mb-3 text-5xl'>🎉</div>

              <p className='mb-3 mt-3 text-lg font-semibold text-[#0B1AA0]'>
                Survey submitted successfully
              </p>
              <p className='mx-auto max-w-sm text-sm leading-relaxed text-slate-500'>
                Amazing work! Your thoughtful responses have been recorded.
                Every answer helps create something better — thank you for
                making your voice heard! 🚀
              </p>

              <div className='mt-9 flex items-center gap-3'>
                <button
                  onClick={() => {
                    setStep(-1);
                    setShowConfetti(false);
                    setAnswers({});
                    setErrors({});
                  }}
                  className='rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50'
                >
                  ↩ Start Over
                </button>
                <button
                  onClick={() => navigate(formsEditPath(id!))}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110',
                    `bg-gradient-to-r ${gradient}`,
                  )}
                >
                  Back to Editor
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>

              <p className='mt-6 text-xs text-slate-300'>
                Preview only — responses are not saved
              </p>
            </div>
          )}

          {/* ── INTRO ───────────────────────────────────────────────── */}
          {isIntro && (
            <div className='px-8 py-9'>
              {survey.description ? (
                <div
                  className='rich-text-content mb-7 text-sm leading-relaxed text-slate-600'
                  dangerouslySetInnerHTML={{ __html: survey.description }}
                />
              ) : (
                <p className='mb-7 text-sm italic text-slate-400'>
                  No description provided.
                </p>
              )}

              <div className='mb-7 flex flex-wrap gap-2.5'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                  📋 {totalPages} page{totalPages !== 1 ? 's' : ''}
                </span>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                  ❓ {totalQuestions} question
                  {totalQuestions !== 1 ? 's' : ''}
                </span>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'>
                  🔒 Private &amp; secure
                </span>
              </div>

              <p className='mb-6 text-xs text-slate-400'>
                By clicking continue you agree to share your responses for this
                survey.
              </p>

              <button
                onClick={() => setStep(0)}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110',
                  `bg-gradient-to-r ${gradient}`,
                )}
              >
                I Agree &amp; Continue
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          )}

          {/* ── QUESTION PAGES ──────────────────────────────────────── */}
          {!isIntro && !isDone && currentPage && (
            <>
              {/* Progress + page header */}
              <div className='border-b border-slate-100 bg-white px-8 pb-5 pt-6'>
                <div className='mb-3 flex items-center gap-1.5'>
                  {survey.pages.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-all duration-500',
                        i < pageIdx
                          ? 'bg-[#0B1AA0]'
                          : i === pageIdx
                            ? `bg-gradient-to-r ${gradient}`
                            : 'bg-slate-200',
                      )}
                    />
                  ))}
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl font-bold text-slate-900'>
                      {currentPage.title}
                    </h2>
                    {currentPage.description && (
                      <p className='mt-0.5 text-sm text-slate-500'>
                        {currentPage.description}
                      </p>
                    )}
                  </div>
                  <span className='ml-4 shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500'>
                    {pageIdx + 1} / {totalPages}
                  </span>
                </div>
              </div>

              {/* Questions */}
              <div className='px-8 py-7'>
                {currentPage.questions.length === 0 ? (
                  <div className='py-14 text-center'>
                    <div className='mb-3 text-4xl'>📭</div>
                    <p className='text-sm text-slate-400'>
                      No questions on this page yet.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {currentPage.questions.map((q, idx) => {
                      if (q.type === 'section') {
                        return (
                          <div
                            key={q.id}
                            className='border-l-4 border-[#0B1AA0]/30 pl-4 pt-1'
                          >
                            <h3 className='text-base font-semibold text-slate-800'>
                              {q.title || `Section ${idx + 1}`}
                            </h3>
                            <SectionQuestion question={q} />
                          </div>
                        );
                      }
                      const hasError = !!errors[q.id];
                      return (
                        <div
                          key={q.id}
                          className={cn(
                            'rounded-xl border p-5 transition-all',
                            hasError
                              ? 'border-red-300 bg-red-50/40 shadow-sm'
                              : 'border-slate-100 bg-slate-50/60 hover:shadow-sm',
                          )}
                        >
                          <div className='mb-3.5 flex items-start gap-3'>
                            <span
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white',
                                hasError
                                  ? 'bg-red-400'
                                  : `bg-gradient-to-br ${gradient}`,
                              )}
                            >
                              {idx + 1}
                            </span>
                            <div className='flex-1'>
                              <p className='text-sm font-semibold text-slate-800'>
                                {q.title || 'Untitled question'}
                                {q.required && (
                                  <span className='ml-1 text-red-500'>*</span>
                                )}
                              </p>
                              {q.description && q.showDescription && (
                                <p className='mt-0.5 text-xs text-slate-500'>
                                  {q.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className='pl-9'>
                            <QuestionBody
                              question={q}
                              value={answers[q.id]}
                              onAnswer={(v) => setAnswer(q.id, v)}
                            />
                          </div>
                          {hasError && (
                            <div className='mt-2.5 flex items-center gap-1.5 pl-9 text-xs font-medium text-red-500'>
                              <AlertCircle className='h-3.5 w-3.5 shrink-0' />
                              {errors[q.id]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className='flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-8 py-4'>
                <button
                  onClick={() =>
                    setStep((i) => (typeof i === 'number' ? i - 1 : i))
                  }
                  className='flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50'
                >
                  <ChevronLeft className='h-4 w-4' />
                  {pageIdx === 0 ? 'Intro' : 'Previous'}
                </button>

                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110',
                      `bg-gradient-to-r ${gradient}`,
                    )}
                  >
                    Submit Form
                    <CheckCircle2 className='h-4 w-4' />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110',
                      `bg-gradient-to-r ${gradient}`,
                    )}
                  >
                    Next Page
                    <ChevronRight className='h-4 w-4' />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
