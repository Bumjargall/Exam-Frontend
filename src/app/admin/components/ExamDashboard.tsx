"use client";
import React, { useState } from "react";
import { format } from "date-fns";
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
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface ExtendedExam extends Exam {
  userInfo?: {
    firstName: string;
    lastName: string;
  };
  dateTime: Date;
}

type Props = {
  recentExams: Exam[];
  chartData: { week: string; count: number }[];
};

const ExamDashboard: React.FC<Props> = ({ recentExams, chartData }) => {
  const [selectedExam, setSelectedExam] = useState<ExtendedExam | null>(null);

  const sortedExams = [...recentExams].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  return (
    <>
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
                  ...exam,
                  dateTime: new Date(exam.dateTime)
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

      <Drawer open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
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
                {selectedExam?.dateTime
                  ? format(new Date(selectedExam.dateTime), "yyyy/MM/dd HH:mm")
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
                {selectedExam?.status === "active" ? "Нээлттэй" : "Хаалттай"}
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
                {selectedExam?.createdAt
                  ? format(new Date(selectedExam.createdAt), "yyyy/MM/dd HH:mm")
                  : "Огноо алга"}
              </span>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="my-16">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          📊 7 хоногоор үүссэн шалгалтын тоо
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
    </>
  );
};

export default ExamDashboard;
