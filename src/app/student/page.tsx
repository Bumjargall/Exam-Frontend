"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Eye,Printer,Trash2 } from 'lucide-react';
import {Button} from "@/components/ui/button"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { title: "Шалгалтын мэдээлэл", link: "#" },
    { title: <i className="ri-user-line"></i>, link: "#" },
  ];
  const exams = [
    { name: "Явцын шалгалт", code: "uAdfs2", date: "2023-10-11", score: "10/20" },
    { name: "Явцын шалгалт", code: "bXyz12", date: "2023-11-05", score: "15/20" },
    { name: "Шалгалт 3", code: "cTest3", date: "2023-12-01", score: "18/20" }
  ];

  return (
    <div>
      <div className="container mx-auto">
      <div className="grid grid-cols-8 space-x-5">
      <div className="col-start-1 col-end-3 mt-5 border border-gray-900 bg-gray-white rounded-lg">
        <div className="flex flex-col space-y-3 p-5">
          <div className="flex flex-col items-center space-y-3">
            <div>
              <img className="h-24 rounded-full" src="/profile.jpg" alt="" />
            </div>
            <div>
              <p className="font-medium">Баяраа Бумжаргал</p>
            </div>
          </div>
          <div className="space-y-3 border-b border-b-gray-300 pb-5">
            <div className="text-gray-500">
              <h1>Овог</h1>
            </div>
            <div className="space-y-5">
                <div className="border p-3 bg-white border-gray-900 rounded-lg">
                  <h1>Баяраа</h1>
                </div>
            </div>
          </div>

          <div className="space-y-3 border-b border-b-gray-300 pb-5">
            <div className="text-gray-500">
              <h1>Нэр</h1>
            </div>
            <div className="space-y-5">
                <div className="border p-3 bg-white border-gray-900 rounded-lg">
                  <h1>Бумжаргал</h1>
                </div>
            </div>
          </div>
          <div className="space-y-3 border-b border-b-gray-300 pb-5">
                <div className="text-gray-500">
                  <h1>Цахим шуудан</h1>
                </div>
                <div className="space-y-5">
                    <div className="border p-3 bg-white border-gray-900 rounded-lg">
                      <h1>Bumjargal@gmail.com</h1>
                    </div>
                </div>
                <div></div>
            </div>

            <div className="space-y-3 border-b border-b-gray-300 pb-5">
                <div className="text-gray-500">
                  <h1>Утасны дугаар</h1>
                </div>
                <div className="space-y-5">
                    <div className="border p-3 bg-white border-gray-900 rounded-lg">
                      <h1>99446000</h1>
                    </div>
                </div>
            </div>
            <div className="flex mt-2 justify-center">
              <Link href="" className="py-2 px-4 border border-gray-900 rounded-lg hover:bg-white border-gray-900">Хадгалах</Link>
            </div>
        </div>
      </div>
      <div className="col-span-4 col-start-3 bg-white mx-auto mt-5 rounded-lg">
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
                  <td className="px-4 py-1 border bg-gray-100 rounded-lg text-center hover:bg-gray-200">{exam.code}</td>
                  <td className="px-4 py-1">{exam.date}</td>
                  <td className="px-4 py-1">{exam.score}</td>
                  <td className="px-4 py-1">
                    <div className="flex space-x-3 text-gray-900">
                      <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
                        <Link href=""><Eye size={16}/></Link>
                      </div>
                      <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
                        <Link href=""><Printer size={16}/></Link>
                      </div>

                      <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
                        <Link href=""><Trash2 size={16}/></Link>
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
      <div className="col-span-2  col-end-9"></div>
    </div>
      </div>
  </div>
    
  );
}