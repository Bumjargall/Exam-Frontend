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
import { useExamStore } from "@/store/ExamStore";
import { updateExam } from "@/lib/api";

export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const exam = useExamStore((s) => s.exam);
  const addQuestion = useExamStore((s) => s.addQuestion);
  const removeQuestion = useExamStore((s) => s.removeQuestion);
  const setExam = useExamStore((s) => s.setExam);
  useEffect(() => {
    const localExam = localStorage.getItem("exams-edit-storage");
    if (localExam) {
      try {
        const parsed = JSON.parse(localExam);
        setExam(parsed);
      } catch (error) {
        setEditingIndex(null);
        console.log("LocalStorage error", error);
      }
    }
  }, []);
  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
  };
  const createExamHandleSave = () => {
    localStorage.removeItem("exams-edit-storage");
  };

  return (
    <div className="mt-10">
      <div className="max-w-4xl mx-auto flex">
        <div className="bg-white w-full space-y-20 border border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg border-b">
            <div></div>
            <div>
              <ul className="flex space-x-4">
                <li></li>
                <li>
                  <Link
                    href={`/teacher/exams/edit/${exam?._id}/configure`}
                    className="p-2.5 border border-gray-900 rounded-lg text-black hover:bg-gray-200"
                    onClick={() => createExamHandleSave()}
                  >
                    Баталгаажуулах
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-2xl mx-auto mb-20">
            {exam && exam.questions.length > 0 && (
              <div className="w-full text-gray-900 space-y-5 border p-4 rounded-lg mb-10">
                <div className="flex items-center justify-between gap-3 bg-gray-100 p-3 rounded">
                  <span className="text-gray-800 font-semibold rounded-lg">
                    Шалгалтын асуултууд
                  </span>
                </div>

                <div className="space-y-2">
                  {exam.questions.map((item, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="flex items-center gap-2">
                            {index + 1}. <GapRenderer text={item.question} />
                          </h2>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => {
                              removeQuestion(item.id);
                            }}
                            variant={"outline"}
                            className="cursor-pointer"
                          >
                            Утсгах
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingIndex(index);
                              setSelectedType(exam.questions[index].type);
                            }}
                            variant={"outline"}
                            className="cursor-pointer"
                          >
                            Засах
                          </Button>
                        </div>
                      </div>

                      {item.type === "multiple-choice" && (
                        <div className="text-gray-700 my-3">
                          <RadioGroup disabled>
                            {item.answers?.map((answer, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 pl-6 font-semibold"
                              >
                                <RadioGroupItem
                                  value={answer.text}
                                  id={`question-${item.id}-answer-${idx}`}
                                />
                                <Label
                                  htmlFor={`question-${item.id}-answer-${idx}`}
                                >
                                  {answer.text}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      {item.type === "simple-choice" && (
                        <div className="flex justify-end my-6">
                          <Input
                            type={"text"}
                            disabled
                            placeholder="Хариулт..."
                            className="w-1/5 border-gray-900 rounded-lg pl-4 placeholder-gray-900"
                          />
                        </div>
                      )}
                      {item.type === "free-text" && (
                        <div className="p-3 space-y-4">
                          <p className="font-semibold">Хариулт:</p>
                          <Textarea
                            disabled
                            placeholder="Type your message here."
                          />
                        </div>
                      )}
                      {item.type === "code" && (
                        <div className="p-3 space-y-4">
                          <p className="font-semibold">Хариулт:</p>
                          <Textarea
                            disabled
                            placeholder="Type your message here."
                          />
                        </div>
                      )}
                      {item.type !== "information-block" && (
                        <p className="flex text-sm text-gray-600 mb-2 justify-end mt-2">
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
            ) : (
              (() => {
                switch (selectedType) {
                  case "multiple-choice":
                    return (
                      <NewMultipleChoice
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex} // энэ заавал байх ёстой
                        setSelectedType={setSelectedType}
                      />
                    );
                  case "simple-choice":
                    return (
                      <NewSimpleChoice
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex} // энэ заавал байх ёстой
                        setSelectedType={setSelectedType}
                      />
                    );
                  case "fill-choice":
                    return (
                      <NewCode
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        setSelectedType={setSelectedType}
                      />
                    );
                  case "free-text":
                    return (
                      <NewFreeText
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex} // энэ заавал байх ёстой
                        setSelectedType={setSelectedType}
                      />
                    );
                  case "information-block":
                    return (
                      <NewInformationBlock
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex} // энэ заавал байх ёстой
                        setSelectedType={setSelectedType}
                      />
                    );
                  case "code":
                    return (
                      <NewCode
                        handleSelect={handleSelectType}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex}
                        setSelectedType={setSelectedType}
                      />
                    );
                  default:
                    return null; // Аль ч тохирохгүй тохиолдолд юу ч буцаахгүй
                }
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
