import {
  Type,
  CheckSquare,
  Circle,
  ChevronDown,
  Calendar,
  Star,
  BarChart2,
  Upload,
  Minus,
  ToggleLeft,
  Phone,
  Grid3x3,
} from 'lucide-react';
import type { QuestionType } from '@/libs/forms/store/types';
import { cn } from '@/utils';

interface QuestionTypeOption {
  type: QuestionType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const QUESTION_TYPES: { category: string; items: QuestionTypeOption[] }[] = [
  {
    category: 'Input',
    items: [
      {
        type: 'text',
        label: 'Text',
        icon: <Type className='h-4 w-4' />,
        description: 'Short or long text',
        color: 'text-[#0B1AA0] bg-[#0B1AA0]/10',
      },
      {
        type: 'phone',
        label: 'Phone',
        icon: <Phone className='h-4 w-4' />,
        description: 'Phone number',
        color: 'text-cyan-600 bg-cyan-50',
      },
      {
        type: 'date',
        label: 'Date',
        icon: <Calendar className='h-4 w-4' />,
        description: 'Date / date-time picker',
        color: 'text-violet-600 bg-violet-50',
      },
      {
        type: 'file_upload',
        label: 'File Upload',
        icon: <Upload className='h-4 w-4' />,
        description: 'Upload one or more files',
        color: 'text-teal-600 bg-teal-50',
      },
    ],
  },
  {
    category: 'Choice',
    items: [
      {
        type: 'radio',
        label: 'Radio',
        icon: <Circle className='h-4 w-4' />,
        description: 'Single choice',
        color: 'text-emerald-600 bg-emerald-50',
      },
      {
        type: 'checkbox',
        label: 'Checkbox',
        icon: <CheckSquare className='h-4 w-4' />,
        description: 'Multiple choice',
        color: 'text-green-600 bg-green-50',
      },
      {
        type: 'dropdown',
        label: 'Dropdown',
        icon: <ChevronDown className='h-4 w-4' />,
        description: 'Select from list',
        color: 'text-amber-600 bg-amber-50',
      },
      {
        type: 'yes_no',
        label: 'Yes / No',
        icon: <ToggleLeft className='h-4 w-4' />,
        description: 'Boolean choice',
        color: 'text-orange-600 bg-orange-50',
      },
    ],
  },
  {
    category: 'Scale',
    items: [
      {
        type: 'rating',
        label: 'Rating',
        icon: <Star className='h-4 w-4' />,
        description: 'Star rating',
        color: 'text-yellow-600 bg-yellow-50',
      },
      {
        type: 'linear_scale',
        label: 'Linear Scale',
        icon: <BarChart2 className='h-4 w-4' />,
        description: 'Numeric range',
        color: 'text-pink-600 bg-pink-50',
      },
      {
        type: 'matrix',
        label: 'Matrix',
        icon: <Grid3x3 className='h-4 w-4' />,
        description: 'Grid of choices',
        color: 'text-rose-600 bg-rose-50',
      },
    ],
  },
  {
    category: 'Layout',
    items: [
      {
        type: 'section',
        label: 'Section',
        icon: <Minus className='h-4 w-4' />,
        description: 'Title + description divider',
        color: 'text-slate-600 bg-slate-100',
      },
    ],
  },
];

interface QuestionTypeMenuProps {
  onSelect: (type: QuestionType) => void;
  onClose?: () => void;
}

export function QuestionTypeMenu({ onSelect }: QuestionTypeMenuProps) {
  return (
    <div className='w-[600px] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80'>
      <div className='border-b border-slate-100 px-5 py-3'>
        <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
          Add question
        </p>
      </div>

      <div className='p-4 space-y-4'>
        {QUESTION_TYPES.map(({ category, items }) => (
          <div key={category}>
            <p className='mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400'>
              {category}
            </p>
            <div className='grid grid-cols-4 gap-1.5'>
              {items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onSelect(item.type)}
                  className='group flex flex-col items-center gap-2 rounded-xl border border-transparent px-2 py-3 text-center transition-all hover:border-slate-200 hover:bg-slate-50'
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
                      item.color,
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className='text-xs font-medium leading-tight text-slate-700'>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
