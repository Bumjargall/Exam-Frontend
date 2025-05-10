"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Exam, ExamWithStudentInfo } from "@/lib/types/interface";
import { getExamCreateByUser, getResultByUsers } from "@/lib/api";
import ExamHeader from "@/components/monitoring/ExamHeader";
import StudentList from "@/components/monitoring/StudentList";
import StudentTable from "@/components/monitoring/StudentTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const defaultExam: Exam = {
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

export default function MonitoringPage() {
  const [examData, setExamData] = useState<Exam[]>([]);
  const [lastExam, setLastExam] = useState<Exam>(defaultExam);
  const [studentResults, setStudentResults] = useState<ExamWithStudentInfo[]>(
    []
  );
  const [isExamTitleVisible, setExamTitleVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    try {
      const user = JSON.parse(userString || "");
      setUserId(user._id);
    } catch (err) {
      console.error("localStorage-с user авахад алдаа гарлаа", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const examsResponse = await getExamCreateByUser(userId);
        if (!examsResponse.data?.length) return;
        const latestExam = examsResponse.data.at(-1);
        setExamData(examsResponse.data);
        setLastExam(latestExam);
        const resultResponse = await getResultByUsers(latestExam._id);
        if (resultResponse.success) {
          setStudentResults(resultResponse.data);
        }
      } catch (error) {
        toast.error("Мэдээлэл татахад алдаа гарлаа");
      }
    };
    fetchData();
  }, [userId]);

  const handleExamSelect = async (exam: Exam) => {
    setExamTitleVisible(false);
    try {
      const resultResponse = await getResultByUsers(exam._id.toString());
      if (resultResponse.success) {
        setLastExam(exam);
        setStudentResults(resultResponse.data);
      }
    } catch (error) {
      toast.error("Шалгалтын мэдээллийг авахад алдаа гарлаа");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between h-full min-h-screen">
        <StudentList
          exams={examData}
          studentResults={studentResults}
          onExamSelect={handleExamSelect}
          isExamTitleVisible={isExamTitleVisible}
          setExamTitleVisible={setExamTitleVisible}
          lastExam={lastExam}
        />

        <div className="w-3/5 mx-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Хянах</TabsTrigger>
              <TabsTrigger value="password">Хариу</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <ExamHeader
                exam={lastExam}
                refreshResults={() => handleExamSelect(lastExam)}
                setExam={setLastExam}
              />
            </TabsContent>

            <TabsContent value="password">
              <StudentTable students={studentResults} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="right_container w-1/5 px-2 ">
          <div className="bg-slate-100 rounded-2xl">
            <div className="flex justify-center items-center text-slate-700 border-b p-2">
              <i className="ri-question-answer-fill text-[14px] pr-2"></i>
              <p>Мессеж</p>
            </div>
            <div className="h-20 "></div>
            <div className="text-white bg-slate-400 rounded-b-2xl py-1 px-2">
              <input
                className="text-slate-700 w-full p-1 rounded"
                type="text"
                placeholder="Энд бичнэ үү..."
              />
              <i className="ri-send-plane-fill px-1 float-right mt-1 cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
