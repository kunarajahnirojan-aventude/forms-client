import { useMemo } from 'react';
import type { Form, Question, FormPage } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';

// ─────────────────────────────────────────────────────────────────────────────
// Summary types
// ─────────────────────────────────────────────────────────────────────────────

export interface ChoiceEntry {
  label: string;
  count: number;
}

export interface ScaleEntry {
  value: number;
  count: number;
}

export interface MatrixEntry {
  rowId: string;
  rowLabel: string;
  colId: string;
  colLabel: string;
  count: number;
}

export interface DateEntry {
  period: string; // YYYY-MM
  count: number;
}

export type QuestionSummary =
  | {
      kind: 'choice';
      question: Question;
      page: FormPage;
      data: ChoiceEntry[];
      totalAnswered: number;
    }
  | {
      kind: 'scale';
      question: Question;
      page: FormPage;
      data: ScaleEntry[];
      totalAnswered: number;
      min: number;
      max: number;
      mean: number;
      median: number;
    }
  | {
      kind: 'matrix';
      question: Question;
      page: FormPage;
      data: MatrixEntry[];
      totalAnswered: number;
    }
  | {
      kind: 'text-list';
      question: Question;
      page: FormPage;
      answers: string[];
      totalAnswered: number;
    }
  | {
      kind: 'date-hist';
      question: Question;
      page: FormPage;
      data: DateEntry[];
      totalAnswered: number;
    }
  | {
      kind: 'file-count';
      question: Question;
      page: FormPage;
      count: number;
      respondentCount: number;
    };

export interface PageCompletionEntry {
  pageId: string;
  pageTitle: string;
  count: number;
}

export interface FormSummaryStats {
  totalResponses: number;
  dateRange: { min: string; max: string } | null;
  pageCompletionCounts: PageCompletionEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function buildChoiceSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  const counts: Record<string, number> = {};

  if (question.type === 'yes_no') {
    counts['Yes'] = 0;
    counts['No'] = 0;
  } else {
    for (const opt of question.options ?? []) {
      counts[opt.label] = 0;
    }
  }

  let totalAnswered = 0;
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (ans === undefined || ans === null || ans === '') continue;
    totalAnswered++;
    if (question.type === 'yes_no') {
      const label = ans === 'yes' || ans === true ? 'Yes' : 'No';
      counts[label] = (counts[label] ?? 0) + 1;
    } else if (question.type === 'checkbox' && Array.isArray(ans)) {
      for (const v of ans as string[]) {
        counts[v] = (counts[v] ?? 0) + 1;
      }
    } else {
      const label = String(ans);
      counts[label] = (counts[label] ?? 0) + 1;
    }
  }

  const data: ChoiceEntry[] = Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  return { kind: 'choice', question, page, data, totalAnswered };
}

function buildScaleSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  const validation = question.validation as {
    maxRating?: number;
    min?: number;
    max?: number;
  };

  let rangeMin = 1;
  let rangeMax = 5;
  if (question.type === 'rating') {
    rangeMax = validation.maxRating ?? 5;
  } else if (question.type === 'linear_scale') {
    rangeMin = validation.min ?? 1;
    rangeMax = validation.max ?? 5;
  }

  const counts: Record<number, number> = {};
  for (let i = rangeMin; i <= rangeMax; i++) counts[i] = 0;

  const rawValues: number[] = [];
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (ans === undefined || ans === null || ans === '') continue;
    const n = Number(ans);
    if (!isNaN(n)) {
      counts[n] = (counts[n] ?? 0) + 1;
      rawValues.push(n);
    }
  }

  const sorted = [...rawValues].sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  const mean = sorted.length > 0 ? sum / sorted.length : 0;
  const med = median(sorted);
  const minVal = sorted[0] ?? rangeMin;
  const maxVal = sorted[sorted.length - 1] ?? rangeMax;

  const data: ScaleEntry[] = Object.entries(counts)
    .map(([v, c]) => ({ value: Number(v), count: c }))
    .sort((a, b) => a.value - b.value);

  return {
    kind: 'scale',
    question,
    page,
    data,
    totalAnswered: rawValues.length,
    min: minVal,
    max: maxVal,
    mean: Math.round(mean * 10) / 10,
    median: Math.round(med * 10) / 10,
  };
}

function buildMatrixSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  const rows = question.rows ?? [];
  const cols = question.columns ?? [];

  const counts: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    counts[row.id] = {};
    for (const col of cols) {
      counts[row.id][col.id] = 0;
    }
  }

  let totalAnswered = 0;
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (!ans || typeof ans !== 'object') continue;
    const map = ans as Record<string, unknown>;
    let hasAny = false;
    for (const row of rows) {
      const val = map[row.id];
      if (val === undefined || val === null) continue;
      hasAny = true;
      if (Array.isArray(val)) {
        for (const colId of val as string[]) {
          if (counts[row.id]?.[colId] !== undefined) {
            counts[row.id][colId]++;
          }
        }
      } else {
        const colId = String(val);
        if (counts[row.id]?.[colId] !== undefined) {
          counts[row.id][colId]++;
        }
      }
    }
    if (hasAny) totalAnswered++;
  }

  const data: MatrixEntry[] = [];
  for (const row of rows) {
    for (const col of cols) {
      data.push({
        rowId: row.id,
        rowLabel: row.label,
        colId: col.id,
        colLabel: col.label,
        count: counts[row.id]?.[col.id] ?? 0,
      });
    }
  }

  return { kind: 'matrix', question, page, data, totalAnswered };
}

function buildTextListSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  const answers: string[] = [];
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (ans === undefined || ans === null || ans === '') continue;
    answers.push(String(ans));
  }
  return {
    kind: 'text-list',
    question,
    page,
    answers,
    totalAnswered: answers.length,
  };
}

function buildDateHistSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  const counts: Record<string, number> = {};
  let totalAnswered = 0;
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (!ans || typeof ans !== 'string') continue;
    totalAnswered++;
    const period = ans.slice(0, 7); // YYYY-MM
    counts[period] = (counts[period] ?? 0) + 1;
  }

  const data: DateEntry[] = Object.entries(counts)
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return { kind: 'date-hist', question, page, data, totalAnswered };
}

function buildFileCountSummary(
  question: Question,
  page: FormPage,
  responses: FormResponse[],
): QuestionSummary {
  let count = 0;
  let respondentCount = 0;
  for (const r of responses) {
    const ans = r.answers[question.id];
    if (ans === undefined || ans === null || ans === '') continue;
    respondentCount++;
    if (Array.isArray(ans)) count += ans.length;
    else count++;
  }
  return { kind: 'file-count', question, page, count, respondentCount };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main hook
// ─────────────────────────────────────────────────────────────────────────────

export function useResponsesSummary(
  form: Form,
  responses: FormResponse[],
): { summaries: QuestionSummary[]; stats: FormSummaryStats } {
  return useMemo(() => {
    const summaries: QuestionSummary[] = [];

    for (const page of form.pages) {
      for (const question of page.questions) {
        if (question.type === 'section') continue;

        switch (question.type) {
          case 'radio':
          case 'dropdown':
          case 'yes_no':
          case 'checkbox':
            summaries.push(buildChoiceSummary(question, page, responses));
            break;
          case 'rating':
          case 'linear_scale':
            summaries.push(buildScaleSummary(question, page, responses));
            break;
          case 'matrix':
            summaries.push(buildMatrixSummary(question, page, responses));
            break;
          case 'text':
          case 'phone':
            summaries.push(buildTextListSummary(question, page, responses));
            break;
          case 'date':
            summaries.push(buildDateHistSummary(question, page, responses));
            break;
          case 'file_upload':
            summaries.push(buildFileCountSummary(question, page, responses));
            break;
        }
      }
    }

    // Form-level stats
    const dates = responses
      .map((r) => r.submittedAt)
      .filter(Boolean)
      .sort();
    const dateRange =
      dates.length > 0 ? { min: dates[0], max: dates[dates.length - 1] } : null;

    // Page completion: a page is "completed" if the respondent answered at
    // least one non-section question on that page
    const pageCompletionCounts: PageCompletionEntry[] = form.pages.map(
      (page) => {
        const nonSectionQIds = page.questions
          .filter((q) => q.type !== 'section')
          .map((q) => q.id);

        const count = responses.filter((r) =>
          nonSectionQIds.some((qId) => {
            const ans = r.answers[qId];
            return ans !== undefined && ans !== null && ans !== '';
          }),
        ).length;

        return { pageId: page.id, pageTitle: page.title, count };
      },
    );

    const stats: FormSummaryStats = {
      totalResponses: responses.length,
      dateRange,
      pageCompletionCounts,
    };

    return { summaries, stats };
  }, [form, responses]);
}
