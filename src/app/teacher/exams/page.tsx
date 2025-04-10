"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Eye, Printer, Trash2,Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Exams() {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { title: "Шалгалтын мэдээлэл", link: "#" },
    { title: <i className="ri-user-line"></i>, link: "#" },
  ];
  const exams = [
    {
      name: "Явцын шалгалт",
      code: "uAdfs2",
      date: "2023-10-11",
      score: "10/20",
    },
    {
      name: "Явцын шалгалт",
      code: "bXyz12",
      date: "2023-11-05",
      score: "15/20",
    },
    { name: "Шалгалт 3", code: "cTest3", date: "2023-12-01", score: "18/20" },
  ];

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
                    <td className="px-4 py-1 rounded-2xl">{exam.name}</td>
                    <td className="px-4 py-1 border bg-gray-100 rounded-lg text-center">
                      {exam.code}
                    </td>
                    <td className="px-4 py-1">{exam.date}</td>
                    <td className="px-4 py-1">{exam.score}</td>
                    <td className="px-4 py-1">
                      <div className="flex justify-end space-x-3 text-gray-900">
                        <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-gray-200 border-gray-900">
                          <Link href="">
                            <Pencil size={16} />
                          </Link>
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
