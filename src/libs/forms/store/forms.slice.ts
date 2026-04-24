import { nanoid } from 'nanoid';
import type { FormsState, Form } from './types';
import type { StateCreator } from 'zustand';
import type { AppState } from '@/store/types';

const defaultSettings = (): Form['settings'] => ({
  acceptingResponses: true,
  confirmationMessage: 'Thank you for your response!',
  showProgressBar: true,
  allowMultipleSubmissions: false,
  requireSignIn: false,
});

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_FORMS: Form[] = [
  // ── 1. Employee Satisfaction Survey ───────────────────────────────────────
  {
    id: nanoid(),
    title: 'Employee Satisfaction Survey',
    description: 'Help us understand your experience at work.',
    status: 'published',
    pages: [
      {
        id: nanoid(),
        title: 'General Information',
        questions: [
          {
            id: nanoid(),
            type: 'text',
            title: 'Work Email Address',
            description: 'Please enter your company email.',
            required: true,
            validation: { subtype: 'email' },
          },
          {
            id: nanoid(),
            type: 'phone',
            title: 'Contact Phone Number',
            required: false,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'dropdown',
            title: 'Which department do you work in?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Engineering' },
              { id: nanoid(), label: 'Product' },
              { id: nanoid(), label: 'Design' },
              { id: nanoid(), label: 'Marketing' },
              { id: nanoid(), label: 'Sales' },
              { id: nanoid(), label: 'Human Resources' },
              { id: nanoid(), label: 'Finance' },
              { id: nanoid(), label: 'Operations' },
            ],
          },
          {
            id: nanoid(),
            type: 'date',
            title: 'When did you join the company?',
            required: true,
            validation: { disableFuture: true },
          },
          {
            id: nanoid(),
            type: 'yes_no',
            title:
              'Have you completed your annual performance review this year?',
            required: true,
            validation: {},
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Work Environment',
        questions: [
          {
            id: nanoid(),
            type: 'linear_scale',
            title: 'How satisfied are you with your overall work environment?',
            required: true,
            validation: {
              min: 1,
              max: 10,
              labelLow: 'Very dissatisfied',
              labelHigh: 'Very satisfied',
            },
          },
          {
            id: nanoid(),
            type: 'rating',
            title: 'Rate your work-life balance',
            required: true,
            validation: {
              maxRating: 5,
              showLabels: true,
              labelLow: 'Poor',
              labelHigh: 'Excellent',
            },
          },
          {
            id: nanoid(),
            type: 'matrix',
            title: 'Please rate the following aspects of your work environment',
            required: true,
            validation: { multiplePerRow: false },
            rows: [
              { id: nanoid(), label: 'Office / Remote setup' },
              { id: nanoid(), label: 'Tools & equipment' },
              { id: nanoid(), label: 'Collaboration culture' },
              { id: nanoid(), label: 'Psychological safety' },
            ],
            columns: [
              { id: nanoid(), label: 'Poor' },
              { id: nanoid(), label: 'Fair' },
              { id: nanoid(), label: 'Good' },
              { id: nanoid(), label: 'Excellent' },
            ],
          },
          {
            id: nanoid(),
            type: 'checkbox',
            title: 'Which of the following benefits do you actively use?',
            required: false,
            validation: {},
            options: [
              { id: nanoid(), label: 'Health insurance' },
              { id: nanoid(), label: 'Gym / wellness allowance' },
              { id: nanoid(), label: 'Remote work flexibility' },
              { id: nanoid(), label: 'Learning & development budget' },
              { id: nanoid(), label: 'Meal vouchers' },
              { id: nanoid(), label: 'Stock options / equity' },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Team & Management',
        questions: [
          {
            id: nanoid(),
            type: 'section',
            title: 'Manager Relationship',
            description:
              'The following questions relate to your direct line manager.',
            required: false,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'radio',
            title: 'How often do you have 1-on-1 meetings with your manager?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Weekly' },
              { id: nanoid(), label: 'Bi-weekly' },
              { id: nanoid(), label: 'Monthly' },
              { id: nanoid(), label: 'Rarely' },
              { id: nanoid(), label: 'Never' },
            ],
          },
          {
            id: nanoid(),
            type: 'linear_scale',
            title:
              'How likely are you to recommend this company as a great place to work?',
            description: 'This is our internal Net Promoter Score question.',
            required: true,
            validation: {
              min: 0,
              max: 10,
              labelLow: 'Not at all likely',
              labelHigh: 'Extremely likely',
            },
          },
          {
            id: nanoid(),
            type: 'text',
            title:
              'What single change would most improve your experience at work?',
            required: false,
            validation: { subtype: 'multi_line', maxLength: 500 },
          },
        ],
      },
    ],
    settings: {
      ...defaultSettings(),
      maxResponses: 200,
      defaultDisplayMode: 'page',
    },
    theme: { color: 'purple', fontFamily: 'system', darkMode: false },
    responseCount: 47,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    shareToken: nanoid(10),
  },

  // ── 2. Product Feedback Survey ─────────────────────────────────────────────
  {
    id: nanoid(),
    title: 'Product Feedback Survey',
    description: 'Tell us what you think about our latest release.',
    status: 'published',
    pages: [
      {
        id: nanoid(),
        title: 'Product Experience',
        questions: [
          {
            id: nanoid(),
            type: 'rating',
            title: 'How would you rate our product overall?',
            required: true,
            validation: {
              maxRating: 5,
              showLabels: true,
              labelLow: 'Terrible',
              labelHigh: 'Excellent',
            },
          },
          {
            id: nanoid(),
            type: 'linear_scale',
            title: 'How easy was it to get started with our product?',
            required: true,
            validation: {
              min: 1,
              max: 5,
              labelLow: 'Very difficult',
              labelHigh: 'Very easy',
            },
          },
          {
            id: nanoid(),
            type: 'radio',
            title: 'How did you hear about us?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Search engine (Google, Bing, etc.)' },
              { id: nanoid(), label: 'Social media' },
              { id: nanoid(), label: 'Word of mouth / colleague referral' },
              { id: nanoid(), label: 'Online advertisement' },
              { id: nanoid(), label: 'Blog post or article' },
              { id: nanoid(), label: 'Other' },
            ],
          },
          {
            id: nanoid(),
            type: 'yes_no',
            title: 'Did our product meet your expectations?',
            required: true,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'dropdown',
            title: 'Which plan are you currently on?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Free' },
              { id: nanoid(), label: 'Starter' },
              { id: nanoid(), label: 'Pro' },
              { id: nanoid(), label: 'Business' },
              { id: nanoid(), label: 'Enterprise' },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Feature Requests',
        questions: [
          {
            id: nanoid(),
            type: 'matrix',
            title: 'Please rate the usefulness of each feature',
            required: true,
            validation: { multiplePerRow: false },
            rows: [
              { id: nanoid(), label: 'Dashboard & Analytics' },
              { id: nanoid(), label: 'Reporting & Exports' },
              { id: nanoid(), label: 'Third-party Integrations' },
              { id: nanoid(), label: 'Mobile App' },
              { id: nanoid(), label: 'Collaboration Tools' },
            ],
            columns: [
              { id: nanoid(), label: 'Not useful' },
              { id: nanoid(), label: 'Somewhat useful' },
              { id: nanoid(), label: 'Very useful' },
              { id: nanoid(), label: "Haven't used it" },
            ],
          },
          {
            id: nanoid(),
            type: 'checkbox',
            title: 'Which features do you use most often?',
            required: false,
            validation: { maxSelections: 3 },
            options: [
              { id: nanoid(), label: 'Dashboard' },
              { id: nanoid(), label: 'Reports' },
              { id: nanoid(), label: 'Integrations' },
              { id: nanoid(), label: 'Team management' },
              { id: nanoid(), label: 'API access' },
              { id: nanoid(), label: 'Mobile app' },
            ],
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'What feature would you most like to see added next?',
            required: false,
            validation: { subtype: 'multi_line', maxLength: 400 },
          },
          {
            id: nanoid(),
            type: 'text',
            title:
              'Share your website or product URL so we can better understand your use case',
            required: false,
            validation: { subtype: 'url' },
          },
        ],
      },
    ],
    settings: { ...defaultSettings(), defaultDisplayMode: 'page' },
    theme: { color: 'green', fontFamily: 'system', darkMode: false },
    responseCount: 128,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    shareToken: nanoid(10),
  },

  // ── 3. Event Registration 2026 ─────────────────────────────────────────────
  {
    id: nanoid(),
    title: 'Event Registration 2026',
    description: 'Register for our upcoming annual conference.',
    status: 'closed',
    pages: [
      {
        id: nanoid(),
        title: 'Personal Details',
        questions: [
          {
            id: nanoid(),
            type: 'text',
            title: 'Full Name',
            required: true,
            validation: { subtype: 'single_line' },
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Email Address',
            description:
              'We will send your confirmation and updates to this address.',
            required: true,
            validation: { subtype: 'email' },
          },
          {
            id: nanoid(),
            type: 'phone',
            title: 'Phone Number',
            description: 'For urgent event notifications only.',
            required: false,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'dropdown',
            title: 'Country',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'United States' },
              { id: nanoid(), label: 'United Kingdom' },
              { id: nanoid(), label: 'Canada' },
              { id: nanoid(), label: 'Australia' },
              { id: nanoid(), label: 'Germany' },
              { id: nanoid(), label: 'France' },
              { id: nanoid(), label: 'Spain' },
              { id: nanoid(), label: 'Netherlands' },
              { id: nanoid(), label: 'Other' },
            ],
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Company / Organisation',
            required: false,
            validation: { subtype: 'single_line' },
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Session Preferences',
        questions: [
          {
            id: nanoid(),
            type: 'checkbox',
            title: 'Which sessions are you interested in attending?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Keynote: The Future of AI' },
              { id: nanoid(), label: 'Workshop: Building Scalable Systems' },
              { id: nanoid(), label: 'Panel: Product-Led Growth' },
              { id: nanoid(), label: 'Deep Dive: Design Systems' },
              { id: nanoid(), label: 'Fireside Chat: Founder Stories' },
              { id: nanoid(), label: 'Networking Lunch' },
            ],
          },
          {
            id: nanoid(),
            type: 'radio',
            title: 'T-Shirt size',
            required: false,
            validation: {},
            options: [
              { id: nanoid(), label: 'XS' },
              { id: nanoid(), label: 'S' },
              { id: nanoid(), label: 'M' },
              { id: nanoid(), label: 'L' },
              { id: nanoid(), label: 'XL' },
              { id: nanoid(), label: 'XXL' },
            ],
          },
          {
            id: nanoid(),
            type: 'linear_scale',
            title: 'How familiar are you with the main conference topics?',
            required: false,
            validation: {
              min: 1,
              max: 5,
              labelLow: 'Complete beginner',
              labelHigh: 'Expert',
            },
          },
          {
            id: nanoid(),
            type: 'date',
            title: 'Preferred arrival date',
            description: 'The conference runs April 28–30, 2026.',
            required: true,
            validation: {},
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Dietary & Accessibility',
        questions: [
          {
            id: nanoid(),
            type: 'radio',
            title: 'Dietary requirements',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'No restrictions' },
              { id: nanoid(), label: 'Vegetarian' },
              { id: nanoid(), label: 'Vegan' },
              { id: nanoid(), label: 'Gluten-free' },
              { id: nanoid(), label: 'Halal' },
              { id: nanoid(), label: 'Kosher' },
              { id: nanoid(), label: 'Other (please specify below)' },
            ],
          },
          {
            id: nanoid(),
            type: 'yes_no',
            title: 'Do you require any accessibility accommodations?',
            required: true,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'text',
            title:
              'Please describe any specific dietary or accessibility needs',
            required: false,
            validation: { subtype: 'multi_line', maxLength: 300 },
          },
          {
            id: nanoid(),
            type: 'file_upload',
            title: 'Upload a profile photo (optional, used for your badge)',
            required: false,
            validation: {
              maxSizeMb: 5,
              allowedTypes: ['image/*'],
              maxFiles: 1,
            },
          },
        ],
      },
    ],
    settings: {
      ...defaultSettings(),
      acceptingResponses: false,
      defaultDisplayMode: 'page',
    },
    theme: { color: 'orange', fontFamily: 'system', darkMode: false },
    responseCount: 312,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    shareToken: nanoid(10),
  },

  // ── 4. New Hire Onboarding Checklist ──────────────────────────────────────
  {
    id: nanoid(),
    title: 'New Hire Onboarding Checklist',
    description:
      'Complete this form before your first day to ensure a smooth start.',
    status: 'draft',
    pages: [
      {
        id: nanoid(),
        title: 'Personal Information',
        questions: [
          {
            id: nanoid(),
            type: 'text',
            title: 'Full Legal Name',
            description: 'As it appears on your government-issued ID.',
            required: true,
            validation: { subtype: 'single_line' },
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Personal Email Address',
            description: "We'll use this before your work email is set up.",
            required: true,
            validation: { subtype: 'email' },
          },
          {
            id: nanoid(),
            type: 'phone',
            title: 'Mobile Phone Number',
            required: true,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'date',
            title: 'Date of Birth',
            required: true,
            validation: { disableFuture: true },
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'LinkedIn Profile URL',
            required: false,
            validation: { subtype: 'url' },
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Emergency contact full name',
            required: true,
            validation: { subtype: 'single_line' },
          },
          {
            id: nanoid(),
            type: 'phone',
            title: 'Emergency contact phone number',
            required: true,
            validation: {},
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Role & Department',
        questions: [
          {
            id: nanoid(),
            type: 'section',
            title: 'Role Details',
            description: 'Tell us about the position you are joining.',
            required: false,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'dropdown',
            title: 'Department',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Engineering' },
              { id: nanoid(), label: 'Product' },
              { id: nanoid(), label: 'Design' },
              { id: nanoid(), label: 'Marketing' },
              { id: nanoid(), label: 'Sales' },
              { id: nanoid(), label: 'Human Resources' },
              { id: nanoid(), label: 'Finance' },
              { id: nanoid(), label: 'Operations' },
            ],
          },
          {
            id: nanoid(),
            type: 'radio',
            title: 'Employment Type',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Full-time' },
              { id: nanoid(), label: 'Part-time' },
              { id: nanoid(), label: 'Contract' },
              { id: nanoid(), label: 'Internship' },
            ],
          },
          {
            id: nanoid(),
            type: 'date',
            title: 'Start Date',
            required: true,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Expected Annual Salary (in USD)',
            required: false,
            validation: { subtype: 'number', min: 0, allowDecimal: false },
          },
          {
            id: nanoid(),
            type: 'checkbox',
            title: 'Which equipment do you need for your first day?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'MacBook Pro' },
              { id: nanoid(), label: 'MacBook Air' },
              { id: nanoid(), label: 'Windows Laptop' },
              { id: nanoid(), label: 'External monitor' },
              { id: nanoid(), label: 'Keyboard & mouse' },
              { id: nanoid(), label: 'Headset / headphones' },
              { id: nanoid(), label: 'Webcam' },
            ],
          },
          {
            id: nanoid(),
            type: 'file_upload',
            title: 'Upload your signed offer letter',
            required: true,
            validation: {
              maxSizeMb: 10,
              allowedTypes: ['.pdf', '.docx'],
              maxFiles: 1,
            },
          },
        ],
      },
    ],
    settings: defaultSettings(),
    theme: { color: 'slate', fontFamily: 'system', darkMode: false },
    responseCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    shareToken: nanoid(10),
  },

  // ── 5. Customer Support Quality Review ────────────────────────────────────
  {
    id: nanoid(),
    title: 'Customer Support Quality Review',
    description: 'Help us improve by sharing your recent support experience.',
    status: 'published',
    pages: [
      {
        id: nanoid(),
        title: 'Your Interaction',
        questions: [
          {
            id: nanoid(),
            type: 'text',
            title: 'Ticket / Case Number',
            description:
              'You can find this in your support confirmation email.',
            required: false,
            validation: { subtype: 'single_line' },
          },
          {
            id: nanoid(),
            type: 'dropdown',
            title: 'Support channel used',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Live chat' },
              { id: nanoid(), label: 'Email' },
              { id: nanoid(), label: 'Phone call' },
              { id: nanoid(), label: 'Help centre / self-service' },
              { id: nanoid(), label: 'Community forum' },
            ],
          },
          {
            id: nanoid(),
            type: 'date',
            title: 'Date of your support interaction',
            required: true,
            validation: { disableFuture: true },
          },
          {
            id: nanoid(),
            type: 'rating',
            title:
              'How satisfied were you with your overall support experience?',
            required: true,
            validation: {
              maxRating: 5,
              showLabels: true,
              labelLow: 'Very dissatisfied',
              labelHigh: 'Very satisfied',
            },
          },
          {
            id: nanoid(),
            type: 'yes_no',
            title: 'Was your issue fully resolved?',
            required: true,
            validation: {},
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Agent & Resolution',
        questions: [
          {
            id: nanoid(),
            type: 'section',
            title: 'Agent Assessment',
            description:
              'Rate the performance of the support agent you spoke with.',
            required: false,
            validation: {},
          },
          {
            id: nanoid(),
            type: 'matrix',
            title:
              'Please rate the following aspects of your support experience',
            required: true,
            validation: { multiplePerRow: false },
            rows: [
              { id: nanoid(), label: 'Response time' },
              { id: nanoid(), label: 'Agent politeness' },
              { id: nanoid(), label: 'Agent knowledge' },
              { id: nanoid(), label: 'Quality of solution' },
              { id: nanoid(), label: 'Follow-up communication' },
            ],
            columns: [
              { id: nanoid(), label: 'Poor' },
              { id: nanoid(), label: 'Average' },
              { id: nanoid(), label: 'Good' },
              { id: nanoid(), label: 'Excellent' },
            ],
          },
          {
            id: nanoid(),
            type: 'radio',
            title:
              'How many times did you have to contact us to resolve this issue?',
            required: true,
            validation: {},
            options: [
              { id: nanoid(), label: 'Once (resolved on first contact)' },
              { id: nanoid(), label: 'Twice' },
              { id: nanoid(), label: '3–4 times' },
              { id: nanoid(), label: 'More than 4 times' },
            ],
          },
          {
            id: nanoid(),
            type: 'linear_scale',
            title: 'How knowledgeable was the support agent?',
            required: true,
            validation: {
              min: 1,
              max: 5,
              labelLow: 'Not knowledgeable',
              labelHigh: 'Highly knowledgeable',
            },
          },
          {
            id: nanoid(),
            type: 'yes_no',
            title:
              'Would you contact our support team again for future issues?',
            required: false,
            validation: {},
          },
        ],
      },
      {
        id: nanoid(),
        title: 'Additional Feedback',
        questions: [
          {
            id: nanoid(),
            type: 'checkbox',
            title: 'What areas could we improve? (select all that apply)',
            required: false,
            validation: {},
            options: [
              { id: nanoid(), label: 'Faster response times' },
              { id: nanoid(), label: 'More knowledgeable agents' },
              { id: nanoid(), label: 'Better self-service documentation' },
              { id: nanoid(), label: 'Easier ticket submission process' },
              { id: nanoid(), label: 'Proactive status updates' },
              { id: nanoid(), label: 'Nothing — it was great!' },
            ],
          },
          {
            id: nanoid(),
            type: 'linear_scale',
            title:
              'How likely are you to recommend our support to a colleague?',
            description:
              'This helps us measure our support Net Promoter Score.',
            required: true,
            validation: {
              min: 0,
              max: 10,
              labelLow: 'Not at all likely',
              labelHigh: 'Extremely likely',
            },
          },
          {
            id: nanoid(),
            type: 'text',
            title: 'Any additional comments or suggestions?',
            required: false,
            validation: { subtype: 'multi_line', maxLength: 600 },
          },
        ],
      },
    ],
    settings: { ...defaultSettings(), defaultDisplayMode: 'page' },
    theme: { color: 'blue', fontFamily: 'system', darkMode: false },
    responseCount: 215,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    shareToken: nanoid(10),
  },
];

export const createFormsSlice: StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  FormsState
> = (set) => ({
  forms: SEED_FORMS,
  searchQuery: '',
  statusFilter: 'all',

  setForms: (forms) => set({ forms }, false, 'forms/setForms'),

  addForm: (form) =>
    set((s) => ({ forms: [form, ...s.forms] }), false, 'forms/addForm'),

  updateForm: (id, updates) =>
    set(
      (s) => ({
        forms: s.forms.map((f) =>
          f.id === id
            ? { ...f, ...updates, updatedAt: new Date().toISOString() }
            : f,
        ),
      }),
      false,
      'forms/updateForm',
    ),

  deleteForm: (id) =>
    set(
      (s) => ({ forms: s.forms.filter((f) => f.id !== id) }),
      false,
      'forms/deleteForm',
    ),

  duplicateForm: (id) =>
    set(
      (s) => {
        const original = s.forms.find((f) => f.id === id);
        if (!original) return s;
        const now = new Date().toISOString();
        const copy: Form = {
          ...original,
          id: nanoid(),
          title: `${original.title} (Copy)`,
          status: 'draft',
          responseCount: 0,
          shareToken: nanoid(10),
          createdAt: now,
          updatedAt: now,
        };
        const idx = s.forms.findIndex((f) => f.id === id);
        const next = [...s.forms];
        next.splice(idx + 1, 0, copy);
        return { forms: next };
      },
      false,
      'forms/duplicateForm',
    ),

  setSearchQuery: (searchQuery) =>
    set({ searchQuery }, false, 'forms/setSearchQuery'),

  setStatusFilter: (statusFilter) =>
    set({ statusFilter }, false, 'forms/setStatusFilter'),
});
