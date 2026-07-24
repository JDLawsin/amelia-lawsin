"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/shadcn/button";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  ImageIcon,
  LinkIcon,
  Pilcrow,
} from "lucide-react";
import { TipTapDoc } from "../_schema/blog.schema";
import clsx from "clsx";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
};

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    onClick={onClick}
    title={title}
    className={clsx("h-8 w-8 rounded-lg", isActive && "bg-cloud text-ink")}
  >
    {children}
  </Button>
);

type Props = {
  value: TipTapDoc;
  onChange: (value: TipTapDoc) => void;
  error?: string;
};

const TipTapEditor = ({ value, onChange, error }: Props) => {
  const lastEmittedRef = useRef<string>(JSON.stringify(value));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "max-w-none min-h-[240px] p-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON() as TipTapDoc;
      lastEmittedRef.current = JSON.stringify(json);
      onChange(json);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = JSON.stringify(value);
    if (
      incoming !== lastEmittedRef.current &&
      incoming !== JSON.stringify(editor.getJSON())
    ) {
      editor.commands.setContent(value, { emitUpdate: false });
      lastEmittedRef.current = incoming;
    }
  }, [value, editor]);

  if (!editor) return null;

  const toggleHeading = (level: 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white overflow-hidden",
        error ? "border-destructive" : "border-wire",
      )}
    >
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-wire bg-cloud/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Pilcrow className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => toggleHeading(2)}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => toggleHeading(3)}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton onClick={addLink} title="Link">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton onClick={addImage} title="Image">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      {error && (
        <p className="text-[10px] text-destructive px-3 pb-2">{error}</p>
      )}
    </div>
  );
};

export default TipTapEditor;
