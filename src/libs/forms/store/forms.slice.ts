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
  {
    id: nanoid(),
    title: 'Employee Satisfaction Survey',
    description: 'Help us understand your experience at work.',
    status: 'published',
    questions: [],
    settings: { ...defaultSettings(), maxResponses: 200 },
    theme: { color: 'purple', fontFamily: 'system', darkMode: false },
    responseCount: 47,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    shareToken: nanoid(10),
  },
  {
    id: nanoid(),
    title: 'Product Feedback Form',
    description: 'Tell us what you think about our latest release.',
    status: 'published',
    questions: [],
    settings: defaultSettings(),
    theme: { color: 'green', fontFamily: 'system', darkMode: false },
    responseCount: 128,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    shareToken: nanoid(10),
  },
  {
    id: nanoid(),
    title: 'Event Registration 2026',
    description: 'Register for our upcoming annual conference.',
    status: 'closed',
    questions: [],
    settings: { ...defaultSettings(), acceptingResponses: false },
    theme: { color: 'orange', fontFamily: 'system', darkMode: false },
    responseCount: 312,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    shareToken: nanoid(10),
  },
  {
    id: nanoid(),
    title: 'New Hire Onboarding Checklist',
    description: undefined,
    status: 'draft',
    questions: [],
    settings: defaultSettings(),
    theme: { color: 'slate', fontFamily: 'system', darkMode: false },
    responseCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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
