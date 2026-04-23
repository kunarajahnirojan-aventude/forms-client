import { nanoid } from 'nanoid';
import type { Form, SurveyPage, Question } from '@/libs/forms/store/types';
import { GOOGLE_FORMS_MOCK } from '../mockData/googleForms';

type GItem = (typeof GOOGLE_FORMS_MOCK.items)[number];

function convertGoogleItem(item: GItem): Question | null {
  if (!('questionItem' in item)) return null;

  const q = item.questionItem.question;
  const id = nanoid();
  const title = item.title as string;

  if ('textQuestion' in q) {
    return {
      id,
      type: 'text',
      title,
      required: q.required,
      validation: {
        subtype: (
          q as { required: boolean; textQuestion: { paragraph: boolean } }
        ).textQuestion.paragraph
          ? 'multi_line'
          : 'single_line',
      },
    };
  }

  if ('phoneQuestion' in q) {
    return {
      id,
      type: 'phone',
      title,
      required: (
        q as { required: boolean; phoneQuestion: Record<string, never> }
      ).required,
      validation: {},
    };
  }

  if ('scaleQuestion' in q) {
    const sq = (
      q as {
        required: boolean;
        scaleQuestion: {
          low: number;
          high: number;
          lowLabel: string;
          highLabel: string;
        };
      }
    ).scaleQuestion;
    return {
      id,
      type: 'linear_scale',
      title,
      required: (q as { required: boolean; scaleQuestion: unknown }).required,
      validation: {
        min: sq.low as 0 | 1,
        max: sq.high,
        labelLow: sq.lowLabel,
        labelHigh: sq.highLabel,
      },
    };
  }

  if ('choiceQuestion' in q) {
    const cq = (
      q as {
        required: boolean;
        choiceQuestion: {
          type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN';
          options: readonly { value: string }[];
        };
      }
    ).choiceQuestion;
    const qtype =
      cq.type === 'CHECKBOX'
        ? 'checkbox'
        : cq.type === 'DROP_DOWN'
          ? 'dropdown'
          : 'radio';
    return {
      id,
      type: qtype,
      title,
      required: (q as { required: boolean; choiceQuestion: unknown }).required,
      validation: {},
      options: cq.options.map((o) => ({ id: nanoid(), label: o.value })),
    };
  }

  return null;
}

export function convertGoogleForm(): Form {
  const source = GOOGLE_FORMS_MOCK;
  const pages: SurveyPage[] = [];
  let currentPage: SurveyPage | null = null;

  for (const item of source.items) {
    if ('pageBreakItem' in item) {
      if (currentPage) pages.push(currentPage);
      currentPage = {
        id: nanoid(),
        title: item.title as string,
        description: (
          item as {
            title: string;
            description?: string;
            pageBreakItem: unknown;
          }
        ).description,
        questions: [],
      };
    } else if ('questionItem' in item) {
      if (!currentPage) {
        currentPage = { id: nanoid(), title: 'Page 1', questions: [] };
      }
      const q = convertGoogleItem(item);
      if (q) currentPage.questions.push(q);
    }
  }

  if (currentPage) pages.push(currentPage);
  if (pages.length === 0) {
    pages.push({ id: nanoid(), title: 'Page 1', questions: [] });
  }

  const now = new Date().toISOString();
  return {
    id: nanoid(),
    title: source.info.title,
    description: source.info.description,
    status: 'draft',
    pages,
    settings: {
      acceptingResponses: true,
      confirmationMessage: 'Thank you for your response!',
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
