import { useRef, useState } from 'react';
import { Image } from 'lucide-react';
import { cn } from '@/utils';
import { RichTextEditor } from '@/libs/forms/ui/form-setup/rich-text-editor';

interface FormHeaderProps {
  title: string;
  description?: string;
  themeColor: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}

const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-blue-500 via-blue-600 to-indigo-600',
  purple: 'from-purple-500 via-violet-600 to-purple-700',
  green: 'from-emerald-400 via-teal-500 to-emerald-600',
  orange: 'from-orange-400 via-amber-500 to-orange-500',
  pink: 'from-pink-400 via-rose-500 to-pink-600',
  slate: 'from-slate-500 via-slate-600 to-slate-700',
  custom: 'from-blue-500 via-blue-600 to-indigo-600',
};

export function FormHeader({
  title,
  description,
  themeColor,
  onTitleChange,
  onDescriptionChange,
}: FormHeaderProps) {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [descFocused, setDescFocused] = useState(!!description);

  const gradient = GRADIENT_MAP[themeColor] ?? GRADIENT_MAP.blue;

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
      {/* Color banner */}
      <div className={cn('h-24 bg-gradient-to-r', gradient, 'relative')}>
        <button className='absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-white/20 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30'>
          <Image className='h-3.5 w-3.5' />
          Add cover image
        </button>
      </div>

      {/* Title + description */}
      <div className='p-6 pb-5'>
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder='Untitled form'
          rows={1}
          className={cn(
            'w-full resize-none bg-transparent text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300',
            'border-b-2 border-transparent pb-1 transition-colors focus:border-[#0B1AA0]',
          )}
          style={{ minHeight: '1.5em' }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${t.scrollHeight}px`;
          }}
        />

        {descFocused || description ? (
          <div className='mt-3'>
            <RichTextEditor
              value={description ?? ''}
              onChange={onDescriptionChange}
              placeholder='Form description (optional)'
              minHeight='5rem'
            />
          </div>
        ) : (
          <button
            onClick={() => setDescFocused(true)}
            className='mt-2 text-sm text-slate-400 hover:text-slate-500 transition-colors'
          >
            + Add description
          </button>
        )}
      </div>
    </div>
  );
}
