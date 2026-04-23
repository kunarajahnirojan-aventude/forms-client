/**
 * Simulated SurveyMonkey JSON export structure.
 * Top-level "pages" array maps directly to our SurveyPage model.
 */
export const SURVEY_MONKEY_MOCK = {
  id: 'sm-mock-001',
  title: 'Market Research Survey',
  description: 'Help us understand your preferences and improve our offerings.',
  pages: [
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
    {
      id: 'sm-p3',
      title: 'Final Thoughts',
      description: 'Almost done — just a couple more questions.',
      questions: [
        {
          id: 'sm-q6',
          family: 'rating',
          heading: 'Overall, how would you rate your experience with us?',
          required: true,
          answers: {
            rating_type: 'star',
            max_rating: 5,
          },
        },
        {
          id: 'sm-q7',
          family: 'single_choice',
          heading: 'Would you recommend us to a friend or colleague?',
          required: true,
          answers: {
            choices: [{ text: 'Yes' }, { text: 'No' }, { text: 'Maybe' }],
          },
        },
        {
          id: 'sm-q8',
          family: 'open_ended',
          subtype: 'single',
          heading: 'Any other comments?',
          required: false,
        },
      ],
    },
  ],
} as const;

export type SurveyMonkeyMock = typeof SURVEY_MONKEY_MOCK;
