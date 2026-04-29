import type { Form, Question } from '@/libs/forms/store/types';
import type { FormResponse } from '@/libs/forms/store/response-types';

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic pseudo-random helpers (seeded by question id so stable)
// ─────────────────────────────────────────────────────────────────────────────

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate a mock answer for a single question
// ─────────────────────────────────────────────────────────────────────────────

function mockAnswer(q: Question, respondentIndex: number): unknown {
  const rng = seededRandom(hashStr(q.id) + respondentIndex * 997);

  switch (q.type) {
    case 'section':
      return undefined;

    case 'text':
    case 'phone': {
      const subtypes: Record<string, string[]> = {
        email: [
          'alice@example.com',
          'bob@acme.org',
          'charlie@startup.io',
          'diana@corp.net',
          'evan@example.com',
          'fiona@sample.co',
        ],
        single_line: [
          'Sample response',
          'Acme Corp',
          'John Smith',
          'Jane Doe',
          'Test User',
          'Demo Company',
        ],
        multi_line: [
          'This is a detailed response with multiple sentences. It covers the main points thoroughly.',
          'I would like to see improvements in the onboarding experience and better documentation.',
          'The product is great overall but could use better mobile support.',
          'More integrations with third-party tools would be helpful.',
          'Everything works well. No major complaints.',
        ],
        number: ['42', '100', '7', '250', '15', '88'],
        url: [
          'https://example.com',
          'https://acme.org',
          'https://startup.io',
          'https://demo.net',
        ],
        phone: [
          '+1 555 0101',
          '+44 20 7946 0800',
          '+1 555 0202',
          '+49 30 0000',
          '+1 555 0303',
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subtype = (q.validation as any)?.subtype ?? 'single_line';
      const pool = subtypes[subtype] ?? subtypes.single_line;
      return pickOne(pool, rng);
    }

    case 'radio': {
      const opts = q.options ?? [];
      if (!opts.length) return '';
      return pickOne(opts, rng).label;
    }

    case 'dropdown': {
      const opts = q.options ?? [];
      if (!opts.length) return '';
      return pickOne(opts, rng).label;
    }

    case 'checkbox': {
      const opts = q.options ?? [];
      if (!opts.length) return [];
      const count = Math.max(1, Math.floor(rng() * Math.min(3, opts.length)));
      const shuffled = [...opts].sort(() => rng() - 0.5);
      return shuffled.slice(0, count).map((o) => o.label);
    }

    case 'yes_no':
      return rng() > 0.4 ? 'yes' : 'no';

    case 'rating': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const max = (q.validation as any)?.maxRating ?? 5;
      return Math.max(1, Math.round(rng() * max));
    }

    case 'linear_scale': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = q.validation as any;
      const min = v?.min ?? 1;
      const max = v?.max ?? 10;
      return min + Math.round(rng() * (max - min));
    }

    case 'date': {
      const days = Math.floor(rng() * 365 * 3);
      const d = new Date(Date.now() - days * 86400000);
      return d.toISOString().split('T')[0];
    }

    case 'file_upload':
      return [
        pickOne(['report.pdf', 'photo.png', 'document.docx', 'data.csv'], rng),
      ];

    case 'matrix': {
      const rows = q.rows ?? [];
      const cols = q.columns ?? [];
      if (!rows.length || !cols.length) return {};
      const result: Record<string, string> = {};
      for (const row of rows) {
        result[row.id] = pickOne(
          cols,
          seededRandom(hashStr(row.id) + respondentIndex * 31),
        ).label;
      }
      return result;
    }

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate mock responses for a form
// ─────────────────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Evan',
  'Fiona',
  'George',
  'Hannah',
];
const LAST_NAMES = [
  'Smith',
  'Jones',
  'Brown',
  'Taylor',
  'Wilson',
  'Davis',
  'Miller',
  'Garcia',
];

export function generateMockResponses(form: Form, count = 8): FormResponse[] {
  const allQuestions = form.pages.flatMap((p) => p.questions);
  const responses: FormResponse[] = [];

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(hashStr(form.id) + i * 1234567);
    const answersMap: Record<string, unknown> = {};

    for (const q of allQuestions) {
      if (q.type === 'section') continue;
      answersMap[q.id] = mockAnswer(q, i);
    }

    const daysAgo = Math.floor(rng() * 30);
    const hoursAgo = Math.floor(rng() * 24);
    const submittedAt = new Date(
      Date.now() - daysAgo * 86400000 - hoursAgo * 3600000,
    ).toISOString();

    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    void firstName;
    void lastName;

    responses.push({
      id: `mock-${form.id}-${i}`,
      formId: form.id,
      submittedAt,
      answers: answersMap,
    });
  }

  // Sort newest first
  return responses.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}
