"use client";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";

interface ExamEditorProps {
  onContentChange: (content: string) => void;
  label?: string;
  initialContent?: string;
}

export default function ExamEditor({
  onContentChange,
  label = "Асуулт",
  initialContent = "",
}: ExamEditorProps) {
  const [content, setContent] = useState(initialContent);
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          value={content}
          apiKey="64obz7s31vhobbp3z9dc8eenri9u1dhep1ni642kv8hkcthd"
          init={{
            height: 300,
            menubar: false,
            directionality: "ltr",
            forced_root_block_attrs: { dir: "ltr" },
            plugins: [
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
            content_style:
              "body { font-family:Inter,sans-serif; font-size:16px; direction: ltr; }",
          }}
          onEditorChange={(newContent) => {
            onContentChange(newContent);
            setContent(newContent);
          }}
        />
      </div>
    </div>
  );
}
