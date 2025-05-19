"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import QuestionList from "@/components/create-exam/QuestionList";
import { Button } from "@/components/ui/button";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import NewMultipleChoice from "@/components/ExamComponents/NewMultipleChoice";
import NewSimpleChoice from "@/components/ExamComponents/NewSimple-Choice";
import NewFreeText from "@/components/ExamComponents/NewFreeText";
import NewInformationBlock from "@/components/ExamComponents/NewInformation-block";
import NewCode from "@/components/ExamComponents/NewCode";
import NewFillChoice from "@/components/ExamComponents/NewFillChoice";
import { useExamStore } from "@/store/ExamStore";

export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const exam = useExamStore((s) => s.exam);
  const addQuestion = useExamStore((s) => s.addQuestion);
  const clearExam = useExamStore((s) => s.clearExam);
  const removeQuestion = useExamStore((s) => s.removeQuestion);

  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
  };

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col space-y-10">
        <div className="bg-white w-full space-y-10 border border-gray-200 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-green-400 rounded-t-lg border-b space-y-4 sm:space-y-0">
            <div></div>
            <Link
              href="/teacher/create-exam/configure"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-full font-semibold shadow-md transition-all duration-300 hover:from-green-600 hover:to-lime-600 hover:scale-105"
            >
              <i className="ri-check-double-line text-lg"></i>
              Баталгаажуулах
            </Link>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            {exam && exam.questions.length > 0 && (
              <div className="text-gray-900 space-y-5 border p-4 rounded-lg mb-10">
                <div className="flex items-center justify-between gap-3 bg-gray-100 p-3 rounded">
                  <span className="text-gray-800 font-semibold">
                    Шалгалтын асуултууд
                  </span>
                </div>
                <div className="space-y-4">
                  {exam.questions.map((item, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="flex items-center gap-2">
                          {index + 1}. <GapRenderer text={item.question} />
                        </h2>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => removeQuestion(item._id)}
                            variant="outline"
                          >
                            Устгах
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingIndex(index);
                              setSelectedType(item.type);
                            }}
                            variant="outline"
                          >
                            Засах
                          </Button>
                        </div>
                      </div>
                      {item.type === "multiple-choice" && (
                        <RadioGroup disabled className="my-3">
                          {item.answers?.map((answer, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 pl-6 font-semibold"
                            >
                              <RadioGroupItem
                                value={answer.text}
                                id={`question-${item._id}-answer-${idx}`}
                              />
                              <Label
                                htmlFor={`question-${item._id}-answer-${idx}`}
                              >
                                {answer.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      {item.type === "simple-choice" && (
                        <div className="flex justify-end my-6">
                          <Input
                            type="text"
                            disabled
                            placeholder="Хариулт..."
                            className="w-full sm:w-1/2 border-gray-900 rounded-lg pl-4 placeholder-gray-900"
                          />
                        </div>
                      )}
                      {(item.type === "free-text" || item.type === "code") && (
                        <div className="p-3 space-y-4">
                          <p className="font-semibold">Хариулт:</p>
                          <Textarea
                            disabled
                            placeholder="Type your message here."
                          />
                        </div>
                      )}
                      {item.type !== "information-block" && (
                        <p className="flex text-sm text-gray-600 justify-end mt-2">
                          Оноо: {item.score}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedType ? (
              <QuestionList handleSelect={handleSelectType} />
            ) : selectedType === "multiple-choice" ? (
              <NewMultipleChoice
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : selectedType === "simple-choice" ? (
              <NewSimpleChoice
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : selectedType === "fill-choice" ? (
              <NewFillChoice
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : selectedType === "free-text" ? (
              <NewFreeText
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : selectedType === "information-block" ? (
              <NewInformationBlock
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : selectedType === "code" ? (
              <NewCode
                handleSelect={handleSelectType}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                setSelectedType={setSelectedType}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
