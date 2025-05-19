import { useState } from "react";
import { Exam } from "@/lib/types/interface";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import BarChart from "./BarChart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type ExamDashboardProps = {
  recentExams: Exam[];
  chartData: { week: string; count: number }[];
};

export default function ExamDashboard({
  recentExams,
  chartData,
}: ExamDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for pie chart
  const pieData = [
    { name: "Математик", value: 23 },
    { name: "Физик", value: 15 },
    { name: "Химия", value: 18 },
    { name: "Биологи", value: 12 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <BarChart data={chartData} loading={isLoading} />

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-gray-700">
            Хичээлээр ангилсан
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Exams List */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-700">
          Сүүлийн шалгалтууд
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentExams.length > 0 ? (
            recentExams.map((exam) => (
              <Card key={String(exam._id)} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  <p>Асуултын тоо: {exam.questions?.length || 0}</p>
                  <p>Хугацаа: {exam.duration} минут</p>
                  <p className="mt-2 text-xs">
                    {exam.createdAt &&
                      formatDistanceToNow(new Date(exam.createdAt), {
                        addSuffix: true,
                      })}
                  </p>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-between pt-2 pb-2">
                  <Button variant="ghost" size="sm">
                    Засварлах
                  </Button>
                  <Button variant="outline" size="sm">
                    Харах
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Одоогоор шалгалт алга байна
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
