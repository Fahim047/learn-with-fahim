"use client";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import parse from "html-react-parser";

export default function RichTextPreview({ doc }: { doc: JSONContent }) {
  const output = useMemo(() => {
    return generateHTML(doc, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [doc]);

  return (
    <div className="w-full prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
