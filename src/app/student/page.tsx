"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Eye, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { late } from "zod";
import { StudentWithExamInfo } from "@/lib/types/interface";
import { getExamByStudent } from "@/lib/api";
import { User } from "@/lib/types/interface";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastName, setLastName] = useState("Баяраа");
  const [isLastName, setIsLastName] = useState(false);
  const [firstName, setFirstName] = useState("Бумжаргал");
  const [isFirstName, setIsFirstName] = useState(false);
  const [email, setEmail] = useState("bumjarlga@gmail.com");
  const [isEmail, setIseEmail] = useState(false);
  const [studentCode, setStudentCode] = useState("B434343");
  const [isStudentCode, setIsStudentCode] = useState(false);
  const [exams, setExams] = useState<StudentWithExamInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const menuItems = [
    { title: "Шалгалтын мэдээлэл", link: "#" },
    { title: <i className="ri-user-line"></i>, link: "#" },
  ];
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || !userData.user._id) {
      console.error("Хэрэглэгчийн бүртгэл олдсонгүй");
      return;
    }
    setStudentId(userData.user._id);
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchExams = async () => {
      try {
        const data = await getExamByStudent(studentId); // шууд data ирнэ
        setExams(data.data); // backend 200 OK → { data: [...] }
        console.log("Шалгалт:", data.data);
      } catch (error) {
        console.error("Алдаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [studentId]);

  const exam = [
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
      <div className="container mx-auto">
        <div className="grid grid-cols-8 space-x-5">
          <div className="col-start-1 col-end-3 mt-5 border border-gray-900 bg-gray-white rounded-lg">
            <div className="flex flex-col space-y-3 p-5">
              <div className="flex flex-col items-center space-y-3">
                <div>
                  <img
                    className="h-24 rounded-full"
                    src="/profile.jpg"
                    alt=""
                  />
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
                  <div>
                    {isLastName ? (
                      <input
                        type="text"
                        placeholder="Овог"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={`${lastName}`}
                        readOnly
                      />
                    )}
                  </div>
                  <div>
                    <Button
                      variant={isLastName ? "destructive" : "outline"}
                      onClick={() => setIsLastName(!isLastName)}
                    >
                      {!isLastName ? "Засварлах" : "Хадгалах"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-b border-b-gray-300 pb-5">
                <div className="text-gray-500">
                  <h1>Нэр</h1>
                </div>
                <div className="space-y-5">
                  <div>
                    {isFirstName ? (
                      <input
                        type="text"
                        placeholder="Овог"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={`${firstName}`}
                        readOnly
                      />
                    )}
                  </div>
                  <div>
                    <Button
                      variant={isFirstName ? "destructive" : "outline"}
                      onClick={() => setIsFirstName(!isFirstName)}
                    >
                      {!isFirstName ? "Засварлах" : "Хадгалах"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pb-5">
                <div className="text-gray-500">
                  <h1>Цахим шуудан</h1>
                </div>
                <div className="space-y-5">
                  <div>
                    {isEmail ? (
                      <input
                        type="text"
                        placeholder="Цахим шуудан"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={`${email}`}
                        readOnly
                      />
                    )}
                  </div>
                  <div>
                    <Button
                      variant={isEmail ? "destructive" : "outline"}
                      onClick={() => setIseEmail(!isEmail)}
                    >
                      {!isEmail ? "Засварлах" : "Хадгалах"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-5">
                <div className="text-gray-500">
                  <h1>Оюутны код</h1>
                </div>
                <div className="space-y-5">
                  <div>
                    {isStudentCode ? (
                      <input
                        type="text"
                        placeholder="Оюутны код"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={studentCode}
                        onChange={(e) => setStudentCode(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="py-2 w-full border border-gray-900 rounded-xl pl-2"
                        value={`${studentCode}`}
                        readOnly
                      />
                    )}
                  </div>
                  <div>
                    <Button
                      variant={isStudentCode ? "destructive" : "outline"}
                      onClick={() => setIsStudentCode(!isStudentCode)}
                    >
                      {!isStudentCode ? "Засварлах" : "Хадгалах"}
                    </Button>
                  </div>
                </div>
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
                        <td className="px-4 py-1 rounded-2xl">
                          {exam.examInfo.title}
                        </td>
                        <td className="px-4 py-1 border bg-gray-100 rounded-lg text-center hover:bg-gray-200">
                          {exam.examInfo.key}
                        </td>
                        <td className="px-4 py-1">{exam.examInfo.createdAt}</td>
                        <td className="px-4 py-1">
                          {exam.score}/{exam.examInfo.totalScore}
                        </td>
                        <td className="px-4 py-1">
                          <div className="flex space-x-3 text-gray-900">
                            <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
                              <Link href="">
                                <Eye size={16} />
                              </Link>
                            </div>
                            <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
                              <Link href="">
                                <Printer size={16} />
                              </Link>
                            </div>

                            <div className="flex items-center justify-center border p-2 rounded-lg border-gray-900 hover:bg-white border-gray-900">
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
          <div className="col-span-2  col-end-9"></div>
        </div>
      </div>
    </div>
  );
}
