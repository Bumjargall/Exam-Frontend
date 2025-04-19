"use client";
import { useState } from "react";
import MultipleChoice from "@/components/ExamComponents/MultipleChoice";
import FillChoice from "@/components/ExamComponents/FillChoice";
import FreeText from "@/components/ExamComponents/FreeText";
import SimpleChoice from "@/components/ExamComponents/Simple-Choice";
import InformationBlock from "@/components/ExamComponents/Information-block";
import Link from "next/link";
import QuestionList from "@/components/create-exam/QuestionList";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState("");
<<<<<<< HEAD
  const [exam, setExam] = useState<Exam[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  interface Exam {
    question: string;
    score: number;
  }
=======
  const [exam, setExam] = useState<
    { type: string; question: string; answers: any[]; score: number }[]
  >([]);
>>>>>>> 6bef27ae27eec8b9f65301b03ce43bcf2d525aee
  const handleSelectType = (type: string | null) => {
    console.log("----> ",type);
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
<<<<<<< HEAD
          <div className="max-w-2xl mx-auto mb-20 rounded-t-lg">
            {exam.length > 0 && (
              <div className="w-full text-gray-900 border mb-10 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 border-b">
                  <span className="text-gray-700 font-medium">
                    Шалгалтын асуултууд
                  </span>
                </div>
                <div className="divide-y">
                  {exam.map((item, index) => (
                    <div key={index} className="px-4 pt-3 bg-white space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-800">
                          {index + 1}. <GapRenderer text={item.question} />
                        </span>
                        <Button onClick={() => setEditingIndex(index)} className="cursor-pointer">Засах</Button>
                        {
                          editingIndex === index && (
                            <div>
                              <h1>{index}</h1>
                            </div>
                          )
                        }
                      </div>
                      <div>
                        <span className="flex justify-end">
                          Оноо: {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!selectedType && <QuestionList handleSelect={handleSelectType} />}
            {selectedType === "multiple-choice" && (
              <MultipleChoice handleSelect={handleSelectType} />
            )}
            {selectedType === "simple-choice" && (
              <SimpleChoice handleSelect={handleSelectType} />
            )}
            {selectedType === "fill-choice" && (
              <FillChoice
                handleSelect={handleSelectType}
                exam={exam}
                setExam={setExam}
              />
            )}
            {selectedType === "free-text" && (
              <FreeText handleSelect={handleSelectType} />
            )}
            {selectedType === "information-block" && (
              <InformationBlock handleSelect={handleSelectType} />
=======
          <div className="max-w-2xl mx-auto mb-20">
            {/*
            {exam && 
              <div>
                <h1>Examuud garna</h1>  
              <div/>
            }
            */}
            {!selectedType ? (
              <QuestionList handleSelect={handleSelectType} />
            ) : (
              (() => {
                switch (selectedType) {
                  case "multiple-choice":
                    return <MultipleChoice handleSelect={handleSelectType} 
                    exam={exam}
                    setExam={setExam}/>;
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
>>>>>>> 6bef27ae27eec8b9f65301b03ce43bcf2d525aee
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
