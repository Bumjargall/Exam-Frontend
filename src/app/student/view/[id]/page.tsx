"use client";
import { getExamById } from "@/lib/api";
import { format, setISODay } from "date-fns";
import { Exam, Question } from "@/lib/types/interface";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { getResultByUserAndExam } from "@/lib/api";

const initialExamState: Exam = {
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
};

export default function ViewExam({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [exam, setExam] = useState<Exam>(initialExamState);
  const [isLoading, setIsLoading] = useState(true);
  const [studentResult, setStudentResult] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const user = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getExamById(id);
        setExam(response.data);
        if (user.user?._id) {
          const resutlRes = await getResultByUserAndExam(
            response.data._id,
            user.user._id
          );
          setStudentResult(resutlRes.data);
        }
      } catch (err) {
        console.log("Error fetching exam data: ", err);
        toast("Шалгалтын мэдээлэл авах үед алдаа гарлаа!", {
          action: { label: "Хаах", onClick: () => console.log("OK") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user.user?._id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 mt-10">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getStundentAnswer = (questionId: string) =>
    studentResult?.questions?.find((q: any) => q.questionId === questionId);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200 space-y-4 mt-10">
      {studentResult?.pending === "off" && (
        <div
          className="p-4 mb-4 text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded"
          role="alert"
        >
          <p className="font-bold">Анхааруулга</p>
          <p>Энэ шалгалт хараахан засагдаагүй байна.</p>
        </div>
      )}
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

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Огноо:</span>{" "}
          {format(new Date(exam.dateTime), "yyyy-MM-dd HH:mm")}
        </div>
        <div>
          <span className="font-medium">Хугацаа:</span> {exam.duration} мин
        </div>
        <div>
          <span className="font-medium">Асуултын тоо:</span>{" "}
          {exam.questions.length}
        </div>
        <div>
          <span className="font-medium">Нийт оноо:</span> {exam.totalScore}
        </div>
        <div>
          <span className="font-medium">Код:</span> {exam.key}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">Асуултууд</h3>

      {exam.questions.map((question, index) => {
        const studentAns = getStundentAnswer(question._id!);
        return (
          <div
            key={question._id || index}
            className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 font-medium text-gray-700">
                {index + 1}. <GapRenderer text={question.question} />
              </h2>

              {/* Multiple choice */}
              {question.type === "multiple-choice" && (
                <RadioGroup disabled>
                  {question.answers?.map((item, idx) => {
                    const selected = studentAns?.answer?.includes(item.text);
                    const isCorrect = item.isCorrect;

                    let textColor = "text-gray-800";
                    let bgColor = "bg-white";
                    let borderColor = "border-gray-300";

                    if (isCorrect && selected) {
                      // Зөв хариулт + сонгосон
                      textColor = "text-green-700";
                      bgColor = "bg-green-50";
                      borderColor = "border-green-400";
                    } else if (!isCorrect && selected) {
                      // Буруу хариулт + сонгосон
                      textColor = "text-red-700";
                      bgColor = "bg-red-50";
                      borderColor = "border-red-400";
                    } else if (isCorrect && !selected) {
                      // Зөв хариулт + сонгоогүй
                      textColor = "text-green-500";
                      bgColor = "bg-green-50";
                      borderColor = "border-green-200";
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center space-x-2 pl-6 font-semibold p-2 rounded ${bgColor} ${textColor} border ${borderColor}`}
                      >
                        <RadioGroupItem
                          value={item.text}
                          checked={selected}
                          id={`q-${question._id}-a-${idx}`}
                        />
                        <Label htmlFor={`q-${question._id}-a-${idx}`}>
                          {item.text}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
              {question.type === "fill-choice" &&
                question.answers &&
                studentAns?.answer && (
                  <div className="p-3 space-y-4">
                    <p className="font-semibold">Оюутны хариулт:</p>

                    {(() => {
                      // Хариултыг массив болгоно
                      const correctAnswers = question.answers;
                      const studentAnswers = Array.isArray(studentAns.answer)
                        ? studentAns.answer
                        : [studentAns.answer];

                      return correctAnswers.map((correctOption, index) => {
                        const correct =
                          correctOption?.text?.trim().toLowerCase() || "";
                        const student = (studentAnswers[index] || "")
                          .trim()
                          .toLowerCase();
                        const isCorrect = student === correct;

                        return (
                          <div
                            key={index}
                            className={`w-full p-2 rounded-md border-2 my-1 ${
                              isCorrect
                                ? "border-green-500 bg-green-50 text-green-800"
                                : "border-red-500 bg-red-50 text-red-800"
                            }`}
                          >
                            <p>
                              <span className="font-medium">{index + 1}:</span>{" "}
                              {studentAnswers[index] || "Хариулт өгөөгүй"}
                            </p>
                          </div>
                        );
                      });
                    })()}

                    <p className="font-semibold text-sm text-gray-500 pt-2">
                      Зөв хариулт:
                    </p>
                    <ul className="list-disc list-inside text-sm text-black">
                      {question.answers.map((ans: any, idx: number) => (
                        <li key={idx}>
                          {idx + 1}: {ans.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Simple choice */}
              {question.type === "simple-choice" &&
                Array.isArray(question.answers) && (
                  <div className="space-y-2 my-2">
                    <Input
                      type="text"
                      disabled
                      value={studentAns?.answer || ""}
                      className={`w-1/2 rounded-lg pl-4 border-2 ${
                        typeof studentAns?.answer === "string" &&
                        question.answers.some(
                          (a) =>
                            typeof a.text === "string" &&
                            a.text.trim().toLowerCase() ===
                              studentAns.answer.trim().toLowerCase()
                        )
                          ? "border-green-400 text-green-700 bg-green-50"
                          : "border-red-400 text-red-700 bg-red-50"
                      }`}
                    />

                    <p className="text-sm text-gray-500 font-medium pt-1">
                      Зөв хариулт:
                    </p>
                    <ul className="list-disc list-inside text-sm text-black">
                      {question.answers.map((a, idx) => (
                        <li key={idx}>{a.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Free text / Code */}
              {(question.type === "free-text" || question.type === "code") && (
                <Textarea
                  disabled
                  value={studentAns?.answer || ""}
                  className="border-gray-300 text-sm text-gray-800"
                />
              )}

              {/* Оноо */}
              {question.type !== "information-block" && (
                <div className="text-sm text-right text-gray-600 mt-2">
                  Авсан оноо: <b>{(studentAns?.score ?? 0).toFixed(1)}</b> /{" "}
                  {question.score}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
