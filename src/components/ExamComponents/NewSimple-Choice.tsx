import React, { useState, useEffect } from "react";
import Texteditor from "@/components/rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import SimpleAnswerOption from "@/components/create-exam/SimpleAnswerOption";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RichTextEditor from "@/components/TinyMce/RichTextEditor";
import NewAnswerOption from "@/components/create-exam/NewAnswerOption";
import MarkingRules from "@/components/create-exam/MarkingRules";
import { useExamStore } from "@/store/ExamStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ListOrdered,
  Shuffle,
  CheckSquare,
  CircleDot,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
type functionType = {
  handleSelect: (type: string | null) => void;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function NewSimpleChoice({
  handleSelect,
  editingIndex,
  setEditingIndex,
  setSelectedType,
}: functionType) {
  const [options, setOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [score, setScore] = useState<number>(0);
  const addToExam = useExamStore((s) => s.addToExam);
  const { exams, updateExam } = useExamStore();
  const handleOptionsChange = (
    newOptions: { text: string; isCorrect: boolean }[]
  ) => {
    setOptions(newOptions);
  };
  useEffect(() => {
    if (editingIndex !== null) {
      const current = exams[editingIndex];
      setCurrentQuestion(current.question);
      setOptions(current.answers ? current.answers : []);
      setScore(current.score ? current.score : 0);
    }
  }, [editingIndex, exams]);
  const addExam = () => {
    if (!currentQuestion || options.length === 0) {
      toast("Асуултын болон хариултын текст хоосон байна!", {
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
    const examData = {
      type: "simple-choice",
      id: Date.now().toString(),
      question: currentQuestion,
      answers: options,
      score: score,
    };
    if (editingIndex !== null) {
      updateExam(editingIndex, examData);
      toast.success("Асуулт амжилттай засагдлаа!");
    } else {
      addToExam(examData);
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
      <div className="flex justify-between items-center bg-gray-100">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Богино хариулт</p>
        </div>
        <button
          type="button"
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
        <RichTextEditor
          onContentChange={setCurrentQuestion}
          label="Асуулт"
          initialContent={currentQuestion}
        />
        <NewAnswerOption
          onOptionsChange={handleOptionsChange}
          initialOptions={options}
        />
        <MarkingRules score={score} setScore={setScore} initialScore={score} />
        {/*Save button */}
        <div className="rounded-b-lg border-t">
          <div className="py-5">
            <div className="text-center text-gray-900">
              <button
                className="py-2 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100 cursor-pointer"
                onClick={addExam}
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
