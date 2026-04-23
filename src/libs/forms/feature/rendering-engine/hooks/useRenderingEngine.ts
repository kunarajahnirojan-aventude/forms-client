import { useState, useEffect, useMemo } from 'react';
import type { Form, Question, DisplayMode } from '@/libs/forms/store/types';
import { resolveInitialMode } from '../resolveInitialMode';

interface PersistedState {
  answers: Record<string, unknown>;
  mode: DisplayMode;
}

function loadFromStorage(formId: string): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(`form-render-${formId}`);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

function saveToStorage(formId: string, state: PersistedState) {
  try {
    localStorage.setItem(`form-render-${formId}`, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

function clearStorage(formId: string) {
  try {
    localStorage.removeItem(`form-render-${formId}`);
  } catch {
    // Ignore
  }
}

export function useRenderingEngine(form: Form) {
  // Load persisted state once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const persisted = useMemo(() => loadFromStorage(form.id), [form.id]);

  const [mode, setModeState] = useState<DisplayMode>(
    persisted.mode ?? resolveInitialMode(form),
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(
    persisted.answers ?? {},
  );
  const [submitted, setSubmitted] = useState(false);

  // Flat question list for question-by-question mode (sections included as steps)
  const allQuestions = useMemo<Question[]>(
    () => form.pages.flatMap((p) => p.questions),
    [form.pages],
  );

  // Answerable questions (non-section) for progress numbering
  const answerableQuestions = useMemo(
    () => allQuestions.filter((q) => q.type !== 'section'),
    [allQuestions],
  );

  // Persist answers + mode on every change (skip after submit)
  useEffect(() => {
    if (!submitted) {
      saveToStorage(form.id, { answers, mode });
    }
  }, [answers, mode, form.id, submitted]);

  // ── Actions ──────────────────────────────────────────────────────────────

  function setMode(newMode: DisplayMode) {
    setModeState(newMode);
    setCurrentPageIndex(0);
    setCurrentQuestionIndex(0);
  }

  function setAnswer(qId: string, val: unknown) {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }

  function next() {
    if (mode === 'page') {
      setCurrentPageIndex((i) => Math.min(i + 1, form.pages.length - 1));
    } else if (mode === 'question') {
      setCurrentQuestionIndex((i) => Math.min(i + 1, allQuestions.length - 1));
    }
  }

  function prev() {
    if (mode === 'page') {
      setCurrentPageIndex((i) => Math.max(i - 1, 0));
    } else if (mode === 'question') {
      setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
    }
  }

  function submit() {
    setSubmitted(true);
    clearStorage(form.id);
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const canGoBack =
    mode === 'page'
      ? currentPageIndex > 0
      : mode === 'question'
        ? currentQuestionIndex > 0
        : false;

  const canGoNext =
    mode === 'page'
      ? currentPageIndex < form.pages.length - 1
      : mode === 'question'
        ? currentQuestionIndex < allQuestions.length - 1
        : false;

  // In 'all' mode the submit button is always the primary action
  const isLast =
    mode === 'page'
      ? currentPageIndex === form.pages.length - 1
      : mode === 'question'
        ? currentQuestionIndex === allQuestions.length - 1
        : true;

  const currentPage = form.pages[currentPageIndex] ?? null;
  const currentQuestion = allQuestions[currentQuestionIndex] ?? null;

  // Index among answerable (non-section) questions for display numbering
  const currentAnswerableIndex =
    mode === 'question' && currentQuestion?.type !== 'section'
      ? answerableQuestions.findIndex((q) => q.id === currentQuestion?.id)
      : -1;

  return {
    mode,
    setMode,
    currentPageIndex,
    currentQuestionIndex,
    answers,
    submitted,
    allQuestions,
    answerableQuestions,
    currentPage,
    currentQuestion,
    currentAnswerableIndex,
    canGoBack,
    canGoNext,
    isLast,
    setAnswer,
    next,
    prev,
    submit,
  };
}
