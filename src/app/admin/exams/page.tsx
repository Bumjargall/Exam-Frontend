"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getExamChartData,
  getExamCount,
  getExamTakenCount,
  getRecentExams,
  getRoleByUserCount,
} from "@/lib/api";
import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import TeacherTable from "../components/TeacherTable";
import ExamDashboard from "../components/ExamDashboard";
import { Exam } from "@/lib/types/interface";
import UserTable from "../components/UserTable";
import { Users } from "lucide-react";

export default function Admin() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [examTakers, setExamTakers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [chartData, setChartData] = useState<{ week: string; count: number }[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const teacher = await getRoleByUserCount("teacher");
      const student = await getRoleByUserCount("student");
      const exam = await getExamCount();
      const takers = await getExamTakenCount();

      setTeacherCount(teacher.count);
      setStudentCount(student.count);
      setExamCount(exam.count);
      setExamTakers(takers.count);
      setIsLoading(false);
    };

    const fetchRecent = async () => {
      const res = await getRecentExams();
      setRecentExams(res.data);
    };

    const fetchChart = async () => {
      const res = await getExamChartData();
      setChartData(res.data);
    };

    fetchCounts();
    fetchRecent();
    fetchChart();
  }, []);

  return (
    <div className="container mx-auto my-16">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mx-4">
        <StatCard
          title="Багш нар"
          count={teacherCount}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-indigo-400 to-indigo-600"
        />
        <StatCard
          title="Сурагчид"
          count={studentCount}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-pink-400 to-pink-600"
        />
        <StatCard
          title="Нийт шалгалт"
          count={examCount}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-green-400 to-green-600"
        />
        <StatCard
          title="Шалгалт өгсөн"
          count={examTakers}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
        />
      </div>

      {/* Tabs */}
      <div className="mx-4">
        <Tabs defaultValue="exam" className="w-full">
          <TabsList className="mb-10">
            <TabsTrigger value="exam">Шалгалт</TabsTrigger>
            <TabsTrigger value="teacher">Багш</TabsTrigger>
            <TabsTrigger value="users">Хэрэглэгчид</TabsTrigger>
          </TabsList>

          {/* Exam Tab */}
          <TabsContent value="exam">
            <ExamDashboard chartData={chartData} recentExams={recentExams} />
          </TabsContent>

          {/* Teacher Tab */}
          <TabsContent value="teacher">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              👩‍🏫 Бүх багш нар
            </h3>
            <TeacherTable />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users"><h3 className="text-lg font-semibold mb-4 text-gray-700">
          🧑‍🎓 Бүх сурагч нар
            </h3>
            <UserTable/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
