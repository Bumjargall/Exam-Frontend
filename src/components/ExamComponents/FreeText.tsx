import React, { useState } from "react";
import Texteditor from "@/components/rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import AnswerOption from "@/components/create-exam/AnswerOption";
import MarkingRules from "@/components/create-exam/MarkingRules";
import SimpleAnswerOption from "@/components/create-exam/SimpleAnswerOption";
import { X } from "lucide-react";
import { toast } from "sonner";
type functionType = {
  handleSelect: (type: string | null) => void;
  setExam: React.Dispatch<React.SetStateAction<any[]>>;
  exam: any[];
};
export default function FreeChoice({
  handleSelect,
  exam,
  setExam,
}: functionType) {
  const [questionData, setQuestionData] = useState<string>("");
  const [score, setScore] = useState<number>(0);

  const handleSave = () => {
    if (!questionData.trim()) {
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
    const newQuestion = {
      type: "free-text",
      question: questionData,
      score: score,
    };
    setExam((prevExam) => {
      const updatedExam = [...prevExam, newQuestion];
      console.log("exam--->", updatedExam);
      return updatedExam;
    });
    handleSelect(null); // Form-oo хаах
  };
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Эссэ</p>
        </div>
        <button
          className="cursor-pointer pr-4"
          onClick={() => handleSelect(null)}
        >
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <Texteditor
          questionData={questionData}
          setQuestionData={setQuestionData}
        />
        <MarkingRules score={score} setScore={setScore} />
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
