"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Eye,
  Printer,
  Trash2,
  Pencil,
  Download,
  MoreHorizontal,
} from "lucide-react";
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
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user._id) {
    } else {
      fetchExams(user._id);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the menu trigger
      if ((event.target as Element).closest('[data-menu-trigger="true"]')) {
        return;
      }
      // Close if clicking outside and menu is open
      if (!event.defaultPrevented && openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenu]);

  const fetchExams = async (userId: string) => {
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

  const toggleActionMenu = (
    e: React.MouseEvent,
    examId: mongoose.Types.ObjectId
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenActionMenu((prevState) =>
      prevState === examId.toString() ? null : examId.toString()
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 md:mt-20 px-4 md:px-0">
      <div className="text-center bg-green-400 text-lg md:text-xl text-white font-medium py-3 md:py-4 border-t border-l border-r border rounded-t-lg">
        <h1>Шалгалтын мэдээлэл</h1>
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
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
                      {format(new Date(exam.createdAt), "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="px-4 py-2 text-center">{exam.totalScore}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end space-x-2 text-gray-700">
                        <Link
                          href={`/teacher/exams/edit/${exam._id}`}
                          onClick={clickEditExam(index)}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-green-300 cursor-pointer"
                        >
                          <Pencil size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md">
                            Засах
                          </span>
                        </Link>
                        <Link
                          href={`/teacher/exams/view/${exam._id}`}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-green-300"
                        >
                          <Eye size={16} />
                          <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-0.5 rounded shadow-md ">
                            Харах
                          </span>
                        </Link>
                        <Link
                          href={`/teacher/exams/print/${exam._id}`}
                          className="group relative flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-green-300"
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
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden bg-white shadow-md border rounded-b-lg">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border-b animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            ))
          : exams.map((exam, index) => (
              <div key={index} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg mb-2">{exam.title}</h3>
                  <div className="relative z-20">
                    <button
                      onClick={(e) =>
                        toggleActionMenu(e, exam._id as mongoose.Types.ObjectId)
                      }
                      className="p-2 rounded-full hover:bg-gray-100"
                      data-menu-trigger="true"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {/* ✅ Dropdown correctly triggers based on selected exam */}
                    {openActionMenu === exam._id?.toString() && (
                      <div className="absolute right-0 mt-1 z-50 bg-white rounded-md shadow-lg border w-44">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clickEditExam(index)(); // correct function execution
                            setOpenActionMenu(null);
                            router.push(`/teacher/exams/edit/${exam._id}`);
                          }}
                          className="flex w-full items-center p-3 hover:bg-gray-50 text-sm text-left"
                        >
                          <Pencil size={14} className="mr-2" />
                          Засах
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenu(null);
                            router.push(`/teacher/exams/view/${exam._id}`);
                          }}
                          className="flex w-full items-center p-3 hover:bg-gray-50 text-sm text-left"
                        >
                          <Eye size={14} className="mr-2" />
                          Харах
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenu(null);
                            router.push(`/teacher/exams/print/${exam._id}`);
                          }}
                          className="flex w-full items-center p-3 hover:bg-gray-50 text-sm text-left"
                        >
                          <Download size={14} className="mr-2" />
                          Татах
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clickDeleteExam(
                              exam._id as mongoose.Types.ObjectId
                            );
                            setOpenActionMenu(null);
                          }}
                          className="flex w-full items-center p-3 hover:bg-red-50 text-red-500 text-sm text-left"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Устгах
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Exam details */}
                <div className="flex justify-between text-sm mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg">
                    {exam.key}
                  </span>
                  <span className="text-gray-600">Оноо: {exam.totalScore}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(exam.createdAt), "yyyy-MM-dd HH:mm")}
                </div>
              </div>
            ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-4">{error}</div>
      )}

      {!loading && exams.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Шалгалтын мэдээлэл байхгүй байна.
        </div>
      )}
    </div>
  );
}
