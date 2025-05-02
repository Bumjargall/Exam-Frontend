"use client";
import { getExamById } from "@/lib/api";
import { format } from "date-fns";
import { Exam, Question } from "@/lib/types/interface";
import GapRenderer from "@/components/ExamComponents/GapRenderer";
import { useEffect, useState, useRef, useTransition } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ExamInput } from "@/lib/types/interface";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { Download, Printer } from "lucide-react";

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

function ExamPrintPage() {
  const [exam, setExam] = useState<ExamInput>(initialExamState);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getExamById(id as string);
        setExam(response.data);
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
  // PDF татах функц - энгийн хялбар арга
  const handleDownloadPDF = () => {
    try {
      toast.info("Хэвлэх цонх нээгдэж байна...");

      // Хэвлэх стилийг бэлтгэх
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body { 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Arial, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .question-item {
            margin-bottom: 24px !important;
            page-break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);

      const originalContents = document.body.innerHTML;

      const printContents = contentRef.current?.innerHTML || "";
      document.body.innerHTML = `
        <div style="width: 100%; padding: 20px; font-family: Arial, sans-serif;">
          ${printContents}
        </div>
      `;

      window.print();
      setTimeout(() => {
        document.body.innerHTML = originalContents;
        document.head.removeChild(style);
        toast.success("Хэвлэх үйл явц дууслаа");
      }, 500);
    } catch (error) {
      console.error("Хэвлэх үед алдаа гарлаа:", error);
      toast.error("Хэвлэх үед алдаа гарлаа!");
    }
  };

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

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Товчны хэсэг */}
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download size={16} />
          PDF татах
        </Button>
      </div>

      <div
        ref={contentRef}
        className="p-6 bg-white shadow-md rounded-2xl border border-gray-200 space-y-4"
      >
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

        <div className="text-xs text-gray-400">
          Үүсгэсэн: {format(new Date(exam.createdAt), "yyyy-MM-dd HH:mm")}
        </div>

        <h3 className="text-lg font-semibold text-gray-800">Асуултууд</h3>

        {exam.questions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Асуулт олдсонгүй</p>
        ) : (
          exam.questions.map((question, index) => (
            <div
              key={`${question.id || index}`}
              className="border p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition question-item"
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
                      {question.answers?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 pl-6 font-semibold"
                        >
                          <RadioGroupItem
                            value={item.text}
                            id={`question-${question.id}-answer-${idx}`}
                          />
                          <Label
                            htmlFor={`question-${question.id}-answer-${idx}`}
                          >
                            {item.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {question.type === "simple-choice" && (
                  <div className="flex justify-end my-6">
                    <Input
                      type="text"
                      disabled
                      placeholder="Хариулт..."
                      className="w-1/5 border-gray-900 pl-4 placeholder-gray-900"
                    />
                  </div>
                )}

                {question.type === "free-text" && (
                  <div className="p-3 space-y-4">
                    <p className="font-semibold">Хариулт:</p>
                    <Textarea disabled placeholder="Хариултаа бичнэ үү" />
                  </div>
                )}

                {question.type === "code" && (
                  <div className="p-3 space-y-4">
                    <p className="font-semibold">Хариулт:</p>
                    <Textarea disabled placeholder="Кодоо бичнэ үү" />
                  </div>
                )}

                {question.type !== "information-block" && (
                  <p className="flex text-sm text-gray-600 mb-2 justify-end mt-2">
                    Оноо: {question.score}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExamPrintPage;
