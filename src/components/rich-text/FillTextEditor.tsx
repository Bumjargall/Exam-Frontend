"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImperativeHandle, forwardRef } from "react";

interface TextEditorProps {
  onAddGap: (gapText: string) => void;
}

const TextEditor = forwardRef(({ onAddGap }: TextEditorProps, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // External ref-д editor-ийн утгыг авах боломж олгоно
  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getHTML() || "",
  }));

  const handleAddGap = () => {
    if (!editor) return;
    const gap = `N`; // Gap текст
    editor.commands.insertContent(gap);
    onAddGap(gap); // addAnswer-д хадгалах
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-lg p-2 bg-white">
        <EditorContent editor={editor} />
      </div>
      <button
        type="button"
        className="py-1 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100"
        onClick={handleAddGap}
      >
        Gap
      </button>
    </div>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;
