"use client";
import { getExamById } from "@/lib/api";
import { format } from "date-fns";
import { Exam, Question } from "@/lib/types/interface";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";
interface Props {
  params: {
    id: string;
  };
}
export default function ViewExam({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [exam, setExam] = useState<Exam>({
    _id: "",
    title: "Шалгалтын гарчиг...",
    key: "0",
    status: "active",
    description: "",
    questions: [],
    dateTime: new Date(),
    duration: 0,
    totalScore: 0,
    createUserById: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExamById(id);
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
    fetchData();
  }, [params]);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200 space-y-4 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{exam.title}</h2>
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            exam.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {exam.status}
        </span>
      </div>
      <p className="text-gray-600">{exam.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Огноо:</span>{" "}
          {format(new Date(exam.dateTime), "yyyy-MM-dd HH:mm")}
        </div>
        <div>
          <span className="font-medium">Хугацаа:</span> {exam.duration} мин
        </div>
        <div>
          <span className="font-medium">Асуултын тоо:</span>
          {""}
          {exam.questions.length}
        </div>
        <div>
          <span className="font-medium">Нийт оноо:</span> {exam.totalScore}
        </div>
        <div>
          <span className="font-medium">Код:</span> {exam.key}
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Үүсгэсэн: {format(new Date(exam.createdAt), "yyyy-MM-dd HH:mm")}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Асуултууд</h3>
      {exam.questions.map((question, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="flex items-center gap-2">
                {index + 1}. <GapRenderer text={question.question} />
              </h2>
            </div>

            {question.type === "multiple-choice" && (
              <div className="text-gray-700 my-3">
                <RadioGroup disabled>
                  {question.answer?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 pl-6 font-semibold"
                    >
                      <RadioGroupItem
                        value={item}
                        id={`question-${item}-answer-${idx}`}
                      />
                      <Label htmlFor={`question-${item}-answer-${idx}`}>
                        {item}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            {question.type === "simple-choice" && (
              <div className="flex justify-end my-6">
                <Input
                  type={"text"}
                  disabled
                  placeholder="Хариулт..."
                  className="w-1/5 border-gray-900 rounded-lg pl-4 placeholder-gray-900"
                />
              </div>
            )}
            {question.type === "free-text" && (
              <div className="p-3 space-y-4">
                <p className="font-semibold">Хариулт:</p>
                <Textarea disabled placeholder="Type your message here." />
              </div>
            )}
            {question.type === "code" && (
              <div className="p-3 space-y-4">
                <p className="font-semibold">Хариулт:</p>
                <Textarea disabled placeholder="Type your message here." />
              </div>
            )}
            {question.type !== "information-block" && (
              <p className="flex text-sm text-gray-600 mb-2 justify-end mt-2">
                Оноо: {question.score}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
