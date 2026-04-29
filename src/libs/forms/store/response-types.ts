// ─────────────────────────────────────────────────────────────────────────────
// Form Response types
// ─────────────────────────────────────────────────────────────────────────────

/** A single respondent's answers. Key = questionId, value = their answer. */
export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string; // ISO string
  answers: Record<string, unknown>;
}
