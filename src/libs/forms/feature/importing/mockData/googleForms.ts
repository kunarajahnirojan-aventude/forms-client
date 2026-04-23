/**
 * Simulated Google Forms JSON export structure.
 * Real exports use the Google Forms API v1 schema.
 * pageBreakItem starts a new page/section.
 */
export const GOOGLE_FORMS_MOCK = {
  formId: 'google-mock-001',
  info: {
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve by sharing your experience with our product.',
  },
  items: [
    {
      itemId: 'pb-1',
      title: 'About You',
      description: 'Tell us a little about yourself.',
      pageBreakItem: {},
    },
    {
      itemId: 'q-1',
      title: 'What is your full name?',
      questionItem: {
        question: {
          required: true,
          textQuestion: { paragraph: false },
        },
      },
    },
    {
      itemId: 'q-2',
      title: 'What is your email address?',
      questionItem: {
        question: {
          required: true,
          textQuestion: { paragraph: false },
        },
      },
    },
    {
      itemId: 'q-3',
      title: 'What is your phone number?',
      questionItem: {
        question: {
          required: false,
          phoneQuestion: {},
        },
      },
    },
    {
      itemId: 'pb-2',
      title: 'Product Feedback',
      description: 'Share your thoughts on our product.',
      pageBreakItem: {},
    },
    {
      itemId: 'q-4',
      title: 'How did you hear about us?',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'Social Media' },
              { value: 'Friend or Colleague' },
              { value: 'Search Engine' },
              { value: 'Advertisement' },
              { value: 'Other' },
            ],
          },
        },
      },
    },
    {
      itemId: 'q-5',
      title: 'Which features do you use? (Select all that apply)',
      questionItem: {
        question: {
          required: false,
          choiceQuestion: {
            type: 'CHECKBOX',
            options: [
              { value: 'Dashboard' },
              { value: 'Reports' },
              { value: 'Integrations' },
              { value: 'API Access' },
            ],
          },
        },
      },
    },
    {
      itemId: 'q-6',
      title: 'Overall, how satisfied are you with our product?',
      questionItem: {
        question: {
          required: true,
          scaleQuestion: {
            low: 1,
            high: 5,
            lowLabel: 'Very dissatisfied',
            highLabel: 'Very satisfied',
          },
        },
      },
    },
    {
      itemId: 'q-7',
      title: 'Any additional comments or suggestions?',
      questionItem: {
        question: {
          required: false,
          textQuestion: { paragraph: true },
        },
      },
    },
  ],
} as const;

export type GoogleFormsMock = typeof GOOGLE_FORMS_MOCK;
