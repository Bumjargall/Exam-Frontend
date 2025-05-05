"use client";

import { getExamById } from "@/lib/api";
import { format } from "date-fns";
import { Exam, StudentExam } from "@/lib/types/interface";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { use } from "react";
import { useRouter } from "next/navigation";

const initialExamState: StudentExam = {
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
};

export default function ViewExam({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [exam, setExam] = useState<StudentExam>(initialExamState);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const storedStarted = localStorage.getItem(`started-${id}`);
    const storedTime = localStorage.getItem(`timeLeft-${id}`);
    const storedAnswers = localStorage.getItem(`answers-${id}`);

    if (storedStarted === "true") setIsStarted(true);
    if (storedTime) setTimeLeft(parseInt(storedTime));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
  }, [id]);

  // Save timeLeft to localStorage
  useEffect(() => {
    if (isStarted) {
      localStorage.setItem(`timeLeft-${id}`, timeLeft.toString());
    }
  }, [timeLeft, id, isStarted]);

  // Save isStarted state
  useEffect(() => {
    if (isStarted) {
      localStorage.setItem(`started-${id}`, "true");
    }
  }, [isStarted, id]);

  // Save answers
  useEffect(() => {
    if (isStarted) {
      localStorage.setItem(`answers-${id}`, JSON.stringify(answers));
    }
  }, [answers, id, isStarted]);

  // Fetch exam data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getExamById(id);
        setExam(response.data);

        // If no saved time, initialize
        const hasSaved = localStorage.getItem(`timeLeft-${id}`);
        if (!hasSaved) {
          setTimeLeft(response.data.duration * 60); // in seconds
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        toast("Шалгалтын мэдээлэл авах үед алдаа гарлаа!", {
          action: { label: "Хаах", onClick: () => console.log("OK") },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    exam.questions.forEach((question) => {
      const studentAnswer = answers[question.id];
      if (!studentAnswer) return;
      if (question.type === "multiple-choice") {
        const correct = question.answers?.find((a) => a.isCorrect)?.text;
        if (studentAnswer === correct) {
          totalScore += question.score;
        }
      }
      if (question.type === "simple-choice") {
        const correct = question.answers
          ?.find((a) => a.isCorrect)
          ?.text.toLowerCase();
        if (studentAnswer.toLowerCase() === correct) {
          totalScore += question.score;
        }
      }
    });
    setScoreResult(totalScore);
    console.log("📝 Хариултууд:", answers);
    toast("Шалгалт амжилттай илгээгдлээ!");

    localStorage.removeItem(`started-${id}`);
    localStorage.removeItem(`timeLeft-${id}`);
    localStorage.removeItem(`answers-${id}`);
    setIsStarted(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4 mt-10" aria-busy="true">
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

  return (
    <>
      {scoreResult !== null && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/10 z-50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-600">Тестийн оноо</h2>
            <p className="text-2xl">
              {scoreResult} / {exam.totalScore}
            </p>
            <button
              onClick={() => router.push("/student")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              Хаах
            </button>
          </div>
        </div>
      )}

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

        {exam.description && (
          <p className="text-gray-600">{exam.description}</p>
        )}

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

        {isStarted && (
          <div className="text-right text-red-600 font-semibold">
            Үлдсэн хугацаа: {Math.floor(timeLeft / 60)}:
            {("0" + (timeLeft % 60)).slice(-2)}
          </div>
        )}

        {!isStarted ? (
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              onClick={() => setIsStarted(true)}
            >
              Шалгалтыг эхлүүлэх
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800">Асуултууд</h3>

            {exam.questions.map((question, index) => (
              <div
                key={question.id || index}
                className="border p-4 rounded-lg bg-blue-50 shadow-sm"
              >
                <div className="mb-2">
                  <h2 className="flex items-center gap-2">
                    {index + 1}. <GapRenderer text={question.question} />
                  </h2>
                </div>

                {question.type === "multiple-choice" && (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(val) => handleChange(question.id, val)}
                  >
                    {question.answers?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 pl-6 font-semibold"
                      >
                        <RadioGroupItem
                          value={item.text}
                          id={`q-${question.id}-${idx}`}
                          disabled={!isStarted}
                        />
                        <Label htmlFor={`q-${question.id}-${idx}`}>
                          {item.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "simple-choice" && (
                  <Input
                    type="text"
                    placeholder="Хариулт..."
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    className="w-1/2 mt-2"
                    disabled={!isStarted}
                  />
                )}

                {["free-text", "code"].includes(question.type) && (
                  <Textarea
                    placeholder={
                      question.type === "code"
                        ? "Кодоо бичнэ үү"
                        : "Хариултаа бичнэ үү"
                    }
                    value={answers[question.id] || ""}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    disabled={!isStarted}
                  />
                )}

                <p className="text-right text-sm mt-2">
                  Оноо: {question.score}
                </p>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 mt-4"
              >
                Илгээх
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
