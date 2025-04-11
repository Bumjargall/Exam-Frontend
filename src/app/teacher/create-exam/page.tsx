"use client";
import { useState } from "react";
import MultipleChoice from "@/components/ExamComponents/MultipleChoice";
import FillChoice from "@/components/ExamComponents/FillChoice";
import FreeText from "@/components/ExamComponents/FreeText";
import SimpleChoice from "@/components/ExamComponents/Simple-Choice";
import InformationBlock from "@/components/ExamComponents/Information-block";
import Link from "next/link";
import QuestionList from "@/components/create-exam/QuestionList";
export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("")
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
            {!selectedType && <QuestionList handleSelect={handleSelectType} />}
            {selectedType === "multiple-choice" && (
              <MultipleChoice handleSelect={handleSelectType} />
            )}
            {selectedType === "simple-choice" && (
              <SimpleChoice handleSelect={handleSelectType} />
            )}
            {selectedType === "fill-choice" && (
              <FillChoice handleSelect={handleSelectType} />
            )}
            {selectedType === "free-text" && (
              <FreeText handleSelect={handleSelectType} />
            )}
            {selectedType === "information-block" && (
              <InformationBlock handleSelect={handleSelectType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
