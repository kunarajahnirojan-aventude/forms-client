import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Form } from '@/libs/forms/store/types';
import { useRenderingEngine } from '@/libs/forms/hooks/use-rendering-engine';
import { ModeSwitcher } from './mode-switcher';
import { PageModeRenderer } from './modes/page-mode-renderer';
import { QuestionModeRenderer } from './modes/question-mode-renderer';
import { AllModeRenderer } from './modes/all-mode-renderer';

// ── Theme gradients (mirrors survey-preview) ──────────────────────────────────
const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-[#0B1AA0] via-indigo-600 to-blue-500',
  purple: 'from-purple-700 via-violet-600 to-purple-400',
  green: 'from-emerald-700 via-teal-600 to-emerald-400',
  orange: 'from-orange-600 via-rose-500 to-orange-400',
  pink: 'from-pink-700 via-fuchsia-600 to-pink-400',
  slate: 'from-slate-700 via-slate-600 to-slate-500',
  custom: 'from-indigo-700 via-purple-600 to-indigo-400',
};

// ── Confetti ──────────────────────────────────────────────────────────────────
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

// ── FormRenderer ──────────────────────────────────────────────────────────────

interface FormRendererProps {
  form: Form;
}

export function FormRenderer({ form }: FormRendererProps) {
  const engine = useRenderingEngine(form);
  const [showConfetti, setShowConfetti] = useState(false);

  const gradient = GRADIENT_MAP[form.theme.color] ?? GRADIENT_MAP.blue;

  function handleSubmit() {
    const ok = engine.submit();
    if (ok) setShowConfetti(true);
  }

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3800);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  // ── Submitted screen ────────────────────────────────────────────────────────
  if (engine.submitted) {
    return (
      <div className='flex min-h-screen flex-col bg-slate-50'>
        {showConfetti && <Confetti />}
        <div
          className={`bg-gradient-to-r ${gradient} px-6 py-12 text-center text-white`}
        >
          <h1 className='text-2xl font-bold'>{form.title}</h1>
        </div>
        <div className='flex flex-1 items-center justify-center p-8'>
          <div className='max-w-md text-center'>
            <CheckCircle2 className='mx-auto mb-4 h-16 w-16 text-[#0B1AA0]' />
            <h2 className='mb-2 text-2xl font-bold text-slate-900'>
              Thank you!
            </h2>
            <p className='text-slate-500'>
              {form.settings.confirmationMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main renderer ───────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${gradient} px-6 py-10 text-white`}>
        <div className='mx-auto max-w-2xl'>
          <h1 className='text-2xl font-bold'>{form.title}</h1>
          {form.description && (
            <p className='mt-1.5 text-sm text-white/80'>{form.description}</p>
          )}
          <div className='mt-5'>
            <ModeSwitcher mode={engine.mode} onChange={engine.setMode} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-2xl px-4 py-8'>
        {engine.mode === 'page' && (
          <PageModeRenderer
            form={form}
            engine={engine}
            onSubmit={handleSubmit}
          />
        )}
        {engine.mode === 'question' && (
          <QuestionModeRenderer
            form={form}
            engine={engine}
            onSubmit={handleSubmit}
          />
        )}
        {engine.mode === 'all' && (
          <AllModeRenderer
            form={form}
            engine={engine}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
