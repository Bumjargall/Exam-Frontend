"use client";
import { useState } from "react";
import MultipleChoice from "@/components/ExamComponents/MultipleChoice";
import FillChoice from "@/components/ExamComponents/FillChoice";
import FreeText from "@/components/ExamComponents/FreeText";
import SimpleChoice from "@/components/ExamComponents/Simple-Choice";
import InformationBlock from "@/components/ExamComponents/Information-block";
import Link from "next/link";
import QuestionList from "@/components/create-exam/QuestionList";
import { Button } from "@/components/ui/button";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { set } from "zod";
export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [exam, setExam] = useState<
    { type: string; question: string; answers: any[]; score: number }[]
  >([]);
  const handleSelectType = (type: string | null) => {
    console.log("----> ", type);
    setSelectedType(type);
  };

  return (
    <div className="mt-10">
      <div className="max-w-4xl mx-auto flex">
        <div className="bg-white w-full space-y-20 border border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg border-b">
            <div>
              <input
                value={examTitle}
                type="text"
                id="text"
                className="w-[500px] py-2 bg-white border border-gray-300 rounded-lg pl-4 placeholder-gray-500"
                placeholder="Шалгалтын нэр"
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </div>
            <div>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/register"
                    className="p-2.5 bg-white border border-gray-900 rounded-lg text-gray-900 hover:bg-gray-200"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="p-2.5 border border-gray-900 rounded-lg text-black hover:bg-gray-200"
                  >
                    Баталгаажуулах
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-2xl mx-auto mb-20">
            {exam.length > 0 && (
              <div className="w-full text-gray-900 space-y-5 border p-4 rounded-lg mb-10">
                <div className="flex items-center justify-between gap-3 bg-gray-100 p-3 rounded">
                  <span className="text-gray-800 font-semibold">
                    Шалгалтын асуултууд
                  </span>
                </div>

                <div className="space-y-2">
                  {exam.map((item, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="flex items-center text-sm font-semibold gap-2">
                          {index + 1}. <GapRenderer text={item.question} />
                        </h2>
                        <Button
                          onClick={() => {
                            setEditingIndex(index);
                            setSelectedType(exam[index].type);
                          }}
                          variant={"outline"}
                          className="cursor-pointer"
                        >
                          Засах
                        </Button>
                      </div>

                      <p className="flex text-sm text-gray-600 mb-2 justify-end">
                        Оноо: {item.score}
                      </p>
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
                      <MultipleChoice
                        handleSelect={handleSelectType}
                        exam={exam}
                        setExam={setExam}
                      />
                    );
                  case "simple-choice":
                    return <SimpleChoice handleSelect={handleSelectType} />;
                  case "fill-choice":
                    return (
                      <FillChoice
                        handleSelect={handleSelectType}
                        exam={exam}
                        setExam={setExam}
                        editingIndex={editingIndex}
                        setEditingIndex={setEditingIndex} // энэ заавал байх ёстой
                        setSelectedType={setSelectedType} // энэ ч бас
                      />
                    );
                  case "free-text":
                    return <FreeText handleSelect={handleSelectType} />;
                  case "information-block":
                    return <InformationBlock handleSelect={handleSelectType} />;
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
