'use client';

import { ALLOWED_MEDIA_MINES } from '@shared/constants/constants';
import { useFileUpload } from '@shared/hooks/use-file-upload';
import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button/button';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Table as TableIcon,
} from 'lucide-react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { toast } from 'sonner';

import { Video } from './extensions/video';

const lowlight = createLowlight(common);

interface GithubEditorProps {
  /** initial content only (uncontrolled) */
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  editorContentClassName?: string;
}

export interface GithubEditorRef {
  clear: () => void;
  setContent: (html: string) => void;
  getHTML: () => string;
  focus: () => void;
}

const FIREBASE_BUCKET_URL =
  'https://firebasestorage.googleapis.com/v0/b/graduated-project-17647.firebasestorage.app/o/';

const isMediaFile = (file: File) => {
  const t = (file.type || '').toLowerCase();
  return t.startsWith('image/') || t.startsWith('video/');
};

const notifyUnsupportedFile = (file: File) => {
  toast.error('Chỉ hỗ trợ ảnh/video trong Editor.', {
    description: `File "${file.name}" vui lòng upload ở mục "Attachments" nếu là tài liệu.`,
  });
};

function insertMediaToEditor(editor: Editor, type: string, url: string) {
  if (type.startsWith('video/')) {
    editor.chain().focus().setVideo({ src: url, controls: true }).run();
  } else {
    editor.chain().focus().setImage({ src: url }).run();
  }
}
import type { LucideIcon } from 'lucide-react';

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  label,
  disabled,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn('h-8 w-8', isActive && 'bg-muted text-primary')}
    onClick={onClick}
    title={label}
    type="button"
    disabled={disabled}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export const GithubEditor = forwardRef<GithubEditorRef, GithubEditorProps>(function GithubEditor(
  { value = '', onChange, disabled, editorContentClassName },
  ref,
) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const { upload, isUploading } = useFileUpload({
    validate: {
      maxSizeMB: 10,
      acceptedTypes: ALLOWED_MEDIA_MINES,
    },
    onError: () => {
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
  });

  const handleUploadMedia = useCallback(
    async (file: File): Promise<string | null> => {
      if (!isMediaFile(file)) {
        notifyUnsupportedFile(file);
        return null;
      }

      const result = await upload(file, '/files/upload', 'POST', 'file', {
        resourceType: 'POST',
      });

      const finalResult = Array.isArray(result) ? result[0] : result;
      let finalUrl = finalResult?.url;
      if (finalUrl && !finalUrl.startsWith('http')) {
        finalUrl = `${FIREBASE_BUCKET_URL}${finalUrl}`;
      }

      return finalUrl ?? finalResult?.fileName ?? null;
    },
    [upload],
  );

  const extensions = useMemo(
    () => [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({
        placeholder: 'Nhập nội dung bài viết...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: true, allowBase64: true }),
      Video,
    ],
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions,
    /** IMPORTANT: initial only */
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[300px] w-full bg-transparent px-3 py-3 text-sm outline-none prose dark:prose-invert max-w-none',
          '[&_img]:rounded-md [&_img]:max-h-[320px] [&_img]:object-contain',
          '[&_video]:rounded-md [&_video]:max-h-[360px]',
          '[&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted/50',
          editorContentClassName,
        ),
      },

      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((item) => item.kind === 'file')?.getAsFile();
        if (!file) return false;

        if (!isMediaFile(file)) {
          event.preventDefault();
          notifyUnsupportedFile(file);
          return true;
        }

        event.preventDefault();
        handleUploadMedia(file).then((url) => {
          if (url && editorRef.current) insertMediaToEditor(editorRef.current, file.type, url);
        });

        return true;
      },

      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;

        const file = event.dataTransfer?.files?.[0];
        if (!file) return false;

        if (!isMediaFile(file)) {
          event.preventDefault();
          notifyUnsupportedFile(file);
          return true;
        }

        event.preventDefault();
        handleUploadMedia(file).then((url) => {
          if (url && editorRef.current) insertMediaToEditor(editorRef.current, file.type, url);
        });

        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    // Sync external value to editor, similar to LiteEditor logic
    if (value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => editor?.commands.setContent(''),
      setContent: (html: string) => editor?.commands.setContent(html),
      getHTML: () => editor?.getHTML() ?? '',
      focus: () => editor?.commands.focus(),
    }),
    [editor],
  );

  const triggerFileInput = () => fileInputRef.current?.click();

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isMediaFile(file)) {
      notifyUnsupportedFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const url = await handleUploadMedia(file);

    // Use editorRef to avoid stale closure if component re-renders during await
    const currentEditor = editorRef.current;

    if (!currentEditor) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (url) insertMediaToEditor(currentEditor, file.type, url);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!editor) return null;

  return (
    <div className="border-input bg-background relative flex flex-col overflow-hidden rounded-md border">
      {/* Toolbar */}
      <div className="bg-muted/20 flex items-center justify-between border-b px-2 py-1">
        <div className="flex flex-wrap items-center gap-0.5">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={onFileSelect}
            disabled={disabled}
          />

          {/* Headings */}
          <div className="mr-1 flex items-center space-x-0.5 border-r pr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              disabled={disabled}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              disabled={disabled}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              icon={Heading3}
              disabled={disabled}
            />
          </div>

          {/* Formatting */}
          <div className="mr-1 flex items-center space-x-0.5 border-r pr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={Bold}
              disabled={disabled}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={Italic}
              disabled={disabled}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={Quote}
              disabled={disabled}
            />
          </div>

          {/* Lists */}
          <div className="mr-1 flex items-center space-x-0.5 border-r pr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={List}
              disabled={disabled}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={ListOrdered}
              disabled={disabled}
            />
          </div>

          {/* Insert */}
          <div className="flex items-center space-x-0.5">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              icon={Code2}
              label="Code Block"
              disabled={disabled}
            />

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
              icon={TableIcon}
              label="Insert Table"
              disabled={disabled}
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={triggerFileInput}
              type="button"
              disabled={disabled || isUploading}
              title="Insert Image/Video"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isUploading && (
          <div className="text-muted-foreground hidden items-center gap-2 pr-1 text-xs sm:flex">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Uploading…
          </div>
        )}
      </div>

      <EditorContent editor={editor} />

      <div className="text-muted-foreground bg-muted/10 flex items-center gap-2 border-t px-3 py-2 text-xs">
        <span>Support: Drag & Drop Image/Video, Syntax Highlighting</span>
      </div>
    </div>
  );
});
