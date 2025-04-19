"use client";
import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X, Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";

type FillChoiceProps = {
  handleSelect: (type: string | null) => void;
  setExam: React.Dispatch<React.SetStateAction<any[]>>;
  exam: any[];
};
export default function FillChoice({
  handleSelect,
  setExam,
  exam,
}: FillChoiceProps) {
  const [questionContent, setQuestionContent] = useState<string>("");
  const [addAnswer, setAddAnswer] = useState<
    { text: string; editMode: boolean }[]
  >([]);
  const [score, setScore] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setQuestionContent(editor.getHTML());
    },
  });

  const handleAddGap = () => {
    if (!editor) return;
    const gap = `{gap-${addAnswer.length + 1}}`; // Gap текст
    editor.commands.insertContent(gap);
    setAddAnswer((prev) => [
      ...prev,
      { text: `Gap ${prev.length + 1}`, editMode: false },
    ]);
  };

  const handleEditText = (index: number, newText: string) => {
    const updated = [...addAnswer];
    updated[index].text = newText;
    setAddAnswer(updated);
  };

  const handleDeleteAnswer = (index: number) => {
    if (!editor) return;
    // Editor-аас Gap устгах
    if (editor) {
      const gapText = `{gap-${index + 1}}`;
      let content = editor.getHTML();
      content = content.replaceAll(gapText, "");
      editor.commands.setContent(content);

      const updatedAnswers = addAnswer.filter((_, i) => i !== index);

      //үлдсэн gap дугаар шинэчлэх
      updatedAnswers.forEach((_, i) => {
        const oldGap = `{gap-${i + 2}}`;
        const newGap = `{gap-${i + 1}}`;
        content = content.replaceAll(oldGap, newGap);
      });
      //editor агуулгын шинэчлэх
      editor.commands.setContent(content);
      //state шинэчлэх
      setAddAnswer(updatedAnswers);
    }
  };

  const toggleEditMode = (index: number) => {
    const updated = [...addAnswer];
    updated[index].editMode = !updated[index].editMode;
    setAddAnswer(updated);
  };
  const handleSave = () => {
    const newData = {
      type: "fill-choice",
      question: editor?.getText() || "",
      answers: addAnswer,
      score: score,
    };
    setExam((prevExam) => {
      const updateExam = [...exam, newData];

      console.log(updateExam)
      //final data
      return updateExam

    });
    // буцах
    handleSelect(null);
  };
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Нөхөх</p>
        </div>
        <button
          className="cursor-pointer pr-4"
          onClick={() => handleSelect(null)}
        >
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        {/*Editor */}
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
        {/*Answer option */}

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg cursor-pointer">
            <span className="text-gray-600">Хариултууд:</span>
          </div>
          <div className="flex flex-col space-y-5 bg-gray-100 p-3 py-5">
            <div className="flex flex-col space-y-2">
              <div>
                <p>Gaps</p>
              </div>
              <div className="space-y-3">
                {addAnswer.map((answer, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-white py-2 px-3 w-full border rounded-lg space-x-3"
                  >
                    <div className="flex items-center w-full">
                      {answer.editMode ? (
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleEditText(index, e.target.value)
                          }
                          className="border border-gray-400 py-1 rounded-lg px-2 items-center w-full"
                        />
                      ) : (
                        <span className="text-gray-900">
                          {index + 1}. {answer.text}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center space-x-2">
                      <button
                        className="p-2 bg-red-500 rounded-lg cursor-pointer"
                        onClick={() => handleDeleteAnswer(index)}
                      >
                        <Trash2 size={18} color="white" />
                      </button>
                      <button
                        className="p-2 bg-gray-900 rounded-lg cursor-pointer"
                        onClick={() => toggleEditMode(index)}
                      >
                        <Pencil size={18} color="white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/*Marking rules */}

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg cursor-pointer"
          >
            <span className="text-gray-600 pl-3">Marking rules</span>
            <svg
              className={`w-3 h-3 transform transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
          {open && (
            <div className="p-5 bg-gray-100 rounded-b-lg border-b">
              <label className="font-medium text-gray-900 mb-2 block">
                Шалгалтын оноо
              </label>
              <input
                name="number"
                type="number"
                className="rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>
      {/*Save button */}
      <div className="rounded-b-lg border-t">
        <div className="py-5">
          <div className="text-center text-gray-900">
            <button
              className="py-2 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100"
              onClick={handleSave}
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
