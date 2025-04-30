"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Eye, Printer, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExams } from "@/lib/api";
import mongoose from "mongoose";
import { useRouter } from "next/navigation";

export default function Exams() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExams();
        if (data.data) {
          setExams(data.data);
          console.log("exams", data.data);
        } else {
          const defaultExams = [];
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const menuItems = [
    { title: "Шалгалтын мэдээлэл", link: "#" },
    { title: <i className="ri-user-line"></i>, link: "#" },
  ];

  const clickSave = (index: number) => {
    return () => {
      localStorage.setItem("exam-storage", JSON.stringify(exams[index]));
      router.push(`/teacher/create-exam/${exams[index]._id} `);
    };
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-20">
        <div className="">
          <div className="text-center text-xl text-black font-medium py-4 border border-gray-900">
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
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index} className="">
                    <td className="px-4 py-1 rounded-2xl">{exam.title}</td>
                    <td className="px-4 py-1 border bg-gray-100 rounded-lg text-center">
                      {exam.key}
                    </td>
                    <td className="px-4 py-1">
                      {exam.dateTime.toLocaleString()}
                    </td>
                    <td className="px-4 py-1">{exam.totalScore}</td>
                    <td className="px-4 py-1">
                      <div className="flex justify-end space-x-3 text-gray-900">
                        <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-gray-200 border-gray-900">
                          <div onClick={clickSave(index)}>
                            <Pencil size={16} />
                          </div>
                        </div>
                        <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-gray-200 border-gray-900">
                          <Link href="">
                            <Eye size={16} />
                          </Link>
                        </div>
                        <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-gray-200 border-gray-900">
                          <Link href="">
                            <Printer size={16} />
                          </Link>
                        </div>

                        <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-gray-200 border-gray-900">
                          <Link href="">
                            <Trash2 size={16} />
                          </Link>
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
