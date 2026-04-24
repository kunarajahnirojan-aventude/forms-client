import { useState, useEffect, useMemo } from 'react';
import type {
  Form,
  Question,
  DisplayMode,
  TextValidation,
  ChoiceValidation,
  MatrixValidation,
} from '@/libs/forms/store/types';
import { resolveInitialMode } from './resolveInitialMode';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Only clear the error once the new value is actually valid
    setErrors((prev) => {
      if (!prev[qId]) return prev;
      const question = allQuestions.find((q) => q.id === qId);
      if (!question) return prev;
      const stillInvalid = getQuestionError(question, val);
      if (stillInvalid) return prev; // keep error visible while value is still wrong
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function getQuestionError(q: Question, val: unknown): string | null {
    if (q.type === 'section') return null;

    if (q.required) {
      if (q.type === 'text' || q.type === 'phone') {
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
      if (tv?.subtype === 'number' && isNaN(Number(val.trim())))
        return 'Please enter a valid number.';
      if (tv?.maxLength && val.length > tv.maxLength)
        return `Maximum ${tv.maxLength} characters allowed.`;
    }

    if (q.type === 'checkbox' && Array.isArray(val) && val.length > 0) {
      const cv = q.validation as ChoiceValidation;
      if (cv?.minSelections && val.length < cv.minSelections)
        return `Please select at least ${cv.minSelections} option${
          cv.minSelections > 1 ? 's' : ''
        }.`;
      if (cv?.maxSelections && val.length > cv.maxSelections)
        return `Please select no more than ${cv.maxSelections} option${
          cv.maxSelections > 1 ? 's' : ''
        }.`;
    }

    return null;
  }

  function validateQuestions(questions: Question[]): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const q of questions) {
      const err = getQuestionError(q, answers[q.id]);
      if (err) errs[q.id] = err;
    }
    return errs;
  }

  function next() {
    if (mode === 'page') {
      const errs = validateQuestions(currentPage?.questions ?? []);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setCurrentPageIndex((i) => Math.min(i + 1, form.pages.length - 1));
    } else if (mode === 'question') {
      if (currentQuestion && currentQuestion.type !== 'section') {
        const err = getQuestionError(
          currentQuestion,
          answers[currentQuestion.id],
        );
        if (err) {
          setErrors({ [currentQuestion.id]: err });
          return;
        }
      }
      setErrors({});
      setCurrentQuestionIndex((i) => Math.min(i + 1, allQuestions.length - 1));
    }
  }

  function prev() {
    if (mode === 'page') {
      setCurrentPageIndex((i) => Math.max(i - 1, 0));
    } else if (mode === 'question') {
      setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
    }
    setErrors({});
  }

  /** Returns true if validation passed and the form was submitted. */
  function submit(): boolean {
    let errs: Record<string, string> = {};
    if (mode === 'all') {
      for (const page of form.pages) {
        Object.assign(errs, validateQuestions(page.questions));
      }
    } else if (mode === 'page') {
      errs = validateQuestions(currentPage?.questions ?? []);
    } else if (mode === 'question') {
      if (currentQuestion && currentQuestion.type !== 'section') {
        const err = getQuestionError(
          currentQuestion,
          answers[currentQuestion.id],
        );
        if (err) errs[currentQuestion.id] = err;
      }
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    setErrors({});
    setSubmitted(true);
    clearStorage(form.id);
    return true;
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
    errors,
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
