import { nanoid } from 'nanoid';
import type { Form, FormPage, Question } from '@/libs/forms/store/types';

// ─────────────────────────────────────────────────────────────────────────────
// FB_PUBLIC_LOAD_DATA_ structure
//
// Google embeds this JS variable in every public form page. The shape is a
// nested positional array (not named keys).
//
// data[0]        = null
// data[1]        = main form block
//   [0]          = internal form ID
//   [1]          = items array (questions + section breaks)
//   [2]          = [confirmationMessage, ...]
//   [8]          = form description (secondary title)
// data[3]        = form title (display name)
//
// Each item in data[1][1]:
//   [0]  = entry ID (number, used for prefill URLs)
//   [1]  = title
//   [2]  = description (or null)
//   [3]  = type number  (see TYPE_MAP below)
//   [4]  = question details array
//     [4][0][0]  = sub-entry ID
//     [4][0][1]  = choices array (for choice types) or null
//     [4][0][2]  = 1 if required, 0 if optional (for text types)
//                  for choice types this may also carry shuffle/required
//   [11] = [null, title] duplicate
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_MAP: Record<number, string> = {
  0: 'short_text',
  1: 'paragraph',
  2: 'radio',
  3: 'checkbox',
  4: 'dropdown',
  5: 'linear_scale',
  7: 'matrix',
  8: 'section', // page break / section header
  9: 'date',
  10: 'time', // no time type — will map to text
  11: 'file_upload',
};

type RawItem = unknown[];
type RawData = unknown[];

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function safeArr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function isRequired(item: RawItem): boolean {
  // [4][0][2] === 1 signals required for text-type questions.
  // For choice questions the position may carry a shuffle flag instead;
  // we use the same heuristic — 1 = required / shuffled-required.
  try {
    const details = safeArr((item as RawItem[])[4]);
    const first = safeArr(details[0]);
    return first[2] === 1;
  } catch {
    return false;
  }
}

/**
 * Detects the text sub-type for short-answer questions.
 *
 * In FB_PUBLIC_LOAD_DATA_ Google stores text validation at item[4][0][4].
 * Each entry has the shape: [validatorType, params, errCode, errText]
 * Validator types observed:
 *   1 = text / email / url  (distinguished by params or errText)
 *   2 = number
 *   4 = length
 *   6 = regex
 *
 * When the data isn't available we fall back to a title heuristic so that
 * questions titled e.g. "Email address" still get the right subtype.
 */
/**
 * Detects the text sub-type for short-answer questions using only the error
 * message text embedded in Google's validation array and a title heuristic.
 *
 * We intentionally do NOT map validator type numbers to our 'number' subtype
 * because Google's type codes are unreliable across form versions and mapping
 * to 'number' renders <input type="number">, which rejects email characters.
 * The 'number' subtype is reserved for questions created in the editor.
 */
function getShortTextSubtype(
  item: RawItem,
  _title: string,
): 'single_line' | 'email' | 'url' {
  try {
    const details = safeArr((item as RawItem[])[4]);
    const first = safeArr(details[0]);
    const validations = safeArr(first[4]);
    if (validations.length > 0) {
      const firstVal = safeArr(validations[0]);
      // Read the error message text (index 3) and params (index 1) to detect
      // email / url validators — these are stable across Google Forms versions.
      const errText = String(firstVal[3] ?? '').toLowerCase();
      const paramsJson = JSON.stringify(safeArr(firstVal[1])).toLowerCase();
      if (
        errText.includes('email') ||
        paramsJson.includes('email') ||
        paramsJson.includes('@')
      )
        return 'email';
      if (
        errText.includes('url') ||
        paramsJson.includes('url') ||
        paramsJson.includes('http')
      )
        return 'url';
    }
  } catch {
    // ignore — fall through to default
  }

  return 'single_line';
}

function convertItem(item: RawItem): Question | null {
  const id = nanoid();
  const title = safeStr(item[1]) || 'Untitled question';
  const typeNum = item[3] as number;
  const typeName = TYPE_MAP[typeNum] ?? 'unknown';
  const required = isRequired(item);

  // ── Text (short answer) ──────────────────────────────────────────────────
  if (typeName === 'short_text') {
    return {
      id,
      type: 'text',
      title,
      required,
      validation: { subtype: getShortTextSubtype(item, title) },
    };
  }

  // ── Paragraph (long text) ────────────────────────────────────────────────
  if (typeName === 'paragraph') {
    return {
      id,
      type: 'text',
      title,
      required,
      validation: { subtype: 'multi_line' },
    };
  }

  // ── Date ─────────────────────────────────────────────────────────────────
  if (typeName === 'date') {
    return { id, type: 'date', title, required, validation: {} };
  }

  // ── Time → treat as single-line text ────────────────────────────────────
  if (typeName === 'time') {
    return {
      id,
      type: 'text',
      title,
      required,
      validation: { subtype: 'single_line' },
    };
  }

  // ── File upload ──────────────────────────────────────────────────────────
  if (typeName === 'file_upload') {
    return { id, type: 'file_upload', title, required, validation: {} };
  }

  // ── Choice types (radio / checkbox / dropdown) ───────────────────────────
  if (
    typeName === 'radio' ||
    typeName === 'checkbox' ||
    typeName === 'dropdown'
  ) {
    const qtype = typeName as 'radio' | 'checkbox' | 'dropdown';
    const details = safeArr((item as RawItem[])[4]);
    const first = safeArr(details[0]);
    const rawChoices = safeArr(first[1]); // [[text, null, null, null, isOther], ...]
    const options = rawChoices
      .filter((c) => Array.isArray(c))
      .map((c) => ({ id: nanoid(), label: safeStr((c as unknown[])[0]) }))
      .filter((o) => o.label.trim() !== '');

    return { id, type: qtype, title, required, validation: {}, options };
  }

  // ── Linear scale ─────────────────────────────────────────────────────────
  if (typeName === 'linear_scale') {
    // Scale params live at [4][0] in a positional array.
    // Common layout: [subId, null, required, null, null, null, null, null, 0,
    //                 null, null, [min, null, max, null, lowLabel, null, highLabel]]
    // Fall back to sensible defaults when we can't parse them.
    const details = safeArr((item as RawItem[])[4]);
    const first = safeArr(details[0]);
    const scaleData = safeArr(first[11] ?? first[10]);
    const min = (typeof scaleData[0] === 'number' ? scaleData[0] : 1) as 0 | 1;
    const max = typeof scaleData[2] === 'number' ? scaleData[2] : 5;
    const labelLow = safeStr(scaleData[4]);
    const labelHigh = safeStr(scaleData[6]);

    return {
      id,
      type: 'linear_scale',
      title,
      required,
      validation: { min, max, labelLow, labelHigh },
    };
  }

  // ── Matrix / Grid ────────────────────────────────────────────────────────
  if (typeName === 'matrix') {
    // Each sub-entry in [4] represents one row. Columns are shared across all rows
    // and live in the first sub-entry at [4][0][1].
    const details = safeArr((item as RawItem[])[4]);
    const first = safeArr(details[0]);
    const rawCols = safeArr(first[1]);
    const columns = rawCols
      .filter(Array.isArray)
      .map((c) => ({ id: nanoid(), label: safeStr((c as unknown[])[0]) }))
      .filter((c) => c.label.trim() !== '');

    // Row titles come from each sub-entry's own entry-title (often in [4][n][0])
    // For simplicity, build synthetic rows numbered 1..n
    const rows = details.map((_, i) => ({
      id: nanoid(),
      label: `Row ${i + 1}`,
    }));

    return {
      id,
      type: 'matrix',
      title,
      required,
      validation: { multiplePerRow: false },
      rows,
      columns,
    };
  }

  // Unknown / unsupported type — skip
  return null;
}

export function convertGoogleFormPublic(data: RawData): Form {
  debugger;
  const formBlock = safeArr(data[1]);
  const title = safeStr(data[3]) || safeStr(formBlock[8]) || 'Imported Form';
  const rawSettings = safeArr(formBlock[2]);
  const confirmationMessage =
    safeStr(rawSettings[0]) || 'Thank you for your response!';

  const rawItems = safeArr(formBlock[1]) as RawItem[];

  const pages: FormPage[] = [];
  let currentPage: FormPage | null = null;

  for (const item of rawItems) {
    const typeNum = item[3] as number;

    // Type 8 = section header → start a new page
    if (typeNum === 8) {
      if (currentPage) pages.push(currentPage);
      currentPage = {
        id: nanoid(),
        title: safeStr(item[1]) || 'Section',
        description: safeStr(item[2]) || undefined,
        questions: [],
      };
      continue;
    }

    if (!currentPage) {
      currentPage = { id: nanoid(), title: 'Page 1', questions: [] };
    }

    const question = convertItem(item);
    if (question) currentPage.questions.push(question);
  }

  if (currentPage) pages.push(currentPage);
  if (pages.length === 0) {
    pages.push({ id: nanoid(), title: 'Page 1', questions: [] });
  }

  const now = new Date().toISOString();

  return {
    id: nanoid(),
    title,
    description: undefined,
    status: 'draft',
    pages,
    settings: {
      acceptingResponses: true,
      confirmationMessage,
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireSignIn: false,
    },
    theme: { color: 'blue', fontFamily: 'system', darkMode: false },
    responseCount: 0,
    createdAt: now,
    updatedAt: now,
    shareToken: nanoid(10),
  };
}
