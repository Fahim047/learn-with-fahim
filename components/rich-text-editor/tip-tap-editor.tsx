"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./menu-bar";
import { useEffect } from "react";

interface TipTapEditorProps {
  field: {
    value: string | undefined;
    onChange: (value: string) => void;
  };
}

export default function TipTapEditor({ field }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign],
    immediatelyRender: false,
    content: field.value ? JSON.parse(field.value) : undefined, // initial load only
    editorProps: {
      attributes: {
        class: "w-full min-h-[350px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  // ✅ Reset handler: only run when field.value changes due to form.reset()
  useEffect(() => {
    if (!editor) return;

    if (!field.value) {
      editor.commands.clearContent();
    } else {
      const currentContent = JSON.stringify(editor.getJSON());
      if (currentContent !== field.value) {
        editor.commands.setContent(JSON.parse(field.value));
      }
    }
  }, [field.value, editor]);

  return (
    <div className="w-full border rounded">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
