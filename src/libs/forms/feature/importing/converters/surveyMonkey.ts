import { nanoid } from 'nanoid';
import type { Form, SurveyPage, Question } from '@/libs/forms/store/types';
import { SURVEY_MONKEY_MOCK } from '../mockData/surveyMonkey';

type SMPage = (typeof SURVEY_MONKEY_MOCK.pages)[number];
type SMQuestion = SMPage['questions'][number];

function convertSMQuestion(item: SMQuestion): Question | null {
  const id = nanoid();
  const title = item.heading as string;

  if (item.family === 'open_ended') {
    const q = item as {
      family: 'open_ended';
      subtype: string;
      heading: string;
      required: boolean;
    };
    return {
      id,
      type: 'text',
      title,
      required: q.required,
      validation: {
        subtype: q.subtype === 'essay' ? 'multi_line' : 'single_line',
      },
    };
  }

  if (item.family === 'single_choice') {
    const q = item as {
      family: 'single_choice';
      heading: string;
      required: boolean;
      answers: { choices: readonly { text: string }[] };
    };
    return {
      id,
      type: 'radio',
      title,
      required: q.required,
      validation: {},
      options: q.answers.choices.map((c) => ({ id: nanoid(), label: c.text })),
    };
  }

  if (item.family === 'multiple_choice') {
    const q = item as {
      family: 'multiple_choice';
      heading: string;
      required: boolean;
      answers: { choices: readonly { text: string }[] };
    };
    return {
      id,
      type: 'checkbox',
      title,
      required: q.required,
      validation: {},
      options: q.answers.choices.map((c) => ({ id: nanoid(), label: c.text })),
    };
  }

  if (item.family === 'rating') {
    const q = item as {
      family: 'rating';
      heading: string;
      required: boolean;
      answers: { rating_type: string; max_rating: number };
    };
    return {
      id,
      type: 'rating',
      title,
      required: q.required,
      validation: { maxRating: q.answers.max_rating === 10 ? 10 : 5 },
    };
  }

  if (item.family === 'matrix') {
    const q = item as {
      family: 'matrix';
      heading: string;
      required: boolean;
      answers: {
        rows: readonly { text: string }[];
        choices: readonly { text: string }[];
      };
    };
    return {
      id,
      type: 'matrix',
      title,
      required: q.required,
      validation: { multiplePerRow: false },
      rows: q.answers.rows.map((r) => ({ id: nanoid(), label: r.text })),
      columns: q.answers.choices.map((c) => ({ id: nanoid(), label: c.text })),
    };
  }

  return null;
}

export function convertSurveyMonkeyForm(): Form {
  const source = SURVEY_MONKEY_MOCK;

  const pages: SurveyPage[] = source.pages.map((page) => ({
    id: nanoid(),
    title: page.title as string,
    description: page.description as string | undefined,
    questions: page.questions
      .map((q) => convertSMQuestion(q as SMQuestion))
      .filter((q): q is Question => q !== null),
  }));

  if (pages.length === 0) {
    pages.push({ id: nanoid(), title: 'Page 1', questions: [] });
  }

  const now = new Date().toISOString();
  return {
    id: nanoid(),
    title: source.title,
    description: source.description,
    status: 'draft',
    pages,
    settings: {
      acceptingResponses: true,
      confirmationMessage: 'Thanks for taking part in our survey!',
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireSignIn: false,
    },
    theme: { color: 'green', fontFamily: 'system', darkMode: false },
    responseCount: 0,
    createdAt: now,
    updatedAt: now,
    shareToken: nanoid(10),
  };
}
