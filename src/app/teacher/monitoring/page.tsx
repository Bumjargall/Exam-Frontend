"use client";
import React, { useEffect, useRef, useState } from "react";
import SelectExamComponent from "@/app/teacher/monitoring/components/SelectExamComponent";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getExams,
  getResultByUsers,
  getSubmittedExams,
  updateExamStatus,
} from "@/lib/api";
import {
  Exam,
  ExamWithStudentInfo,
  GetResultByUsersResponse,
} from "@/lib/types/interface";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { updateExam } from "@/lib/api";
import { ExamInput } from "@/lib/types/interface";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deleteResultByExamUser } from "@/lib/api";
const defaultExam: Exam = {
  _id: "",
  title: "Хоосон",
  description: "",
  questions: [],
  dateTime: new Date(),
  duration: 0,
  totalScore: 0,
  status: "active",
  key: " ",
  createUserById: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
type User = {
  _id: "";
  questions: [];
  score: 0;
  status: "taking";
  studentInfo: {
    id: "";
    firstName: "";
    lastName: "";
    email: "";
  };
};
export const studentColumns: ColumnDef<ExamWithStudentInfo>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "studentInfo.email",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.original.studentInfo?.email ?? "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "studentInfo.firstName",
    header: "Name",
    cell: ({ row }) => (
      <div>
        {row.original.studentInfo
          ? `${row.original.studentInfo.firstName}`
          : "Unknown"}
      </div>
    ),
  },
  {
    id: "remove",
    header: "Шалгалтаас хасах",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          if (row.original.status === "submitted") {
            toast.error("Шалгалт өгсөн оюутныг хасах боломжгүй");
          } else {
            const confirmed = confirm(
              "Шалгуулагчийг шалгалтаас хасахдаа итгэлтэй байна уу?"
            );
            if (confirmed) {
              deleteResultByExamUser(
                row.original.examId,
                row.original.studentInfo?._id
              );
            }
          }
        }}
      >
        Хасах
      </Button>
    ),
  },
];

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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const [examData, setExamData] = useState<Exam[]>([]);
  const [lastExam, setLastExam] = useState<Exam>(defaultExam);

  const [studentResults, setStudentResults] = useState<ExamWithStudentInfo[]>(
    []
  );
  const [isExamTitleVisible, setExamTitleVisible] = useState(false);
  const table = useReactTable({
    data: studentResults, // ← Одоо studentResults ашиглана
    columns: studentColumns, // ← шинэчилсэн column
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

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
    const userString = localStorage.getItem("user");
    let userId: string | null = null;
    try {
      const user = JSON.parse(userString || "");
      userId = user.user._id;
    } catch (err) {
      console.error("localStorage-с user авахад алдаа гарлаа", err);
    }
  });
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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleRemoveStudentFromExam = async (
    examId: string,
    studentId: string
  ) => {
    if (!examId || !studentId) {
      toast.error("Шалгалт болон оюутны ID байхгүй байна");
      return;
    }
    try {
      await deleteResultByExamUser(examId, studentId);
      toast.success("Шалгуулагч амжилттай хасагдлаа.");

      // 🔄 Серверээс шинэ studentResults татах
      const resultResponse = await getResultByUsers(examId);
      if (resultResponse.success) {
        setStudentResults(resultResponse.data);
      } else {
        toast.error("Шинэчилсэн мэдээлэл авахад алдаа гарлаа");
      }
    } catch (error) {
      toast.error("Хасах үед алдаа гарлаа");
      console.error(error);
    }
  };

  //database дуудах
  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsResponse = await getSubmittedExams();
        if (examsResponse.data?.length > 0) {
          const latestExam = examsResponse.data[examsResponse.data.length - 1];
          setExamData(examsResponse.data);
          setLastExam(latestExam);

          const resultResponse = await getResultByUsers(
            latestExam._id as string
          );
          //console.log("🎯 getResultByUsers----", resultResponse);
          setStudentResults(resultResponse.data);
        }
      } catch (error) {
        console.error("Сервертэй холбогдох үед алдаа гарлаа:", error);
      }
    };
    fetchData();
  }, [studentResults]);

  // Toggle functions
  const toggleDropdown = (key: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...(Object.fromEntries(
        Object.keys(prev).map((k) => [k, false])
      ) as typeof dropdownStates),
      [key]: !prev[key],
    }));
  };

  const examView = (examId: string) => {
    router.push(`monitoring/exam/${examId}`);
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
  const handleExamSelect = async (exam: Exam) => {
    if (!exam._id) {
      console.error("❌ exam._id байхгүй байна");
      return;
    }
    console.log("🟡 handleExamSelect:", exam._id);
    closeAllDropdowns();
    try {
      const resultResponse = await getResultByUsers(exam._id.toString());
      if (resultResponse.success) {
        setStudentResults(resultResponse.data);
        setLastExam(exam);
      } else {
        console.warn(
          "⚠️ resultResponse data буруу форматтай байна:",
          resultResponse
        );
      }
    } catch (error) {
      console.error("Шалгалтын мэдээллийг авахад алдаа гарлаа:", error);
    }
  };
  const handleStatusChange = async (newStatus: "active" | "inactive") => {
    try {
      const res = await updateExamStatus(lastExam._id as string, newStatus);
      if (res) {
        setLastExam((prev) => ({ ...prev, status: newStatus }));
        toast.success("Төлөв амжилттай шинэчлэгдлээ!");
      }
    } catch (error) {
      console.error("Шинэчлэх үед алдаа гарлаа:", error);
      toast.error("Төлөв шинэчлэхэд алдаа гарлаа");
    } finally {
      closeAllDropdowns();
    }
  };
  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (err) {
      console.error("Хуулахад алдаа гарлаа:", err);
    }
  };
  const renderStudentList = (status: "taking" | "submitted") => (
    <ul>
      {studentResults
        .filter((data) => data.status === status)
        .map((data, index) => (
          <li
            key={index}
            className="flex justify-between items-center pl-2 cursor-pointer m-3"
          >
            <p>
              {data.studentInfo
                ? `${data.studentInfo.lastName?.charAt(0)}.${
                    data.studentInfo.firstName
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
            className="last_exam flex border-b-2 bg-gray-200 px-2 relative cursor-pointer rounded-lg"
            id="menu-button"
          >
            <p className="text-[18px]">{lastExam.title}</p>
            <i className="ri-arrow-down-s-fill absolute right-2 text-2xl"></i>
          </div>
          {/*Гарчиг*/}
          {isExamTitleVisible && (
            <SelectExamComponent
              exams={examData.map((e) => ({
                id: e._id.toString(),
                title: e.title,
              }))}
              onClickExam={(e) => {
                const foundExam = examData.find(
                  (ex) => ex._id.toString() === e.id
                );
                if (foundExam) {
                  handleExamSelect(foundExam);
                  setExamTitleVisible(false);
                }
              }}
              onMouseLeave={closeAllDropdowns}
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
              <p className="font-medium w-full border-b-1 pb-3">Starting</p>
              {renderStudentList("taking")}
            </div>
            <div className="submitted">
              <p className="font-medium w-full border-b-1 pb-3">Submitted</p>
              {renderStudentList("submitted")}
            </div>
          </div>
        </div>
        {/*Main*/}
        <div className="w-3/5 mx-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account" className="text-xl cursor-pointer">
                Хянах
              </TabsTrigger>
              <TabsTrigger value="password" className="text-xl cursor-pointer">
                Хариу
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="container my-4 mx-2">
                <p className=" text-[18px] mb-4">{lastExam.title}</p>
                <div className="flex justify-around">
                  <div className="left w-1/2">
                    <div
                      className="flex justify-between pr-6 py-2 relative"
                      ref={dropdownRefs.key}
                    >
                      <p className="mr-4">Exam key</p>
                      <button
                        className="px-2 border-2  rounded-2xl cursor-pointer hover:text-yellow-500"
                        onClick={() => toggleDropdown("key")}
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
                    <div
                      className="flex justify-between pr-6 py-2 relative"
                      ref={dropdownRefs.status}
                    >
                      <p className="mr-4">Шалгалтын төлөв</p>
                      <button
                        className="px-2 border-2  rounded-2xl cursor-pointer relative hover:text-yellow-500"
                        onClick={() => toggleDropdown("status")}
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
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleStatusChange("active")}
                            >
                              <i className="ri-circle-fill text-[12px] text-lime-500 mr-2"></i>
                              Нээлттэй
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleStatusChange("inactive")}
                            >
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
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="flex items-center justify-center w-4/5 bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2 transition duration-300">
                          {" "}
                          <i className="ri-expand-right-line text-[14px] mr-2"></i>{" "}
                          Шалгалтаас хасах{" "}
                        </button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-4xl">
                        <SheetHeader>
                          <SheetTitle>Оюутны мэдээлэл</SheetTitle>
                          <SheetDescription>
                            Та эндээс шалгуулагчдыг шалгалтаас хасах боломжтой.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="w-full p-4">
                          <div className="flex items-center py-4">
                            <Input
                              placeholder="Оюутны нэрээр хайх"
                              value={
                                (table
                                  .getColumn("studentInfo.firstName")
                                  ?.getFilterValue() as string) ?? ""
                              }
                              onChange={(event) =>
                                table
                                  .getColumn("studentInfo.firstName")
                                  ?.setFilterValue(event.target.value)
                              }
                              className="max-w-sm"
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                  Columns <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {table
                                  .getAllColumns()
                                  .filter((column) => column.getCanHide())
                                  .map((column) => {
                                    return (
                                      <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                          column.toggleVisibility(!!value)
                                        }
                                      >
                                        {column.id}
                                      </DropdownMenuCheckboxItem>
                                    );
                                  })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                  <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                      return (
                                        <TableHead key={header.id}>
                                          {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                              )}
                                        </TableHead>
                                      );
                                    })}
                                  </TableRow>
                                ))}
                              </TableHeader>
                              <TableBody>
                                {table.getRowModel().rows?.length ? (
                                  table.getRowModel().rows.map((row) => (
                                    <TableRow
                                      key={row.id}
                                      data-state={
                                        row.getIsSelected() && "selected"
                                      }
                                    >
                                      {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                          {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                          )}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={studentColumns.length}
                                      className="h-24 text-center"
                                    >
                                      No results.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                              {table.getFilteredSelectedRowModel().rows.length}{" "}
                              of {table.getFilteredRowModel().rows.length}{" "}
                              row(s) selected.
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <button
                      className="flex items-center justify-center w-4/5 bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2 transition duration-300"
                      onClick={() => {
                        if (!lastExam._id) {
                          toast.error("Шалгалт байхгүй байна");
                          return;
                        }
                        examView(lastExam._id as string);
                      }}
                    >
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
                        {studentResults.map((student) => (
                          <tr
                            key={student._id.toString()}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 text-blue-600 cursor-pointer">
                              {student.studentInfo._id
                                ? `${student.studentInfo.lastName} ${student.studentInfo.firstName}`
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
