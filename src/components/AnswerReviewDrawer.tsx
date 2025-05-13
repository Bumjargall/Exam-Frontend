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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { updateResult } from "@/lib/api";
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
  studentName: string;
  questions: QuestionReview[];
  onSave: (updatedAnswers: QuestionReview[]) => void;
};

const AnswerReviewDrawer: React.FC<Props> = ({
  examEdit,
  studentName,
  questions,
  onSave,
}) => {
  const [editedAnswers, setEditedAnswers] =
    useState<QuestionReview[]>(questions);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setEditedAnswers(questions);
  }, [questions]);

  const handleScoreChange = (questionId: string, newScore: number) => {
    const updated = editedAnswers.map((q) =>
      q.questionId === questionId ? { ...q, score: newScore } : q
    );
    setEditedAnswers(updated);
  };

  // Removed question type icon function

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
              <Card key={q.questionId} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-4 border-b flex gap-2 items-start">
                    <div className="bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {stripHtmlTags(originalQuestion.question)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Хариулт:
                    </p>

                    {isMultipleChoice && (
                      <div className="pl-2 space-y-1 mb-4">
                        {originalQuestion?.answers?.map((item, idx) => {
                          const isSelectedByStudent = Array.isArray(q.answer)
                            ? (q.answer as string[]).includes(item.text)
                            : q.answer === item.text;
                          const isCorrect = item.isCorrect === true;

                          let textColor = "text-gray-700";
                          let bgColor = "bg-white";
                          let borderColor = "border-gray-200";
                          let icon = null;

                          if (isCorrect && isSelectedByStudent) {
                            textColor = "text-green-700";
                            bgColor = "bg-green-50";
                            borderColor = "border-green-200";
                            icon = <Check className="w-4 h-4 text-green-600" />;
                          } else if (!isCorrect && isSelectedByStudent) {
                            textColor = "text-red-700";
                            bgColor = "bg-red-50";
                            borderColor = "border-red-200";
                            icon = <X className="w-4 h-4 text-red-600" />;
                          } else if (isCorrect && !isSelectedByStudent) {
                            textColor = "text-green-700 opacity-50";
                            bgColor = "bg-green-50 opacity-50";
                            borderColor = "border-green-200";
                          }

                          return (
                            <div
                              key={idx}
                              className={`flex items-center space-x-2 p-2 rounded ${bgColor} ${textColor} border ${borderColor}`}
                            >
                              <div className="flex items-center justify-center w-5">
                                {icon}
                              </div>
                              <span className="ml-1">{item.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {originalQuestion.type === "simple-choice" &&
                      typeof q.answer === "string" && (
                        <div className="space-y-2 mb-4 pl-2">
                          {originalQuestion?.answers?.map(
                            (choice: any, index: number) => {
                              const isSelected = q.answer === choice.text;
                              // Simple-choice displays selection without right/wrong indication
                              const textColor = isSelected
                                ? "text-green-700"
                                : "text-gray-700";
                              const bgColor = isSelected
                                ? "bg-green-50"
                                : "bg-white";
                              const borderColor = isSelected
                                ? "border-green-200"
                                : "border-gray-200";

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center space-x-2 p-2 rounded ${bgColor} ${textColor} border ${borderColor}`}
                                >
                                  <div className="flex items-center justify-center w-5">
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                  </div>
                                  <span className="ml-1">{choice.text}</span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                    {originalQuestion?.type === "free-text" && (
                      <div className="mb-4">
                        <div className="border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-800 min-h-24">
                          {String(q.answer)}
                        </div>
                      </div>
                    )}

                    {originalQuestion.type === "code" && (
                      <div className="mb-4">
                        <div className="border border-gray-300 rounded-md p-3 font-mono text-sm bg-gray-900 text-gray-100 overflow-x-auto">
                          <pre className="whitespace-pre-wrap">
                            {String(q.answer)}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm font-medium text-gray-600">
                        {isMultipleChoice ||
                        originalQuestion.type === "simple-choice" ? (
                          <div className="flex items-center">
                            <span>
                              {isMultipleChoice ? "Авсан оноо:" : "Авсан оноо:"}
                            </span>
                            <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded">
                              {isMultipleChoice
                                ? `${q.score} оноо`
                                : `${q.score} оноо`}
                            </span>
                          </div>
                        ) : (
                          <span>Оноо:</span>
                        )}
                      </div>

                      {isManualGrading && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={q.score ?? ""}
                            onChange={(e) =>
                              handleScoreChange(
                                q.questionId,
                                Number(e.target.value)
                              )
                            }
                            className="w-24 text-center border-gray-300"
                            placeholder="Оноо"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DrawerFooter className="px-0">
          <Button
            onClick={async () => {
              try {
                await updateResult({
                  questions: editedAnswers,
                });
                onSave(editedAnswers);
                setIsOpen(false);
              } catch (error) {
                console.error("Оноо шинэчлэхэд алдаа гарлаа:", error);
              }
            }}
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
