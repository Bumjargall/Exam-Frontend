"use client";
import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Mark } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X, Trash2, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import MarkingRules from "@/components/create-exam/MarkingRules";
import NewAnswerOption from "@/components/create-exam/NewAnswerOption";

type FillChoiceProps = {
  handleSelect: (type: string | null) => void;
  setExam: React.Dispatch<React.SetStateAction<any[]>>;
  exam: any[];
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};
export default function FillChoice({
  handleSelect,
  editingIndex,
  setEditingIndex,
  setSelectedType,
}: FillChoiceProps) {
  const [questionContent, setQuestionContent] = useState<string>("");
  const [addAnswer, setAddAnswer] = useState<{ text: string }[]>([]);
  const [score, setScore] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setQuestionContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editingIndex !== null) {
      const current = exam[editingIndex];
      setQuestionContent(current.question);
      setAddAnswer(current.answers);
      setScore(current.score);
      editor?.commands.setContent(current.question);
    }
  }, [editingIndex, exam, editor]);
  const handleOptionsChange = (
    newOptions: { text: string; isCorrect: boolean }[]
  ) => {
    setOptions(newOptions);
  };

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
    if (!questionContent.trim()) {
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
      type: "fill-choice",
      question: editor?.getText() || "",
      answers: addAnswer,
      score: score,
    };

    setExam((prevExam) => {
      if (editingIndex !== null) {
        const updated = [...prevExam];
        updated[editingIndex] = newData;
        return updated;
      } else {
        const updateExam = [...prevExam, newData];
        console.log("exam--->", updateExam);
        //final data
        return updateExam;
      }
    });
    {
      /*
      setExam((prev) => {
      const updateExam = [...prev, newData];
      console.log("exam--->", updateExam);
      //final data
      return updateExam;
    });
      */
    }
    handleSelect(null);
    setEditingIndex(null);
    setSelectedType(null);
  };
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Нөхөх</p>
        </div>
        <button
          className="cursor-pointer pr-4"
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
        <NewAnswerOption
          onOptionsChange={handleOptionsChange}
          initialOptions={options}
        />
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
