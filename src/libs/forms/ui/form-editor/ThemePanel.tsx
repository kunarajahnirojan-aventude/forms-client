import { cn } from '@/utils';
import type { FormTheme, ThemeColor } from '@/libs/forms/store/types';

interface ThemePanelProps {
  theme: FormTheme;
  onChange: (patch: Partial<FormTheme>) => void;
}

const COLORS: { value: ThemeColor; label: string; bg: string; ring: string }[] =
  [
    { value: 'blue', label: 'Blue', bg: 'bg-blue-500', ring: 'ring-blue-500' },
    {
      value: 'purple',
      label: 'Purple',
      bg: 'bg-purple-500',
      ring: 'ring-purple-500',
    },
    {
      value: 'green',
      label: 'Green',
      bg: 'bg-emerald-500',
      ring: 'ring-emerald-500',
    },
    {
      value: 'orange',
      label: 'Orange',
      bg: 'bg-orange-500',
      ring: 'ring-orange-500',
    },
    { value: 'pink', label: 'Pink', bg: 'bg-pink-500', ring: 'ring-pink-500' },
    {
      value: 'slate',
      label: 'Slate',
      bg: 'bg-slate-500',
      ring: 'ring-slate-500',
    },
  ];

const FONTS: { value: FormTheme['fontFamily']; label: string }[] = [
  { value: 'system', label: 'Default (System)' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
];

export function ThemePanel({ theme, onChange }: ThemePanelProps) {
  return (
    <div className='space-y-5'>
      <div>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
          Color
        </h3>
        <div className='flex flex-wrap gap-2.5'>
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onChange({ color: c.value })}
              title={c.label}
              className={cn(
                'h-8 w-8 rounded-full transition-all',
                c.bg,
                theme.color === c.value
                  ? `ring-2 ring-offset-2 ${c.ring}`
                  : 'opacity-70 hover:opacity-100',
              )}
              aria-label={c.label}
            />
          ))}

          {/* Custom color picker */}
          <label
            title='Custom color'
            className={cn(
              'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 overflow-hidden transition-all hover:border-slate-400',
              theme.color === 'custom'
                ? 'ring-2 ring-offset-2 ring-slate-400'
                : '',
            )}
          >
            {theme.color === 'custom' && theme.customColor && (
              <span
                className='absolute inset-0 rounded-full'
                style={{ backgroundColor: theme.customColor }}
              />
            )}
            <input
              type='color'
              className='sr-only'
              value={theme.customColor ?? '#6366f1'}
              onChange={(e) =>
                onChange({ color: 'custom', customColor: e.target.value })
              }
            />
            <span className='relative text-xs text-slate-400'>
              {theme.color === 'custom' ? '' : '+'}
            </span>
          </label>
        </div>
      </div>

      <div className='border-t border-slate-100 pt-4'>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
          Font
        </h3>
        <div className='space-y-1.5'>
          {FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => onChange({ fontFamily: f.value })}
              className={cn(
                'flex w-full items-center rounded-lg border px-3 py-2.5 text-sm transition-colors text-left',
                theme.fontFamily === f.value
                  ? 'border-[#0B1AA0]/40 bg-[#0B1AA0]/10 text-[#0B1AA0]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
              )}
            >
              <span
                className={cn(
                  f.value === 'serif'
                    ? 'font-serif'
                    : f.value === 'mono'
                      ? 'font-mono'
                      : '',
                )}
              >
                {f.label}
              </span>
              {theme.fontFamily === f.value && (
                <span className='ml-auto h-1.5 w-1.5 rounded-full bg-[#0B1AA0]' />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
