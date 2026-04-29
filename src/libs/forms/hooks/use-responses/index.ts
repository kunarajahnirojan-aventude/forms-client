import { useState, useMemo } from 'react';
import type { Form, Question } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';
import { generateMockResponses } from './mock-generator';

export interface ColumnFilter {
  questionId: string;
  value: string; // '' means no filter
}

export function useResponses(form: Form) {
  const responses = useMemo(
    () => generateMockResponses(form, form.responseCount || 8),
    [form],
  );

  // Flat answerable questions (no sections)
  const columns = useMemo<Question[]>(
    () =>
      form.pages
        .flatMap((p) => p.questions)
        .filter((q) => q.type !== 'section'),
    [form],
  );

  // Per-column filters (only dropdown/radio/checkbox/yes_no support filter UI)
  const [filters, setFilters] = useState<Record<string, string>>({});

  function setFilter(questionId: string, value: string) {
    setFilters((prev) => ({ ...prev, [questionId]: value }));
  }

  function clearFilters() {
    setFilters({});
  }

  const filteredResponses = useMemo<FormResponse[]>(() => {
    return responses.filter((r) => {
      for (const [qId, filterVal] of Object.entries(filters)) {
        if (!filterVal) continue;
        const answer = r.answers[qId];
        if (Array.isArray(answer)) {
          // checkbox: filter if none of the selections match
          if (!answer.includes(filterVal)) return false;
        } else if (typeof answer === 'string') {
          if (answer !== filterVal) return false;
        }
      }
      return true;
    });
  }, [responses, filters]);

  return {
    columns,
    responses: filteredResponses,
    totalCount: responses.length,
    filters,
    setFilter,
    clearFilters,
  };
}
