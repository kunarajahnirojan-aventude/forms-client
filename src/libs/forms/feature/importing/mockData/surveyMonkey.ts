/**
 * Simulated SurveyMonkey JSON export structure.
 * Top-level "pages" array maps directly to our SurveyPage model.
 */
export const SURVEY_MONKEY_MOCK = {
  id: 'sm-mock-001',
  title: 'Market Research Survey',
  description: 'Help us understand your preferences and improve our offerings.',
  pages: [
    // ── Page 1: Demographics ──────────────────────────────────────────────────
    {
      id: 'sm-p1',
      title: 'Demographics',
      description: 'A few quick questions about you.',
      questions: [
        {
          id: 'sm-q1',
          family: 'single_choice',
          heading: 'What is your age group?',
          required: true,
          answers: {
            choices: [
              { text: '18–24' },
              { text: '25–34' },
              { text: '35–44' },
              { text: '45–54' },
              { text: '55+' },
            ],
          },
        },
        {
          id: 'sm-q2',
          family: 'multiple_choice',
          heading:
            'Which platforms do you use regularly? (Select all that apply)',
          required: false,
          answers: {
            choices: [
              { text: 'Facebook' },
              { text: 'Instagram' },
              { text: 'Twitter / X' },
              { text: 'LinkedIn' },
              { text: 'TikTok' },
              { text: 'YouTube' },
            ],
          },
        },
        {
          id: 'sm-q3',
          family: 'open_ended',
          subtype: 'single',
          heading: 'What city do you live in?',
          required: false,
        },
      ],
    },
    // ── Page 2: Product Preferences ───────────────────────────────────────────
    {
      id: 'sm-p2',
      title: 'Product Preferences',
      description: 'Tell us what matters most to you.',
      questions: [
        {
          id: 'sm-q4',
          family: 'matrix',
          heading: 'How would you rate the following aspects of our product?',
          required: true,
          answers: {
            rows: [
              { text: 'Ease of use' },
              { text: 'Value for money' },
              { text: 'Customer support' },
              { text: 'Feature set' },
            ],
            choices: [
              { text: 'Poor' },
              { text: 'Fair' },
              { text: 'Good' },
              { text: 'Excellent' },
            ],
          },
        },
        {
          id: 'sm-q5',
          family: 'open_ended',
          subtype: 'essay',
          heading: 'What improvements would you most like to see?',
          required: false,
        },
      ],
    },
    // ── Page 3: Purchase Behaviour ────────────────────────────────────────────
    {
      id: 'sm-p3',
      title: 'Purchase Behaviour',
      description: 'Help us understand how you make buying decisions.',
      questions: [
        {
          id: 'sm-q6',
          family: 'single_choice',
          heading: 'How often do you purchase products in our category?',
          required: true,
          answers: {
            choices: [
              { text: 'More than once a week' },
              { text: 'Once a week' },
              { text: 'A few times a month' },
              { text: 'Once a month' },
              { text: 'Less than once a month' },
            ],
          },
        },
        {
          id: 'sm-q7',
          family: 'single_choice',
          heading:
            'What is your typical monthly budget for this type of product?',
          required: false,
          answers: {
            choices: [
              { text: 'Under $20' },
              { text: '$20–$50' },
              { text: '$51–$100' },
              { text: '$101–$250' },
              { text: 'Over $250' },
            ],
          },
        },
        {
          id: 'sm-q8',
          family: 'multiple_choice',
          heading:
            'What factors most influence your purchase decision? (Select all that apply)',
          required: false,
          answers: {
            choices: [
              { text: 'Price' },
              { text: 'Brand reputation' },
              { text: 'Reviews & ratings' },
              { text: 'Features' },
              { text: 'Ease of use' },
              { text: 'Recommendation from a friend' },
            ],
          },
        },
      ],
    },
    // ── Page 4: Competitive Insights ──────────────────────────────────────────
    {
      id: 'sm-p4',
      title: 'Competitive Insights',
      description: 'Tell us about your experience with other tools.',
      questions: [
        {
          id: 'sm-q9',
          family: 'multiple_choice',
          heading:
            'Which competing products have you used? (Select all that apply)',
          required: false,
          answers: {
            choices: [
              { text: 'Competitor A' },
              { text: 'Competitor B' },
              { text: 'Competitor C' },
              { text: 'None — this is my first tool of this type' },
            ],
          },
        },
        {
          id: 'sm-q10',
          family: 'open_ended',
          subtype: 'essay',
          heading:
            'What do competing products do better than ours? Please be specific.',
          required: false,
        },
        {
          id: 'sm-q11',
          family: 'rating',
          heading:
            'How likely are you to switch to a competitor in the next 6 months?',
          required: true,
          answers: {
            rating_type: 'star',
            max_rating: 5,
          },
        },
      ],
    },
    // ── Page 5: Overall Experience ────────────────────────────────────────────
    {
      id: 'sm-p5',
      title: 'Overall Experience',
      description: 'Almost done — just a couple more questions.',
      questions: [
        {
          id: 'sm-q12',
          family: 'rating',
          heading: 'Overall, how would you rate your experience with us?',
          required: true,
          answers: {
            rating_type: 'star',
            max_rating: 5,
          },
        },
        {
          id: 'sm-q13',
          family: 'single_choice',
          heading: 'Would you recommend us to a friend or colleague?',
          required: true,
          answers: {
            choices: [{ text: 'Yes' }, { text: 'No' }, { text: 'Maybe' }],
          },
        },
        {
          id: 'sm-q14',
          family: 'open_ended',
          subtype: 'single',
          heading: 'Any other comments or suggestions?',
          required: false,
        },
      ],
    },
  ],
} as const;

export type SurveyMonkeyMock = typeof SURVEY_MONKEY_MOCK;
