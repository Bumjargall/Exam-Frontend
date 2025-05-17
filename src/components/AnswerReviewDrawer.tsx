"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamInput } from "@/lib/types/interface";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import GapRenderer from "./ExamComponents/GapRenderer";
import { updateResultId } from "@/lib/api";

function stripHtmlTags(html: string) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

type QuestionReview = {
  questionId: string;
  answer: string | number | string[] | number[];
  score: number;
};

type Props = {
  examEdit: ExamInput;
  resultId: string;
  studentName: string;
  questions: QuestionReview[];
  onSave: (updatedAnswers: QuestionReview[]) => void;
};

const AnswerReviewDrawer: React.FC<Props> = ({
  examEdit,
  resultId,
  studentName,
  questions,
  onSave,
}) => {
  const [editedAnswers, setEditedAnswers] =
    useState<QuestionReview[]>(questions);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("resultId", resultId);
    setEditedAnswers(questions);
  }, [questions]);

  const handleScoreChange = (questionId: string, newScore: number) => {
    if (!isNaN(newScore)) {
      const updated = editedAnswers.map((q) =>
        q.questionId === questionId ? { ...q, score: newScore } : q
      );
      setEditedAnswers(updated);
    }
  };

  const handleSave = async () => {
    const totalScore = editedAnswers.reduce((sum, q) => sum + q.score, 0);
    console.log("TotalScore", totalScore);
    console.log("Result-id", resultId);
    console.log("questions", editedAnswers);
    const payload = {
      questions: editedAnswers,
      score: totalScore,
      pending: "on",
    };
    try {
      await updateResultId(resultId, payload);
      onSave(editedAnswers);
      setIsOpen(false);
      toast.success("Оноо амжилттай хадгалагдлаа");
    } catch (error) {
      console.error("Оноо хадгалахад алдаа гарлаа:", error);
      toast.error("Хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-md h-auto cursor-pointer"
        >
          {studentName}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-w-4xl mx-auto">
        <DrawerHeader className="px-0">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-blue-600">{studentName}</span> -{" "}
            {examEdit?.title}
          </DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Хариултууд
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 max-h-[70vh] overflow-auto py-4 px-1">
          {editedAnswers.map((q, idx) => {
            const originalQuestion = examEdit.questions.find(
              (oq) => oq._id === q.questionId
            );
            if (!originalQuestion) return null;

            const isMultipleChoice =
              originalQuestion.type === "multiple-choice";
            const isManualGrading = ["free-text", "code"].includes(
              originalQuestion.type
            );

            return (
              <div
                key={q.questionId}
                className="border rounded-md shadow bg-white"
              >
                <div className="bg-gray-50 p-4 border-b flex gap-2 items-start">
                  <div className="bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </div>
                  <div className="font-medium text-gray-800">
                    {originalQuestion.type === "fill-choice" ? (
                      <GapRenderer text={originalQuestion.question} />
                    ) : (
                      <span>{stripHtmlTags(originalQuestion.question)}</span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Хариулт:
                  </p>

                  {/* Fill-choice */}
                  {originalQuestion.type === "fill-choice" &&
                    Array.isArray(q.answer) &&
                    Array.isArray(originalQuestion.answers) &&
                    originalQuestion.answers.map((correct, idx) => {
                      const studentAnswer = (q.answer as string[])[idx] || "";
                      const isCorrect =
                        studentAnswer.trim().toLowerCase() ===
                        (correct.text?.trim().toLowerCase() || "");
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded mb-2 border ${
                            isCorrect
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-red-50 border-red-300 text-red-700"
                          }`}
                        >
                          <span className="font-medium">{idx + 1}.</span>{" "}
                          Хариулт: {studentAnswer || "—"}
                          <br />
                          <span className="text-sm italic">
                            {isCorrect
                              ? "Зөв"
                              : `Буруу, зөв нь: ${correct.text}`}
                          </span>
                        </div>
                      );
                    })}

                  {/* Multiple choice */}
                  {isMultipleChoice && (
                    <div className="pl-2 space-y-1 mb-4">
                      {originalQuestion.answers?.map((item, idx) => {
                        const isSelected = Array.isArray(q.answer)
                          ? (q.answer as string[]).includes(item.text)
                          : q.answer === item.text;
                        const isCorrect = item.isCorrect;

                        const state = isSelected
                          ? isCorrect
                            ? "correct"
                            : "wrong"
                          : isCorrect
                          ? "missed"
                          : "neutral";

                        const styles = {
                          correct:
                            "bg-green-50 text-green-700 border-green-200",
                          wrong: "bg-red-50 text-red-700 border-red-200",
                          missed:
                            "bg-green-50 opacity-50 text-green-700 border-green-200",
                          neutral: "bg-white text-gray-700 border-gray-200",
                        };

                        return (
                          <div
                            key={idx}
                            className={`flex items-center space-x-2 p-2 rounded border ${styles[state]}`}
                          >
                            <div className="w-5 text-center">
                              {isSelected &&
                                (isCorrect ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                ))}
                            </div>
                            <span>{item.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Simple choice */}
                  {originalQuestion.type === "simple-choice" &&
                    typeof q.answer === "string" &&
                    originalQuestion.answers?.map((choice, index) => {
                      const isSelected = q.answer === choice.text;
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 p-2 rounded border ${
                            isSelected
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-white text-gray-700 border-gray-200"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                          <span>{choice.text}</span>
                        </div>
                      );
                    })}

                  {/* Free-text */}
                  {originalQuestion.type === "free-text" && (
                    <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-800 min-h-24">
                      {String(q.answer)}
                    </div>
                  )}

                  {/* Code */}
                  {originalQuestion.type === "code" && (
                    <div className="border border-gray-300 rounded-md p-3 font-mono text-sm bg-gray-900 text-gray-100 overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {String(q.answer)}
                      </pre>
                    </div>
                  )}

                  {/* Score editor */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-600">
                      {isManualGrading ? "Оноо:" : "Авсан оноо:"}
                    </span>
                    {isManualGrading ? (
                      <Input
                        type="number"
                        value={q.score}
                        onChange={(e) =>
                          handleScoreChange(
                            q.questionId,
                            Number(e.target.value)
                          )
                        }
                        className="w-24 text-center border-gray-300"
                        placeholder="Оноо"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded">
                        {q.score} оноо
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DrawerFooter className="px-0 pt-4">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Хадгалах
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AnswerReviewDrawer;
