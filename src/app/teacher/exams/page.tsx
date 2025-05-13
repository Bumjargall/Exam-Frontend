"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Printer, Trash2, Pencil, Download } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { deleteExam, getExams } from "@/lib/api";
import { Exam } from "@/lib/types/interface";
import mongoose from "mongoose";
import { getExamCreateByUser } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!user || !user._id) {
      //console.log(".............user...");
      //router.replace("/login");
    } else {
      fetchExams(user._id);
    }
  }, [user]);

  //console.log(".............userUTGU...", user);
  const fetchExams = async (userId: string) => {
    //console.log(".............user...");
    setLoading(true);
    try {
      const res = await getExamCreateByUser(userId);
      if (res?.data) {
        const sortedExams = res.data.sort(
          (a: Exam, b: Exam) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setExams(sortedExams);
      } else {
        setExams([]);
      }
    } catch (err) {
      console.error("Шалгалтын жагсаалтыг авч чадсангүй:", err);
      setError("Шалгалтын жагсаалтыг авч чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  const clickDeleteExam = async (id: mongoose.Types.ObjectId) => {
    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Устгах явцад алдаа гарлаа.");
    }
  };

  const clickEditExam = (index: number) => {
    return () => {
      localStorage.setItem("exams-edit-storage", JSON.stringify(exams[index]));
    };
  };

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="text-center text-xl text-black font-medium py-4 border-t border-l border-r border-gray-300 rounded-t-lg">
        <h1>Шалгалтын мэдээлэл</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-x-1 border-spacing-y-2 bg-white shadow-md border rounded-b-lg">
          <thead>
            <tr className="text-gray-700 text-sm">
              <th className="px-4 py-1 text-left">Шалгалтын нэр</th>
              <th className="px-4 py-1 text-left">Шалгалтын код</th>
              <th className="px-4 py-1 text-left">Үүсгэсэн хугацаа</th>
              <th className="px-4 py-1 text-left">Оноо</th>
              <th className="px-4 py-1 text-left"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {[...Array(4)].map((_, j) => (
                          <div
                            key={j}
                            className="w-8 h-8 bg-gray-200 rounded-md"
                          ></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              : exams.map((exam, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2 font-medium">{exam.title}</td>
                    <td className="px-4 py-2 text-center bg-gray-100 rounded-lg">
                      {exam.key}
                    </td>
                    <td className="px-4 py-2">
                      {format(exam.createdAt, "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="px-4 py-2 text-center">{exam.totalScore}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end space-x-2 text-gray-700">
                        <Link
                          href={`/teacher/exams/edit/${exam._id}`}
                          onClick={clickEditExam(index)}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <Pencil size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Засах
                          </span>
                        </Link>
                        <Link
                          href={`/teacher/exams/view/${exam._id}`}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Харах
                          </span>
                        </Link>
                        <Link
                          href={`/teacher/exams/print/${exam._id}`}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100"
                        >
                          <Download size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Татах
                          </span>
                        </Link>
                        <div
                          onClick={() =>
                            clickDeleteExam(exam._id as mongoose.Types.ObjectId)
                          }
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-red-100 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-red-600 text-white px-2 py-0.5 rounded shadow-md">
                            Устгах
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {error && (
          <div className="text-red-500 text-sm text-center mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}
