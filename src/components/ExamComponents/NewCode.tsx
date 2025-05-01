import React, { useEffect, useState } from "react";
import MarkingRules from "@/components/create-exam/MarkingRules";
import RichTextEditor from "@/components/TinyMce/RichTextEditor";
import { useExamStore } from "@/store/ExamStore";
import { X } from "lucide-react";
import { toast } from "sonner";
type functionType = {
  handleSelect: (type: string | null) => void;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};
export default function NewCode({
  handleSelect,
  editingIndex,
  setEditingIndex,
  setSelectedType,
}: functionType) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [score, setScore] = useState<number>(0);
  const addQuestion = useExamStore((s) => s.addQuestion);
  const { exam, updateQuestion, setExam } = useExamStore();
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
  useEffect(() => {
    if (editingIndex !== null) {
      const current: any = exam?.questions[editingIndex];
      setCurrentQuestion(current.question);
      setScore(current.score ? current.score : 0);
    }
  }, [editingIndex, exam]);
  const addExam = () => {
    if (!setCurrentQuestion) {
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
    const examData = {
      type: "code",
      id: Date.now().toString(),
      question: currentQuestion,
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
    setScore(0);
    handleSelect(null); // Form-oo хаах
    setEditingIndex(null);
    setSelectedType(null);
  };
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Кодын шалгалт</p>
        </div>
        <button
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
        <MarkingRules score={score} setScore={setScore} initialScore={score} />
      </div>
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
  );
}
