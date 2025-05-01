"use client";
import React, { useEffect, useRef, useState } from "react";
import SelectExamComponent from "@/app/teacher/monitoring/components/SelectExamComponent";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExams, getResultByUser, getResults } from "@/lib/api";
import { Exam, Result, User } from "@/lib/types/interface";
import { title } from "process";
import { Description } from "@radix-ui/react-dialog";
import { duration } from "html2canvas/dist/types/css/property-descriptors/duration";

const defaultExam = {
  _id: "",
  title: "Шалгалтын гарчиг...",
  key: "0",
  status: "active",
  description: "",
  questions: [],
  dateTime: new Date(),
  duration: 0,
  totalScore: 0,
  createUserById: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const downloadPDF = () => {
  const element = document.getElementById("pdf-content"); // PDF-д оруулах элемент
  if (!element) return;

  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // PDF-ийн өргөн
    const pageHeight = 297; // PDF-ийн өндөр
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // Эхлэх байрлал

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("exam.pdf");
  });
};

export default function MonitoringPage() {
  const [examData, setExamData] = useState<Exam[]>([]);
  const [studentScoreData, setStudentScoreData] = useState<Result[]>([]);
  const [lastExam, setLastExam] = useState<Exam>(defaultExam);
  const [userData, setUserData] = useState<User[]>([]);
  const [isExamTitleVisible, setExamTitleVisible] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    key: false,
    status: false,
    download: false,
    print: false,
    send: false,
  });

  const dropdownRefs = {
    key: useRef<HTMLDivElement>(null),
    status: useRef<HTMLDivElement>(null),
    download: useRef<HTMLDivElement>(null),
    print: useRef<HTMLDivElement>(null),
    send: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setDropdownStates((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });
      if (
        !document.getElementById("menu-button")?.contains(event.target as Node)
      ) {
        setExamTitleVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //database дуудах
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsResponse, resultResponse] = await Promise.all([
          getExams(),
          getResults(),
        ]);

        if (examsResponse.data?.length > 0) {
          setExamData(examsResponse.data);
          setLastExam(examsResponse.data[examsResponse.data.length - 1]);
        }
        if (resultResponse.data) {
          setStudentScoreData(resultResponse.data);
        }
        if (lastExam._id) {
          const examUserResponse = await getResultByUser(
            lastExam._id.toString()
          );
          setUserData(examUserResponse.data || []);
        }
      } catch (error) {
        console.error("Сервертэй холбогдох үед алдаа гарлаа:", error);
      }
    };
    fetchData();
  }, [lastExam._id]);

  // Toggle functions
  const toggleDropdown = (key: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((k) => [k, false])) as typeof dropdownStates,
      [key]: !prev[key],
    }));
  };

  //гарчигийг хаах функц
  const closeAllDropdowns = () => {
    setDropdownStates({
      key: false,
      status: false,
      download: false,
      print: false,
      send: false,
    });
    setExamTitleVisible(false);
  };
  const handleExamSelect = (exam: Exam) => {
    setLastExam(exam);
    closeAllDropdowns();
  };

  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch (err) {
      console.error("Хуулахад алдаа гарлаа:", err);
    }
  };

  const renderStudentList = (status: "taking" | "submitted") => (
    <ul>
      {studentScoreData
        .filter((data) => data.status === status)
        .map((data, index) => (
          <li
            key={index}
            className="flex justify-between items-center pl-2 cursor-pointer"
          >
            <p>
              {data.studentId && typeof data.studentId !== "string"
                ? `${data.studentId.lastName?.charAt(0)}.${
                    data.studentId.firstName
                  }`
                : "Unknown Student"}
            </p>
          </li>
        ))}
    </ul>
  );


 

  return (
    <div className="max-w-7xl mx-auto">
      <div className=" flex justify-between h-24">
        {/*Monitoring Left banner -> Exam title, student names*/}
        <div className="left_container w-1/5 px-2">
          <div
            onClick={() => setExamTitleVisible(!isExamTitleVisible)}
            className="last_exam flex border-b-2 bg-sky-200 px-2 relative cursor-pointer"
            id="menu-button"
          >
            <p className="text-[20px]">{lastExam.title}</p>
            <i className="ri-arrow-down-s-fill absolute right-2 text-2xl"></i>
          </div>
          {/*Гарчиг*/}
          {isExamTitleVisible && (
            <SelectExamComponent
              exam={examData}
              onMouseLeave={closeAllDropdowns}
              onClickExam={handleExamSelect}
            />
          )}

          {/*Student-ээс нэрээр нь хайх*/}
          <div className="searchStudent flex justify-between items-center pt-6 ">
            <input
              type="text"
              placeholder="Хайх нэр..."
              className="w-full border-2 border-gray-100 border-r-0 rounded-l-lg p-2"
            />
            <i className="ri-search-line border-2 border-gray-100 border-l-0 rounded-r-lg py-2 pr-2"></i>
          </div>
          {/*Student-ээс нэрээр нь дэлгэцэнд харуулах*/}
          <div className="pt-4">
            {/*Starting*/}
            <div className="starting">
              <p className="font-medium w-full border-b-1">Starting</p>
              {renderStudentList("taking")}
            </div>
            <div className="submitted">
              <p className="font-medium w-full border-b-1">Submitted</p>
              {renderStudentList("submitted")}
            </div>
          </div>
        </div>
        {/*Main*/}
        <div className="w-3/5 mx-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="flex justify-center py-4 w-full border-b-2 border-sky-400 bg-white text-sky-400 rounded-t-2xl   ">
              <TabsTrigger value="account" className="text-xl my-4">
                Хянах
              </TabsTrigger>
              <TabsTrigger value="password" className="text-xl my-8">
                Хариу
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="container my-4 mx-2">
                <p className=" text-[18px] mb-4">{lastExam.title}</p>
                <div className="flex justify-around">
                  <div className="left w-1/2">
                    <div className="flex justify-between pr-6 py-2 relative" ref={dropdownRefs.key}>
                      <p className="mr-4">Exam key</p>
                      <button
                        className="px-2 border-2  rounded-2xl cursor-pointer hover:text-yellow-500"
                        onClick={() => toggleDropdown('key')}
                        id="key"
                      >
                        {lastExam.key} <i className="ri-arrow-down-s-fill"></i>
                      </button>
                      {dropdownStates.key && (
                        <div className="absolute right-0 mt-8 bg-white border-1 border-gray-300 rounded-lg shadow-lg  z-50 w-48">
                          <ul className="">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleCopy(
                                  lastExam.key,
                                  "Түлхүүр хуулагдлаа..."
                                );
                              }}
                            >
                              <i className="ri-file-copy-line mr-2"></i>Түлхүүр
                              хуулах
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleCopy(
                                  `https://exam.com/${lastExam.key}`,
                                  "Линк хуулагдлаа"
                                );
                              }}
                            >
                              <i className="ri-link mr-2"></i>Шалгалтын линк
                              хуулах
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {/*status*/}
                    <div className="flex justify-between pr-6 py-2 relative" ref={dropdownRefs.status}>
                      <p className="mr-4">Шалгалтын төлөв</p>
                      <button
                        className="px-2 border-2  rounded-2xl cursor-pointer relative hover:text-yellow-500"
                        onClick={() => toggleDropdown('status')}
                      >
                        {lastExam.status == "active" ? (
                          <>
                            <i className="ri-circle-fill text-[12px] text-lime-500"></i>{" "}
                            Нээлттэй
                          </>
                        ) : (
                          <>
                            <i className="ri-close-circle-fill text-[12px] text-red-500"></i>{" "}
                            Хаалттай
                          </>
                        )}
                        <i className="ri-arrow-down-s-fill"></i>
                      </button>
                      {dropdownStates.status && (
                        <div className="absolute right-0 mt-8 bg-white border-1 border-gray-300 m-6 rounded-lg shadow-lg z-50 w-48">
                          <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              <i className="ri-circle-fill text-[12px] text-lime-500 mr-2"></i>
                              Нээлттэй
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              <i className="ri-close-circle-fill text-[12px] text-red-500 mr-2"></i>
                              Хаалттай
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/*Share*/}
                    <div className="share_link flex justify-between pr-6 py-2 align-center">
                      <p className="mr-4">Илгээх</p>
                      <i
                        className="ri-share-fill px-1 border-2  rounded-full cursor-pointer relative hover:text-yellow-500"
                        onClick={() => {
                          alert("Илгээх мэйлээ оруулна уу?");
                        }}
                      ></i>
                    </div>
                    <div className="score">
                      <p className="text-xl font-medium pb-4">Үнэлгээ</p>
                      <div className="flex justify-space">
                        <div className="ongoing flex flex-col items-center w-1/3 border-b-2 border-sky-400 mr-4 pb-2 bg-gray-100">
                          <p className="number">
                            <b className="text-xl">0</b>/1
                          </p>
                          <p>Оролцсон</p>
                        </div>
                        <div className="submitted flex flex-col items-center w-1/3 border-b-2 border-lime-400 pb-2 bg-gray-100">
                          <p className="number">
                            <b className="text-xl">1</b>/1
                          </p>
                          <p>Дууссан</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right w-1/2 flex flex-col items-center">
                    <button className="flex items-center justify-center w-4/5 bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2 transition duration-300">
                      <i className="ri-expand-right-line text-[14px] mr-2"></i>{" "}
                      Шалгалтаас хасах
                    </button>
                    <button className="flex items-center justify-center w-4/5 bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2  transition duration-300">
                      <i className="ri-eye-line text-[14px] mr-2"></i>Материал
                      харах
                    </button>
                    <button className="flex items-center justify-center w-4/5 bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2  transition duration-300">
                      <i className="ri-printer-line text-[14px] mr-2"></i>Хэвлэх
                      <i className="ri-arrow-down-s-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="container my-4 mx-2">
                <p className="text-[18px] mb-4">{lastExam.title}</p>
                <div className="">
                  <div className="share_link flex justify-start pr-6 py-2 items-center">
                    <p className="mr-4">Илгээх</p>
                    <i
                      className="ri-share-fill px-1 border-2  rounded-full cursor-pointer hover:text-yellow-500"
                      onClick={() => {
                        alert("Илгээх мэйлээ оруулна уу?");
                      }}
                    ></i>
                  </div>

                  <div className="buttons flex">
                    <div className="pr-4 relative">
                      <button
                        className="flex items-center justify-center w-[18vh] border border-slate-400 rounded-full my-1 py-1 hover:bg-slate-100 hover:border-2 transition duration-300"
                        onClick={() => toggleDropdown("download")}
                      >
                        <i className="ri-download-line text-[14px] mr-2"></i>
                        Татах
                        <i className="ri-arrow-down-s-fill"></i>
                      </button>
                      {dropdownStates.download && (
                        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-48">
                          <ul className="py-1">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                downloadPDF(); // Хуудсыг хэвлэх
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-printer-line mr-2"></i>PDF
                              Хадгалах
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                alert("Excel файл үүсгэх үйлдэл"); // Excel файл үүсгэх
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-file-excel-line mr-2"></i>Excel
                              Хадгалах
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                alert("Word файл үүсгэх үйлдэл"); // Word файл үүсгэх
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-file-word-line mr-2"></i>Word
                              Хадгалах
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {/*print*/}
                    <div className="pr-4 relative">
                      <button
                        className="flex items-center justify-center w-[18vh] border border-slate-400 rounded-full my-1 py-1 hover:bg-slate-100 hover:border-2 transition duration-300"
                        onClick={() => toggleDropdown("print")}
                      >
                        <i className="ri-printer-line text-[14px] mr-2"></i>
                        Хэвлэх
                        <i className="ri-arrow-down-s-fill"></i>
                      </button>
                      {dropdownStates.print && (
                        <div className="absolute  mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-48">
                          <ul className="py-1">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                window.print(); // Хуудсыг хэвлэх
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-bar-chart-horizontal-line mr-2"></i>
                              Шалгалтын дүн
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                window.print();
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-key-2-line mr-2"></i>Шалгалтын
                              хариу
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {/*send*/}
                    <div className="relative" ref={dropdownRefs.send}>
                      <button
                        className="flex items-center justify-center w-[18vh] border border-slate-400 rounded-full my-1 py-1 hover:bg-slate-100 hover:border-2 transition duration-300"
                        onClick={() => toggleDropdown("send")}
                      >
                        <i className="ri-printer-line text-[14px] mr-2"></i>
                        Илгээх
                        <i className="ri-arrow-down-s-fill"></i>
                      </button>
                      {dropdownStates.send && (
                        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-48">
                          <ul className="py-1">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                alert("Шалгалтын дүн илгээх");
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-bar-chart-horizontal-line mr-2"></i>
                              Шалгалтын дүн
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                alert("Шалгалтын хариу илгээх");
                                closeAllDropdowns();
                              }}
                            >
                              <i className="ri-key-2-line mr-2"></i>Шалгалтын
                              хариу
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border rounded-lg shadow-md overflow-hidden">
                    <table className="w-full w-4/5 bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="p-2 text-left">Шалгуулагчид</th>
                          <th className="p-2 text-left">Оноо</th>
                          <th className="p-2 text-left">Гүйцэтгэсэн хугацаа</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentScoreData.map((student) => (
                          <tr
                            key={student._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 text-blue-600 cursor-pointer">
                              {student.studentId &&
                              typeof student.studentId !== "string"
                                ? `${student.studentId.lastName} ${student.studentId.firstName}`
                                : "Unknown Student"}
                            </td>
                            <td className="p-2">{student.score}</td>
                            <td className="p-2">
                              {student.submittedAt
                                ? new Date(student.submittedAt).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/*Right*/}
        <div className="right_container  w-1/5 px-2 ">
          <div className="bg-slate-100 rounded-2xl">
            <div className="flex justify-center items-center text-slate-700 border-b p-2">
              <i className="ri-question-answer-fill text-[14px] pr-2"></i>
              <p>Мессеж</p>
            </div>
            <div className="h-20 "></div>
            <div className="text-white bg-slate-400 rounded-b-2xl py-1 px-2">
              <input
                className="text-slate-700 w-full p-1 rounded"
                type="text"
                placeholder="Энд бичнэ үү..."
              />
              <i className="ri-send-plane-fill px-1 float-right mt-1 cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
