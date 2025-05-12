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
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "../components/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Exam } from "@/lib/types/interface";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ExtendedExam extends Exam {
  userInfo?: {
    firstName: string;
    lastName: string;
  };
  dateTime: Date;
}
import { format } from "date-fns";
import TeacherTable from "../components/TeacherTable";

export default function Admin() {
  const [selectedExam, setSelectedExam] = useState<ExtendedExam | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [examTakers, setExamTakers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  //table
  const [recentExams, setRecentExams] = useState<Exam[]>([]);

  //chart data
  const [chartData, setChartData] = useState<{ week: string; count: number }[]>(
    []
  );

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
      //console.log("res--examtop5-=------> ", res.data);
    };
    const fetchChart = async () => {
      const res = await getExamChartData();
      console.log("effect/chartdata------->", res);
      setChartData(res.data);
    };

    fetchChart();
    fetchRecent();
    fetchCounts();
    //console.log("examtop5-=------> ", recentExams);
  }, []);

  const sortedExams = [...recentExams].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  return (
    <div className="container mx-auto my-16">
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
      <div className="mx-4">
        <Tabs defaultValue="exam" className="w-full">
          <TabsList className="mb-10">
            <TabsTrigger value="exam">Шалгалт</TabsTrigger>
            <TabsTrigger value="teacher">Багш</TabsTrigger>
            <TabsTrigger value="users">Хэрэглэгчид</TabsTrigger>
          </TabsList>
          <TabsContent value="exam">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              📋 Сүүлд үүсгэсэн шалгалтууд
            </h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гарчиг</TableHead>
                  <TableHead>Огноо</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExams.map((exam) => (
                  <TableRow
                    key={exam._id.toString()}
                    onClick={() =>
                      setSelectedExam({
                        exam,
                      })
                    }
                  >
                    <TableCell className="text-blue-600 cursor-pointer">
                      {exam.title}
                    </TableCell>
                    <TableCell>
                      {format(new Date(exam.dateTime), "yyyy/MM/dd")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Drawer
              open={!!selectedExam}
              onOpenChange={() => setSelectedExam(null)}
            >
              <DrawerContent>
                <DrawerHeader className="mx-10">
                  <DrawerTitle className="text-xl font-bold">
                    {selectedExam?.title}
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground">
                    Тайлбар: {selectedExam?.description}
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-6 pb-4 space-y-2 text-sm text-gray-700 mx-10">
                  <div className="flex justify-between">
                    <span className="font-medium">Огноо:</span>
                    <span>
                      {selectedExam?.dateTime &&
                      !isNaN(new Date(selectedExam.dateTime).getTime())
                        ? format(
                            new Date(selectedExam.dateTime),
                            "yyyy/MM/dd HH:mm"
                          )
                        : "Хугацаа алга"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Хугацаа:</span>
                    <span>{selectedExam?.duration} минут</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Нийт оноо:</span>
                    <span>{selectedExam?.totalScore}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Төлөв:</span>
                    <Badge
                      variant="outline"
                      className={
                        selectedExam?.status === "active"
                          ? "border-green-500 text-green-700 bg-green-50"
                          : "border-red-500 text-red-700 bg-red-50"
                      }
                    >
                      {selectedExam?.status === "active"
                        ? "Нээлттэй"
                        : "Хаалттай"}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Үүсгэсэн:</span>
                    <span>
                      {selectedExam?.userInfo
                        ? `${selectedExam.userInfo.lastName} ${selectedExam.userInfo.firstName}`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-20">
                    <span className="font-medium">Үүсгэсэн огноо:</span>
                    <span>
                      {selectedExam?.createdAt &&
                      !isNaN(new Date(selectedExam.createdAt).getTime())
                        ? format(
                            new Date(selectedExam.createdAt),
                            "yyyy/MM/dd HH:mm"
                          )
                        : "Огноо алга"}
                    </span>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            {/*chart*/}
            <div className="my-16">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                📋 7 хоногоор үүссэн шалгалтын тоо
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="teacher">
            <TabsContent value="teacher">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                👩‍🏫 Бүх багш нар
              </h3>
              <TeacherTable />
            </TabsContent>
          </TabsContent>
          <TabsContent value="users">...</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
