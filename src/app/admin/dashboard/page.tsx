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
  const [chartData, setChartData] = useState<{ week: string; count: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; students: number; teachers: number }[]>([]);

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
      
      // Sample monthly data for the advanced chart
      // In a real app, this would come from an API
      setMonthlyData([
        { month: "1-р сар", students: 45, teachers: 12 },
        { month: "2-р сар", students: 52, teachers: 13 },
        { month: "3-р сар", students: 61, teachers: 15 },
        { month: "4-р сар", students: 67, teachers: 16 },
        { month: "5-р сар", students: 70, teachers: 17 },
        { month: "6-р сар", students: 78, teachers: 20 },
      ]);
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
            description="Сар бүрээр хэрэглэгч нэмэгдсэн тоо"
            xAxisKey="month"
            yAxisKey="students"
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
        </div>
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