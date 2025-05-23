"use client";
import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X, Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import MarkingRules from "../create-exam/MarkingRules";
import { useExamStore } from "@/store/ExamStore";

type functionType = {
  handleSelect: (type: string | null) => void;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function FillChoice({
  handleSelect,
  editingIndex,
  setEditingIndex,
  setSelectedType,
}: functionType) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState<{ text: string; editMode: boolean }[]>(
    []
  );
  const [score, setScore] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const addQuestion = useExamStore((s) => s.addQuestion);
  const { exam, updateQuestion, setExam } = useExamStore();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setCurrentQuestion(editor.getHTML());
    },
  });
  useEffect(() => {
    if (!exam) {
      setExam({
        title: "",
        description: "",
        questions: [],
        dateTime: "",
        duration: 0,
        totalScore: 0,
        status: "inactive",
        key: "",
        createUserById: "",
      });
    }
  }, []);

  useEffect(() => {
    if (editingIndex !== null) {
      const current: any = exam?.questions[editingIndex];
      setCurrentQuestion(current.question);
      setOptions(current.answers);
      setScore(current.score);
      editor?.commands.setContent(current.question);
    }
  }, [editingIndex, exam, editor]);

  const handleAddGap = () => {
    if (!editor) return;
    const gap = `{gap-${options.length + 1}}`; // Gap текст
    editor.commands.insertContent(gap);
    setOptions((prev) => [
      ...prev,
      { text: `Gap ${prev.length + 1}`, editMode: false },
    ]);
  };

  const handleEditText = (index: number, newText: string) => {
    const updated = [...options];
    updated[index].text = newText;
    setOptions(updated);
  };

  const handleDeleteAnswer = (index: number) => {
    if (!editor) return;
    // Editor-аас Gap устгах
    if (editor) {
      const gapText = `{gap-${index + 1}}`;
      let content = editor.getHTML();
      content = content.replaceAll(gapText, "");
      editor.commands.setContent(content);
      const updatedAnswers = options.filter((_, i) => i !== index);

      //үлдсэн gap дугаар шинэчлэх
      updatedAnswers.forEach((_, i) => {
        const oldGap = `{gap-${i + 2}}`;
        const newGap = `{gap-${i + 1}}`;
        content = content.replaceAll(oldGap, newGap);
      });
      //editor агуулгын шинэчлэх
      editor.commands.setContent(content);
      //state шинэчлэх
      setOptions(updatedAnswers);
    }
  };

  const toggleEditMode = (index: number) => {
    const updated = [...options];
    updated[index].editMode = !updated[index].editMode;
    setOptions(updated);
  };
  const handleSave = () => {
    if (!currentQuestion.trim()) {
      toast("Асуултын текст хоосон байна!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    if (score === 0) {
      toast("Та оноогоо тохируулж өгнө үү!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    const newData = {
      type: "fill-choice" as const,
      _id: Date.now().toString(),
      question: editor?.getText() || "",
      answers: options,
      score: score,
    };
    if (editingIndex !== null) {
      updateQuestion(editingIndex, newData);
      toast.success("Асуулт амжилттай засагдлаа");
    } else {
      addQuestion(newData);
      toast.success("Асуулт амжилттай нэмэгдлээ!");
    }
    setCurrentQuestion("");
    setOptions([]);
    setScore(0);
    handleSelect(null);
    setEditingIndex(null);
    setSelectedType(null);
  };
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-green-400 rounded-2xl flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-white">Нөхөх</p>
        </div>
        <button
          className="cursor-pointer pr-4 text-white"
          onClick={() => {
            handleSelect(null);
            setEditingIndex(null);
            setSelectedType(null);
          }}
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
                {options.map((answer, index) => (
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
        <MarkingRules score={score} setScore={setScore} initialScore={score} />
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
