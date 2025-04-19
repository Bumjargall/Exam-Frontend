"use client";
import { useState } from "react";
import MultipleChoice from "@/components/ExamComponents/MultipleChoice";
import FillChoice from "@/components/ExamComponents/FillChoice";
import FreeText from "@/components/ExamComponents/FreeText";
import SimpleChoice from "@/components/ExamComponents/Simple-Choice";
import InformationBlock from "@/components/ExamComponents/Information-block";
import Link from "next/link";
import QuestionList from "@/components/create-exam/QuestionList";
export default function TeacherPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [exam, setExam] = useState<
    { type: string; question: string; answers: any[]; score: number }[]
  >([]);
  const handleSelectType = (type: string | null) => {
    console.log(type);
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
