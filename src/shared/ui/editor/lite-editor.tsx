'use client';

import { ALLOWED_MEDIA_MINES } from '@shared/constants/constants';
import { useFileUpload } from '@shared/hooks/use-file-upload';
import { Button } from '@shared/ui/button/button';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import ts from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';
import { Bold, Code2, ImageIcon, Italic, Loader2 } from 'lucide-react';
import { Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

const lowlight = createLowlight(common);
lowlight.register('ts', ts);
lowlight.register('typescript', ts);
lowlight.register('js', javascript);
lowlight.register('javascript', javascript);
lowlight.register('json', json);
lowlight.register('html', xml);
lowlight.register('xml', xml);
lowlight.register('css', css);
lowlight.register('bash', bash);
lowlight.register('sh', bash);
lowlight.register('python', python);

interface LiteEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
}

const isImageFile = (file: File) => (file.type || '').toLowerCase().startsWith('image/');

const FIREBASE_BUCKET_URL =
  'https://firebasestorage.googleapis.com/v0/b/graduated-project-17647.firebasestorage.app/o/';

export function LiteEditor({
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus,
  onSubmit,
}: Readonly<LiteEditorProps>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { upload, isUploading } = useFileUpload({
    validate: {
      maxSizeMB: 10,
      acceptedTypes: ALLOWED_MEDIA_MINES,
    },
    onError: () => {
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
  });

  const handleUploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!isImageFile(file)) {
        toast.error('LiteEditor chỉ hỗ trợ ảnh.', {
          description: `File "${file.name}" vui lòng upload ở mục "Attachments" nếu là tài liệu/video.`,
        });
        return null;
      }

      const result = await upload(file, '/files/upload', 'POST', 'file', {
        resourceType: 'COMMENT',
      });

      const resultData = Array.isArray(result) ? result[0] : result;
      let finalUrl = resultData?.url;
      if (finalUrl && !finalUrl.startsWith('http')) {
        finalUrl = `${FIREBASE_BUCKET_URL}${finalUrl}`;
      }

      return finalUrl ?? resultData?.fileName ?? null;
    },
    [upload],
  );

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        horizontalRule: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'ts',
      }),
      Image.configure({ inline: true, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || 'Viết bình luận...' }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    autofocus: autoFocus,
    extensions,

    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const editorProps = useMemo(
    () => ({
      attributes: {
        class:
          'min-h-[80px] w-full bg-background px-3 py-2 text-sm outline-none ' +
          'prose dark:prose-invert max-w-none ' +
          'prose-pre:my-1 prose-p:my-0 ' +
          '[&_img]:rounded-md [&_img]:max-h-[220px] [&_img]:object-contain',
      },

      handlePaste: (_view: EditorView, event: ClipboardEvent) => {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((i: DataTransferItem) => i.kind === 'file')?.getAsFile();
        if (!file) return false;

        if (!isImageFile(file)) {
          event.preventDefault();
          toast.error('LiteEditor chỉ hỗ trợ ảnh khi paste.');
          return true;
        }

        event.preventDefault();
        handleUploadImage(file).then((url) => {
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        });

        return true;
      },

      handleDrop: (_view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) => {
        if (moved) return false;

        const file = event.dataTransfer?.files?.[0];
        if (!file) return false;

        if (!isImageFile(file)) {
          event.preventDefault();
          toast.error('LiteEditor chỉ hỗ trợ ảnh khi kéo thả.');
          return true;
        }

        event.preventDefault();
        handleUploadImage(file).then((url) => {
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        });

        return true;
      },

      handleKeyDown: (_view: EditorView, event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'Enter') {
          onSubmit?.();
          return true;
        }
        return false;
      },
    }),
    [handleUploadImage, onSubmit, editor],
  );

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({ editorProps });
  }, [editor, editorProps]);

  useEffect(() => {
    if (!editor) return;
    if (value === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.clearContent();
    } else if (value && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const triggerPick = () => fileInputRef.current?.click();

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      toast.error('LiteEditor chỉ hỗ trợ ảnh.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const url = await handleUploadImage(file);
    if (url) editor?.chain().focus().setImage({ src: url }).run();

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!editor) return null;

  return (
    <div className="focus-within:ring-primary/50 bg-background relative overflow-hidden rounded-md border transition-all focus-within:ring-1">
      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onPickFile}
        disabled={disabled}
      />

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Toolbar lite */}
      <div className="bg-muted/20 flex items-center gap-1 border-t p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          title="Bold"
        >
          <Bold className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          title="Italic"
        >
          <Italic className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
          title="Code Block"
        >
          <Code2 className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          type="button"
          onClick={triggerPick}
          disabled={disabled || isUploading}
          title="Insert Image"
        >
          <ImageIcon className="h-3 w-3" />
        </Button>

        {isUploading && (
          <Loader2 className="text-muted-foreground mr-2 ml-auto h-3 w-3 animate-spin" />
        )}
      </div>
    </div>
  );
}
