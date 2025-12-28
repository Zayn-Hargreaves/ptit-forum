"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Video } from "./extensions/video";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs/tabs";
import { Button } from "@shared/ui/button/button";
import {
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Paperclip,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import DOMPurify from "isomorphic-dompurify";
import { useFileUpload } from "@shared/hooks/use-file-upload";

interface GithubEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function GithubEditor({ value, onChange }: Readonly<GithubEditorProps>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { upload, isUploading } = useFileUpload({
    validate: {
      maxSizeMB: 10,
      acceptedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
      ],
    },
    onError: () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleUpload = useCallback(
    async (file: File): Promise<string | null> => {
      const result = await upload(file, "/files/upload", "POST");
      if (result?.url) {
        return result.url;
      }
      return null;
    },
    [upload]
  );

  const insertMediaToEditor = (
    editor: Editor | null,
    type: string,
    url: string
  ) => {
    if (!editor) return;

    if (type.startsWith("video/")) {
      editor
        .chain()
        .focus()
        .setVideo({
          src: url,
          controls: true,
          className: "rounded-md max-w-full my-4",
        })
        .run();
    } else {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      Video,
      Placeholder.configure({ placeholder: "Nhập nội dung của bạn..." }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground prose dark:prose-invert max-w-none [&_img]:rounded-md [&_video]:rounded-md",
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((item) => item.kind === "file")?.getAsFile();

        if (file) {
          event.preventDefault();
          handleUpload(file).then((url) => {
            if (url) insertMediaToEditor(editor, file.type, url);
          });
          return true;
        }
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          handleUpload(file).then((url) => {
            if (url) insertMediaToEditor(editor, file.type, url);
          });
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const triggerFileInput = () => fileInputRef.current?.click();

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = await handleUpload(file);
      if (url) {
        insertMediaToEditor(editor, file.type, url);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const previewContent = DOMPurify.sanitize(editor.getHTML());

  return (
    <div className="rounded-md border border-input bg-background relative">
      {isUploading && (
        <div className="absolute inset-0 z-50 bg-background/60 flex items-center justify-center backdrop-blur-[1px] rounded-md transition-all">
          <div className="flex flex-col items-center gap-2 bg-background p-4 rounded-lg shadow-lg border">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Đang tải media...
            </span>
          </div>
        </div>
      )}

      <Tabs defaultValue="write" className="w-full">
        <div className="flex items-center justify-between border-b px-2 py-1 bg-muted/40">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={onFileSelect}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold") ? "is-active" : undefined}
            >
              <Bold className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic") ? "is-active" : undefined}
            >
              <Italic className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              data-active={
                editor.isActive("bulletList") ? "is-active" : undefined
              }
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="p-0 m-0">
          <EditorContent editor={editor} />

          <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center gap-2 bg-muted/20">
            <Paperclip className="h-3 w-3" />
            <span>Kéo thả hoặc dán ảnh/video vào đây (Max 10MB)</span>
          </div>
        </TabsContent>

        <TabsContent
          value="preview"
          className="p-4 m-0 min-h-[200px] prose dark:prose-invert max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
