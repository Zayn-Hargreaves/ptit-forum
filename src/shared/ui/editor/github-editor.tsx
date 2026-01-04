"use client";

import { useEditor, EditorContent } from "@tiptap/react";
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
} from "lucide-react";
import { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import DOMPurify from "isomorphic-dompurify";

interface GithubEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function GithubEditor({ value, onChange }: Readonly<GithubEditorProps>) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn! Chỉ cho phép < 10MB");
      return null;
    }

    setIsUploading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const url = URL.createObjectURL(file);
    setPreviewUrls((prev) => [...prev, url]);

    setIsUploading(false);
    return url;
  }, []);

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
          "min-h-[200px] w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground prose dark:prose-invert max-w-none",
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((item) => item.kind === "file")?.getAsFile();

        if (file) {
          event.preventDefault();
          handleUpload(file).then((url) => {
            if (!url) return;
            insertMediaToEditor(editor, file.type, url);
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
            if (!url) return;
            insertMediaToEditor(editor, file.type, url);
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

  const insertMediaToEditor = (editor: any, type: string, url: string) => {
    if (type.startsWith("video/")) {
      editor
        ?.chain()
        .focus()
        .insertContent(`<video src="${url}"></video>`)
        .run();
    } else {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const triggerFileInput = () => fileInputRef.current?.click();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      handleUpload(file).then((url) => {
        if (!url) return;
        insertMediaToEditor(editor, file.type, url);
      });
    }
  };

  const previewContent = DOMPurify.sanitize(editor.getHTML());

  return (
    <div className="rounded-md border border-input bg-background">
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
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={triggerFileInput}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="p-0 m-0 relative">
          <EditorContent editor={editor} />
          {isUploading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center text-sm font-medium text-primary">
              Đang tải file lên...
            </div>
          )}
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
