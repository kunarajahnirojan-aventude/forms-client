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
    // ── Section 1: Personal Information ──────────────────────────────────────
    {
      id: 'ms-s1',
      type: 'Section',
      order: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself.',
    },
    {
      id: 'ms-q1',
      type: 'Text',
      order: 2,
      title: 'Full Name',
      required: true,
      isMultiline: false,
    },
    {
      id: 'ms-q2',
      type: 'Date',
      order: 3,
      title: 'Start Date',
      required: true,
    },
    {
      id: 'ms-q3',
      type: 'Text',
      order: 4,
      title: 'Personal Email Address',
      required: true,
      isMultiline: false,
      subtype: 'email',
    },
    // ── Section 2: Role & Department ──────────────────────────────────────────
    {
      id: 'ms-s2',
      type: 'Section',
      order: 5,
      title: 'Role & Department',
      description: 'Help us set up your profile.',
    },
    {
      id: 'ms-q4',
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
      id: 'ms-q5',
      type: 'Choice',
      order: 7,
      title: 'What is your seniority level?',
      required: true,
      isMultiSelect: false,
      choices: ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director'],
    },
    {
      id: 'ms-q6',
      type: 'Choice',
      order: 8,
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
    // ── Section 3: Work Style & Preferences ──────────────────────────────────
    {
      id: 'ms-s3',
      type: 'Section',
      order: 9,
      title: 'Work Style & Preferences',
      description: 'Help us create the best environment for you.',
    },
    {
      id: 'ms-q7',
      type: 'Choice',
      order: 10,
      title: 'What is your preferred work arrangement?',
      required: true,
      isMultiSelect: false,
      choices: ['Fully remote', 'Hybrid (2–3 days on-site)', 'Fully on-site'],
    },
    {
      id: 'ms-q8',
      type: 'Choice',
      order: 11,
      title: 'What are your preferred working hours?',
      required: false,
      isMultiSelect: false,
      choices: ['8 am – 4 pm', '9 am – 5 pm', '10 am – 6 pm', 'Flexible'],
    },
    {
      id: 'ms-q9',
      type: 'Choice',
      order: 12,
      title:
        'Which communication channels do you prefer? (Select all that apply)',
      required: false,
      isMultiSelect: true,
      choices: [
        'Slack messages',
        'Email',
        'Video calls',
        'In-person meetings',
        'Async voice/video notes',
      ],
    },
    // ── Section 4: Goals & Expectations ──────────────────────────────────────
    {
      id: 'ms-s4',
      type: 'Section',
      order: 13,
      title: 'Goals & Expectations',
      description: "Let's align on what success looks like for you.",
    },
    {
      id: 'ms-q10',
      type: 'Text',
      order: 14,
      title: 'What are your main goals for the first 90 days?',
      required: true,
      isMultiline: true,
    },
    {
      id: 'ms-q11',
      type: 'Rating',
      order: 15,
      title: 'How excited are you about joining our team?',
      required: false,
      ratingLevel: 5,
    },
    {
      id: 'ms-q12',
      type: 'Text',
      order: 16,
      title: 'What challenges are you expecting in this role?',
      required: false,
      isMultiline: true,
    },
    // ── Section 5: Company Feedback ───────────────────────────────────────────
    {
      id: 'ms-s5',
      type: 'Section',
      order: 17,
      title: 'Company Feedback',
      description: 'Your early impressions matter to us.',
    },
    {
      id: 'ms-q13',
      type: 'Rating',
      order: 18,
      title: 'How would you rate your onboarding experience so far?',
      required: true,
      ratingLevel: 5,
    },
    {
      id: 'ms-q14',
      type: 'Text',
      order: 19,
      title: 'What could we do to improve the onboarding process?',
      required: false,
      isMultiline: true,
    },
    {
      id: 'ms-q15',
      type: 'Choice',
      order: 20,
      title: 'Would you be interested in a mentorship programme?',
      required: false,
      isMultiSelect: false,
      choices: ['Yes, definitely', 'Maybe', 'No, thanks'],
    },
  ],
} as const;

export type MicrosoftFormsMock = typeof MICROSOFT_FORMS_MOCK;
