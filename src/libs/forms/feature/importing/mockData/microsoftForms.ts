/**
 * Simulated Microsoft Forms JSON export structure.
 * "Section" type questions act as page separators.
 */
export const MICROSOFT_FORMS_MOCK = {
  id: 'ms-form-001',
  title: 'Employee Onboarding Survey',
  description:
    'Welcome to the team! Please complete this survey so we can get to know you better.',
  questions: [
    {
      id: 'ms-q1',
      type: 'Section',
      order: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself.',
    },
    {
      id: 'ms-q2',
      type: 'Text',
      order: 2,
      title: 'Full Name',
      required: true,
      isMultiline: false,
    },
    {
      id: 'ms-q3',
      type: 'Date',
      order: 3,
      title: 'Start Date',
      required: true,
    },
    {
      id: 'ms-q4',
      type: 'Text',
      order: 4,
      title: 'Personal Email Address',
      required: true,
      isMultiline: false,
      subtype: 'email',
    },
    {
      id: 'ms-q5',
      type: 'Section',
      order: 5,
      title: 'Role & Department',
      description: 'Help us set up your profile.',
    },
    {
      id: 'ms-q6',
      type: 'Choice',
      order: 6,
      title: 'Which department will you be joining?',
      required: true,
      isMultiSelect: false,
      choices: [
        'Engineering',
        'Marketing',
        'Sales',
        'Operations',
        'HR',
        'Finance',
      ],
    },
    {
      id: 'ms-q7',
      type: 'Choice',
      order: 7,
      title:
        'Which tools are you already familiar with? (Select all that apply)',
      required: false,
      isMultiSelect: true,
      choices: [
        'Slack',
        'Jira',
        'Confluence',
        'GitHub',
        'Figma',
        'None of the above',
      ],
    },
    {
      id: 'ms-q8',
      type: 'Rating',
      order: 8,
      title: 'How excited are you about joining our team?',
      required: false,
      ratingLevel: 5,
    },
    {
      id: 'ms-q9',
      type: 'Text',
      order: 9,
      title: 'What are your goals for the first 90 days?',
      required: false,
      isMultiline: true,
    },
  ],
} as const;

export type MicrosoftFormsMock = typeof MICROSOFT_FORMS_MOCK;
