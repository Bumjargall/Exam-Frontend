"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Eye, Printer, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExam, getExams } from "@/lib/api";
import mongoose, { ObjectId } from "mongoose";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
export default function Exams() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const [deleteExams, setDeleteExams] = useState<Exam>();
  const router = useRouter();
  interface Exam {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    dateTime: Date;
    duration: string;
    totalScore: number;
    status: string;
    key: string;
    questions: [];
    createUserById: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  const menuItems = [
    { title: "Шалгалтын мэдээлэл", link: "#" },
    { title: <i className="ri-user-line"></i>, link: "#" },
  ];

  const clickSave = (index: number) => {
    return () => {
      const selectedExam = exams[index];
      localStorage.setItem("exam", JSON.stringify(exams[index]));
      router.push(`/teacher/create-exam/${exams[index]._id}`);
    };
  };
  const clickDeleteExam = async (id: mongoose.Types.ObjectId) => {
    if (id) {
      const response = await deleteExam(id);
      console.log("200---> ", response);
      console.log("exam id: ", response.deleteExam);
      setDeleteExams(response.deleteExam);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExams();
        if (data.data) {
          setExams(data.data);
          //console.log("exams", data.data);
        } else {
          const defaultExams = [];
        }
      } catch (error) {}
    };
    fetchData();
  }, [deleteExams]);

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-20">
        <div className="">
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
                {exams.map((exam, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2 font-medium">{exam.title}</td>
                    <td className="px-4 py-2 text-center bg-gray-100 rounded-lg">
                      {exam.key}
                    </td>
                    <td className="px-4 py-2">
                      {format(exam.dateTime, "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="px-4 py-2 text-center">{exam.totalScore}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end space-x-2 text-gray-700">
                        {/* Засах */}
                        <div
                          onClick={clickSave(index)}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <Pencil size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Засах
                          </span>
                        </div>
                        {/* Харах */}
                        <Link
                          href={`/teacher/exams/view/${exam._id}`}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Харах
                          </span>
                        </Link>
                        {/* Хэвлэх */}
                        <Link
                          href=""
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-100"
                        >
                          <Printer size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Хэвлэх
                          </span>
                        </Link>
                        {/* Устгах */}
                        <div
                          onClick={() => clickDeleteExam(exam._id)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
