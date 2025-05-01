import React, { useEffect, useState } from "react";
import MarkingRules from "@/components/create-exam/MarkingRules";
import { X } from "lucide-react";
import RichTextEditor from "@/components/TinyMce/RichTextEditor";
import NewAnswerOption from "@/components/create-exam/NewAnswerOption";
import { useExamStore } from "@/store/ExamStore";
import {
  ListOrdered,
  Shuffle,
  CheckSquare,
  CircleDot,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { string } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEditor } from "@tiptap/react";
import { Exam, Question } from "@/lib/types/interface";
//import { ExamQuestion } from "@/store/ExamStore";

type functionType = {
  handleSelect: (type: string | null) => void;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};
export default function NewMultipleChoice({
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
  const addQuestion = useExamStore((s) => s.addQuestion);
  const { exam, updateQuestion, setExam } = useExamStore();
  type answerOption = {
    text: string;
    isCorrect: boolean;
  };
  type ExamQuestion = {
    id: string;
    type: string;
    question: string;
    answers: answerOption[];
    score?: number;
  };
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
      });
    }
  }, []);
  const handleOptionsChange = (
    newOptions: { text: string; isCorrect: boolean }[]
  ) => {
    setOptions(newOptions);
  };
  useEffect(() => {
    if (editingIndex !== null) {
      const current: any = exam?.questions[editingIndex];
      setCurrentQuestion(current.question);
      setOptions(current.answers ? current.answers : []);
      setScore(current.score ? current.score : 0);
    }
  }, [editingIndex, exam]);
  const addExam = () => {
    if (!currentQuestion || options.length === 0) {
      toast.error("Асуулт эсвэл хариулт оруулна уу.");
      return;
    }
    if (score === 0) {
      toast("Та оноогоо тохируулж өгнө үү!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    const examData: ExamQuestion = {
      type: "multiple-choice",
      id: Date.now().toString(),
      question: currentQuestion,
      answers: options,
      score: score,
    };
    if (editingIndex !== null) {
      updateQuestion(editingIndex, examData);
      toast.success("Асуулт амжилттай засагдлаа");
    } else {
      addQuestion(examData);
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
      <div className="bg-gray-100 flex items-center justify-between">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Олон сонголт</p>
        </div>
        <button
          type="button"
          className="cursor-pointer pr-4"
          onClick={() => {
            handleSelect(null), setEditingIndex(null), setSelectedType(null);
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
      </div>

      {/*Save button */}
      <div className="rounded-b-lg border-t">
        <div className="py-5">
          <div className="text-center text-gray-900">
            <button
              onClick={addExam}
              className="py-2 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100 cursor-pointer"
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
