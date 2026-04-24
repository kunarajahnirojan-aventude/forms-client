import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Share2,
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';
import type { Form, FormStatus } from '@/libs/forms/store/types';
import { formsEditPath } from '@/router/routes';
import { cn } from '@/utils';

const STATUS_CONFIG: Record<
  FormStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  draft: {
    label: 'Draft',
    icon: <Clock className='h-3 w-3' />,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  published: {
    label: 'Published',
    icon: <CheckCircle className='h-3 w-3' />,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  closed: {
    label: 'Closed',
    icon: <XCircle className='h-3 w-3' />,
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

const THEME_GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-amber-500',
  pink: 'from-pink-500 to-rose-500',
  slate: 'from-slate-500 to-slate-700',
  custom: 'from-blue-500 to-blue-600',
};

interface FormCardProps {
  form: Form;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onStatusChange: (id: string, status: FormStatus) => void;
  onCopyLink: (shareToken: string) => void;
}

export function FormCard({
  form,
  onDelete,
  onDuplicate,
  onStatusChange,
  onCopyLink,
}: FormCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const totalQuestions = form.pages.reduce(
    (sum, p) => sum + p.questions.length,
    0,
  );
  const status = STATUS_CONFIG[form.status];
  const gradient = THEME_GRADIENTS[form.theme.color] ?? THEME_GRADIENTS.blue;

  return (
    <div
      className='group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
      onClick={() => navigate(formsEditPath(form.id))}
    >
      {/* Color header */}
      <div className={cn('h-2 w-full bg-gradient-to-r', gradient)} />

      <div className='flex flex-1 flex-col gap-3 p-5'>
        {/* Icon + title row */}
        <div className='flex items-start gap-3'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
              gradient,
            )}
          >
            <FileText className='h-5 w-5 text-white' />
          </div>
          <div className='min-w-0 flex-1 pt-0.5'>
            <h3 className='truncate text-sm font-semibold text-slate-900 leading-tight'>
              {form.title}
            </h3>
            {form.description && (
              <p className='mt-0.5 line-clamp-2 text-xs text-slate-500'>
                {form.description
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()}
              </p>
            )}
          </div>
        </div>

        {/* Status + response count */}
        <div className='flex items-center justify-between'>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
              status.className,
            )}
          >
            {status.icon}
            {status.label}
          </span>

          <div className='flex items-center gap-1 text-xs text-slate-500'>
            <BarChart2 className='h-3.5 w-3.5' />
            <span>
              {form.responseCount.toLocaleString()}{' '}
              {form.responseCount === 1 ? 'response' : 'responses'}
            </span>
          </div>
        </div>

        {/* Pages + questions count */}
        <p className='text-xs text-slate-400'>
          {form.pages.length} {form.pages.length === 1 ? 'page' : 'pages'}{' '}
          &middot; {totalQuestions}{' '}
          {totalQuestions === 1 ? 'question' : 'questions'}
        </p>
      </div>

      {/* Context menu button */}
      <div
        ref={menuRef}
        className='absolute right-3 top-4'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors',
            'hover:bg-slate-100 hover:text-slate-700',
            menuOpen
              ? 'bg-slate-100 text-slate-700'
              : 'opacity-0 group-hover:opacity-100',
          )}
          aria-label='Survey options'
        >
          <MoreVertical className='h-4 w-4' />
        </button>

        {menuOpen && (
          <div className='absolute right-0 z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg'>
            <MenuItem
              icon={<Edit3 className='h-4 w-4' />}
              label='Edit survey'
              onClick={() => {
                setMenuOpen(false);
                navigate(formsEditPath(form.id));
              }}
            />
            <MenuItem
              icon={<Copy className='h-4 w-4' />}
              label='Duplicate'
              onClick={() => {
                setMenuOpen(false);
                onDuplicate(form.id);
              }}
            />
            <MenuItem
              icon={<Share2 className='h-4 w-4' />}
              label='Copy share link'
              onClick={() => {
                setMenuOpen(false);
                onCopyLink(form.shareToken);
              }}
            />

            <div className='my-1 border-t border-slate-100' />

            {form.status === 'draft' && (
              <MenuItem
                icon={<CheckCircle className='h-4 w-4 text-emerald-600' />}
                label='Publish'
                labelClass='text-emerald-700'
                onClick={() => {
                  setMenuOpen(false);
                  onStatusChange(form.id, 'published');
                }}
              />
            )}
            {form.status === 'published' && (
              <MenuItem
                icon={<XCircle className='h-4 w-4 text-slate-500' />}
                label='Close form'
                onClick={() => {
                  setMenuOpen(false);
                  onStatusChange(form.id, 'closed');
                }}
              />
            )}
            {form.status === 'closed' && (
              <MenuItem
                icon={<CheckCircle className='h-4 w-4 text-emerald-600' />}
                label='Re-open'
                labelClass='text-emerald-700'
                onClick={() => {
                  setMenuOpen(false);
                  onStatusChange(form.id, 'published');
                }}
              />
            )}

            <div className='my-1 border-t border-slate-100' />

            <MenuItem
              icon={<Trash2 className='h-4 w-4 text-red-500' />}
              label='Delete'
              labelClass='text-red-600'
              onClick={() => {
                setMenuOpen(false);
                onDelete(form.id);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  labelClass,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  labelClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className='flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50'
    >
      <span className='text-slate-400'>{icon}</span>
      <span className={labelClass}>{label}</span>
    </button>
  );
}
