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
    // ── Page 1: About You ─────────────────────────────────────────────────────
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
    // ── Page 2: Professional Background ──────────────────────────────────────
    {
      itemId: 'pb-2',
      title: 'Professional Background',
      description: 'Help us understand who our customers are.',
      pageBreakItem: {},
    },
    {
      itemId: 'q-4',
      title: 'What is your current job title?',
      questionItem: {
        question: {
          required: false,
          textQuestion: { paragraph: false },
        },
      },
    },
    {
      itemId: 'q-5',
      title: 'How large is your organisation?',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [
              { value: 'Just me' },
              { value: '2–10 people' },
              { value: '11–50 people' },
              { value: '51–200 people' },
              { value: '200+ people' },
            ],
          },
        },
      },
    },
    {
      itemId: 'q-6',
      title: 'What industry are you in?',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'DROP_DOWN',
            options: [
              { value: 'Technology' },
              { value: 'Healthcare' },
              { value: 'Finance' },
              { value: 'Education' },
              { value: 'Retail & E-commerce' },
              { value: 'Other' },
            ],
          },
        },
      },
    },
    // ── Page 3: Product Experience ────────────────────────────────────────────
    {
      itemId: 'pb-3',
      title: 'Product Experience',
      description: 'Tell us about your experience using our product.',
      pageBreakItem: {},
    },
    {
      itemId: 'q-7',
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
      itemId: 'q-8',
      title: 'Which features do you use? (Select all that apply)',
      questionItem: {
        question: {
          required: false,
          choiceQuestion: {
            type: 'CHECKBOX',
            options: [
              { value: 'Dashboard' },
              { value: 'Reports & Analytics' },
              { value: 'Integrations' },
              { value: 'API Access' },
              { value: 'Team Collaboration' },
            ],
          },
        },
      },
    },
    {
      itemId: 'q-9',
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
      itemId: 'q-10',
      title: 'What improvements would you most like to see?',
      questionItem: {
        question: {
          required: false,
          textQuestion: { paragraph: true },
        },
      },
    },
    // ── Page 4: Support & Usage ───────────────────────────────────────────────
    {
      itemId: 'pb-4',
      title: 'Support & Usage',
      description: "We'd love to know about your support experience.",
      pageBreakItem: {},
    },
    {
      itemId: 'q-11',
      title: 'Have you ever contacted our support team?',
      questionItem: {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: [{ value: 'Yes' }, { value: 'No' }],
          },
        },
      },
    },
    {
      itemId: 'q-12',
      title: 'How would you rate the quality of our support?',
      questionItem: {
        question: {
          required: false,
          scaleQuestion: {
            low: 1,
            high: 5,
            lowLabel: 'Very poor',
            highLabel: 'Excellent',
          },
        },
      },
    },
    {
      itemId: 'q-13',
      title: 'How easy is our product to use day-to-day?',
      questionItem: {
        question: {
          required: true,
          scaleQuestion: {
            low: 1,
            high: 10,
            lowLabel: 'Very difficult',
            highLabel: 'Extremely easy',
          },
        },
      },
    },
    // ── Page 5: Final Thoughts ────────────────────────────────────────────────
    {
      itemId: 'pb-5',
      title: 'Final Thoughts',
      description: "Just a couple more questions and you're done!",
      pageBreakItem: {},
    },
    {
      itemId: 'q-14',
      title:
        'How likely are you to recommend us? (0 = Not at all, 10 = Extremely likely)',
      questionItem: {
        question: {
          required: true,
          scaleQuestion: {
            low: 0,
            high: 10,
            lowLabel: 'Not at all likely',
            highLabel: 'Extremely likely',
          },
        },
      },
    },
    {
      itemId: 'q-15',
      title:
        'What do you value most about our product? (Select all that apply)',
      questionItem: {
        question: {
          required: false,
          choiceQuestion: {
            type: 'CHECKBOX',
            options: [
              { value: 'Ease of use' },
              { value: 'Value for money' },
              { value: 'Feature set' },
              { value: 'Customer support' },
              { value: 'Reliability' },
            ],
          },
        },
      },
    },
    {
      itemId: 'q-16',
      title: 'Any other comments or suggestions?',
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
