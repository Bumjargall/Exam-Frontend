"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getExamChartData,
  getExamCount,
  getExamTakenCount,
  getExamTakenPerMonth,
  getMonthlyUserGrowth,
  getRecentExams,
  getRoleByUserCount,
} from "@/lib/api";
import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCardAI";
import TeacherTable from "../components/TeacherTable";
import ExamDashboard from "../components/ExamDashboard";
import { Exam } from "@/lib/types/interface";
import UserTable from "../components/UserTable";
import { BookOpen, LineChart, Users } from "lucide-react";
import AdvancedChart from "../components/AdvancedChartAI";
import { Card, CardContent } from "@/components/ui/card";

export default function Admin() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [examTakers, setExamTakers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [chartData, setChartData] = useState<{ week: string; count: number }[]>(
    []
  );
  const [monthlyData, setMonthlyData] = useState<
    { month: string; total: number; students: number; teachers: number }[]
  >([]);

  const [takenMonthlyData, setTakenMonthlyData] = useState<
    { month: string; taken: number }[]
  >([]);

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
      const userMonthly = await getMonthlyUserGrowth();
      const withTotal = userMonthly.data.map(
        (item: { month: string; students: number; teachers: number }) => ({
          ...item,
          total: item.students + item.teachers,
        })
      );
      setMonthlyData(withTotal);
      console.log("userMonthly data---->", withTotal);
      setRecentExams(res.data);
    };

    const fetchChartAi = async () => {
      const res = await getExamTakenPerMonth();
      setTakenMonthlyData(res.data);
    };
    fetchChartAi();

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
          icon={<Users className="h-6 w-6 text-white" />}
        />
        <StatCard
          title="Сурагчид"
          count={studentCount}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-pink-400 to-pink-600"
          icon={<Users className="h-6 w-6 text-white" />}
        />
        <StatCard
          title="Нийт шалгалт"
          count={examCount}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-green-400 to-green-600"
          icon={<BookOpen className="h-6 w-6 text-white" />}
        />
        <StatCard
          title="Шалгалт өгсөн"
          count={examTakers}
          isLoading={isLoading}
          gradient="bg-gradient-to-r from-yellow-400 to-yellow-600"
          icon={<LineChart className="h-6 w-6 text-white" />}
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="mx-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Ерөнхий статистик</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdvancedChart
            data={monthlyData}
            title="Сарын хэрэглэгчдийн өсөлт"
            description="Сурагч, багш болон нийт хэрэглэгчдийн өсөлт"
            xAxisKey="month"
            yAxisKeys={["students", "teachers", "total"]}
            height={300}
          />
          <AdvancedChart
            data={chartData}
            title="7 хоногийн шалгалтын тоо"
            description="7 хоног бүрээр авсан шалгалтын тоо"
            xAxisKey="week"
            yAxisKey="count"
            height={300}
          />

          <AdvancedChart
            data={takenMonthlyData}
            title="Сарын шалгалт өгсөн тоо"
            description="Сар бүр өгсөн шалгалтын тоо"
            xAxisKey="month"
            yAxisKey="taken"
            height={300}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-20 bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-40">
        <Tabs defaultValue="exam" className="w-full">
          <TabsList className="mb-10 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full p-1 shadow-inner">
            <TabsTrigger
              value="exam"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 px-6 py-2 rounded-full text-gray-600 hover:bg-white transition"
            >
              Шалгалт
            </TabsTrigger>
            <TabsTrigger
              value="teacher"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 px-6 py-2 rounded-full text-gray-600 hover:bg-white transition"
            >
              Багш
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 px-6 py-2 rounded-full text-gray-600 hover:bg-white transition"
            >
              Хэрэглэгчид
            </TabsTrigger>
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
          <TabsContent value="users">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              🧑‍🎓 Бүх сурагч нар
            </h3>
            <UserTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
