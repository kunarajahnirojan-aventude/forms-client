// ─────────────────────────────────────────────────────────────────────────────
// Question types
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionType =
  | 'text'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'date'
  | 'rating'
  | 'linear_scale'
  | 'file_upload'
  | 'section'
  | 'yes_no'
  | 'phone'
  | 'matrix';

// ─────────────────────────────────────────────────────────────────────────────
// Validation configs (per question type)
// ─────────────────────────────────────────────────────────────────────────────

export type TextSubtype =
  | 'single_line'
  | 'multi_line'
  | 'email'
  | 'password'
  | 'number'
  | 'url'
  | 'phone';

export interface TextValidation {
  subtype: TextSubtype;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  // number-specific
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  currency?: string;
  // password-specific
  minLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSymbol?: boolean;
}

export interface ChoiceValidation {
  required?: boolean;
  allowOther?: boolean;
  shuffleOptions?: boolean;
  minSelections?: number;
  maxSelections?: number;
}

export interface DateValidation {
  required?: boolean;
  minDate?: string; // ISO string
  maxDate?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  includeTime?: boolean;
}

export interface RatingValidation {
  required?: boolean;
  maxRating?: 5 | 10;
  showLabels?: boolean;
  labelLow?: string;
  labelHigh?: string;
}

export interface LinearScaleValidation {
  required?: boolean;
  min?: 0 | 1;
  max?: number; // 2-10
  labelLow?: string;
  labelHigh?: string;
}

export interface FileValidation {
  required?: boolean;
  maxSizeMb?: number;
  allowedTypes?: string[]; // e.g. ['image/*', '.pdf']
  maxFiles?: number;
}

export interface MatrixValidation {
  required?: boolean;
  multiplePerRow?: boolean;
}

export type QuestionValidation =
  | TextValidation
  | ChoiceValidation
  | DateValidation
  | RatingValidation
  | LinearScaleValidation
  | FileValidation
  | MatrixValidation
  | { required?: boolean };

// ─────────────────────────────────────────────────────────────────────────────
// Choice option
// ─────────────────────────────────────────────────────────────────────────────

export interface ChoiceOption {
  id: string;
  label: string;
  imageUrl?: string;
}

// Matrix row / column
export interface MatrixRow {
  id: string;
  label: string;
}

export interface MatrixColumn {
  id: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Question
// ─────────────────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  validation: QuestionValidation;
  // choice / dropdown / yes_no / matrix
  options?: ChoiceOption[];
  rows?: MatrixRow[];
  columns?: MatrixColumn[];
  // display
  showDescription?: boolean;
  pageBreakAfter?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Form settings & theme
// ─────────────────────────────────────────────────────────────────────────────

export interface FormSettings {
  acceptingResponses: boolean;
  closeDate?: string;
  maxResponses?: number;
  confirmationMessage: string;
  redirectUrl?: string;
  shuffleQuestions?: boolean;
  showProgressBar?: boolean;
  allowMultipleSubmissions?: boolean;
  requireSignIn?: boolean;
}

export type ThemeColor =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'slate'
  | 'custom';

export interface FormTheme {
  color: ThemeColor;
  customColor?: string; // hex
  headerImageUrl?: string;
  fontFamily?: 'system' | 'serif' | 'mono';
  darkMode?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Form
// ─────────────────────────────────────────────────────────────────────────────

export type FormStatus = 'draft' | 'published' | 'closed';

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: FormStatus;
  questions: Question[];
  settings: FormSettings;
  theme: FormTheme;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  shareToken: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Undo / redo snapshot
// ─────────────────────────────────────────────────────────────────────────────

export interface EditorSnapshot {
  title: string;
  description?: string;
  questions: Question[];
  settings: FormSettings;
  theme: FormTheme;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice state shapes
// ─────────────────────────────────────────────────────────────────────────────

export interface FormsState {
  forms: Form[];
  searchQuery: string;
  statusFilter: FormStatus | 'all';

  // Actions
  setForms: (forms: Form[]) => void;
  addForm: (form: Form) => void;
  updateForm: (id: string, updates: Partial<Form>) => void;
  deleteForm: (id: string) => void;
  duplicateForm: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: FormStatus | 'all') => void;
}

export interface FormEditorState {
  activeFormId: string | null;
  selectedQuestionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  rightPanel: 'questions' | 'settings' | 'theme';
  undoStack: EditorSnapshot[];
  redoStack: EditorSnapshot[];

  // Actions
  openEditor: (formId: string) => void;
  closeEditor: () => void;
  setSelectedQuestion: (id: string | null) => void;
  setIsDirty: (v: boolean) => void;
  setIsSaving: (v: boolean) => void;
  setLastSavedAt: (t: string) => void;
  setRightPanel: (panel: FormEditorState['rightPanel']) => void;
  pushUndoSnapshot: (snapshot: EditorSnapshot) => void;
  undo: () => void;
  redo: () => void;
}
