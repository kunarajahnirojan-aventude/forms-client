import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import { cn } from '@/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

function ToolbarBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type='button'
      onMouseDown={(e) => {
        e.preventDefault(); // prevent editor losing focus
        onClick();
      }}
      title={title}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors',
        active
          ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  minHeight = '8rem',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // treat "<p></p>" as empty
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-content outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white transition-all',
        'focus-within:border-[#0B1AA0] focus-within:ring-2 focus-within:ring-[#0B1AA0]/15',
        className,
      )}
    >
      {/* Toolbar */}
      <div className='flex items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5'>
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title='Bold (⌘B)'
        >
          <Bold className='h-3.5 w-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title='Italic (⌘I)'
        >
          <Italic className='h-3.5 w-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title='Strikethrough'
        >
          <Strikethrough className='h-3.5 w-3.5' />
        </ToolbarBtn>

        <div className='mx-1.5 h-4 w-px bg-slate-200' />

        <ToolbarBtn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title='Heading'
        >
          <span className='text-[11px] font-bold leading-none'>H2</span>
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('heading', { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title='Subheading'
        >
          <span className='text-[11px] font-bold leading-none'>H3</span>
        </ToolbarBtn>

        <div className='mx-1.5 h-4 w-px bg-slate-200' />

        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title='Bullet list'
        >
          <List className='h-3.5 w-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title='Ordered list'
        >
          <ListOrdered className='h-3.5 w-3.5' />
        </ToolbarBtn>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className='px-4 py-3' />
    </div>
  );
}
