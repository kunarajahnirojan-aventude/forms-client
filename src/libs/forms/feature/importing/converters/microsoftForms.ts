import { nanoid } from 'nanoid';
import type { Form, SurveyPage, Question } from '@/libs/forms/store/types';
import { MICROSOFT_FORMS_MOCK } from '../mockData/microsoftForms';

type MSQuestion = (typeof MICROSOFT_FORMS_MOCK.questions)[number];

function convertMSQuestion(item: MSQuestion): Question | SurveyPage | null {
  // Section → will be handled as a page separator at the converter level
  if (item.type === 'Section') return null;

  const id = nanoid();

  if (item.type === 'Text') {
    const q = item as {
      id: string;
      type: 'Text';
      title: string;
      required: boolean;
      isMultiline: boolean;
      subtype?: string;
    };
    return {
      id,
      type: 'text',
      title: q.title,
      required: q.required,
      validation: {
        subtype:
          q.subtype === 'email'
            ? 'email'
            : q.isMultiline
              ? 'multi_line'
              : 'single_line',
      },
    };
  }

  if (item.type === 'Date') {
    const q = item as {
      id: string;
      type: 'Date';
      title: string;
      required: boolean;
    };
    return {
      id,
      type: 'date',
      title: q.title,
      required: q.required,
      validation: {},
    };
  }

  if (item.type === 'Choice') {
    const q = item as {
      id: string;
      type: 'Choice';
      title: string;
      required: boolean;
      isMultiSelect: boolean;
      choices: readonly string[];
    };
    return {
      id,
      type: q.isMultiSelect ? 'checkbox' : 'radio',
      title: q.title,
      required: q.required,
      validation: {},
      options: q.choices.map((c) => ({ id: nanoid(), label: c })),
    };
  }

  if (item.type === 'Rating') {
    const q = item as {
      id: string;
      type: 'Rating';
      title: string;
      required: boolean;
      ratingLevel: number;
    };
    return {
      id,
      type: 'rating',
      title: q.title,
      required: q.required,
      validation: { maxRating: q.ratingLevel === 10 ? 10 : 5 },
    };
  }

  return null;
}

export function convertMicrosoftForm(): Form {
  const source = MICROSOFT_FORMS_MOCK;
  const pages: SurveyPage[] = [];
  let currentPage: SurveyPage | null = null;

  for (const item of source.questions) {
    if (item.type === 'Section') {
      if (currentPage) pages.push(currentPage);
      const s = item as {
        id: string;
        type: 'Section';
        title: string;
        description: string;
      };
      currentPage = {
        id: nanoid(),
        title: s.title,
        description: s.description,
        questions: [],
      };
    } else {
      if (!currentPage) {
        currentPage = { id: nanoid(), title: 'Page 1', questions: [] };
      }
      const q = convertMSQuestion(item);
      if (q && 'type' in q && typeof (q as Question).type === 'string') {
        currentPage.questions.push(q as Question);
      }
    }
  }

  if (currentPage) pages.push(currentPage);
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
      confirmationMessage: 'Thank you for completing the survey!',
      showProgressBar: true,
      allowMultipleSubmissions: false,
      requireSignIn: false,
    },
    theme: { color: 'purple', fontFamily: 'system', darkMode: false },
    responseCount: 0,
    createdAt: now,
    updatedAt: now,
    shareToken: nanoid(10),
  };
}
