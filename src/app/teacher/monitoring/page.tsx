"use client";
import React, { useEffect, useRef, useState } from "react";
import SelectExamComponent from "@/app/teacher/monitoring/components/SelectExamComponent";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import {
  ArrowUpDown,
  ChevronDown,
  CodeSquare,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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
import {
  getExams,
  getResultByUsers,
  updateExamStatus,
  getResultByCreateUser,
  getExamCreateByUser,
  deleteResultByExamUser,
  updateExam,
} from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import AnswerReviewDrawer from "@/components/AnswerReviewDrawer";

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
  _id: string;
  questions: any[];
  score: number;
  status: "taking" | "submitted";
  studentInfo: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};
const StudentList = ({
  students,
  status,
}: {
  students: ExamWithStudentInfo[];
  status: "taking" | "submitted";
}) => (
  <div>
    <p className="font-medium w-full border-b-1 pb-3">
      {status === "taking" ? "Оролцож буй" : "Дууссан"}
    </p>
    <ul>
      {students
        .filter((student) => student.status === status)
        .map((student) => (
          <li
            key={`${student._id}-${student.studentInfo?._id || "unknown"}`}
            className="flex justify-between items-center pl-2 cursor-pointer m-3"
          >
            <p>
              {student.studentInfo
                ? `${student.studentInfo.lastName?.charAt(0)}.${
                    student.studentInfo.firstName
                  }`
                : "Unknown"}
            </p>
          </li>
        ))}
    </ul>
  </div>
);

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
  const [studentFilter, setStudentFilter] = useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const [examData, setExamData] = useState<Exam[]>([]);
  const [lastExam, setLastExam] = useState<Exam>(defaultExam);
  const [userId, setUserId] = useState("");

  const [studentResults, setStudentResults] = useState<ExamWithStudentInfo[]>(
    []
  );
  const [isExamTitleVisible, setExamTitleVisible] = useState(false);
  const { user } = useAuth();
  const studentColumns: ColumnDef<ExamWithStudentInfo>[] = [
    {
      id: "status",
      accessorFn: (row) => row.status,
      header: "Төлөв",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "email",
      accessorFn: (row) => row.studentInfo?.email ?? "N/A",
      header: "И-мэйл",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      id: "firstName",
      accessorFn: (row) => row.studentInfo?.firstName ?? "Unknown",
      header: "Нэр",
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
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
                handleRemoveStudentFromExam(
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
  const table = useReactTable({
    data: studentResults,
    columns: studentColumns,
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
    if (user?._id) {
      setUserId(user._id.toString());
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
      document.removeEventListener("click", handleClickOutside);
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
    if (!user?._id) return;

    const fetchExamsAndResults = async () => {
      try {
        const examsResponse = await getExamCreateByUser(user._id.toString());
        if (!examsResponse.data?.length) {
          toast.info("Шалгалтын мэдээлэл олдсонгүй");
          return;
        }

        const latestExam = examsResponse.data[examsResponse.data.length - 1];
        setExamData(examsResponse.data);
        setLastExam(latestExam);

        const { success, data } = await getResultByUsers(latestExam._id);
        if (success && data) {
          setStudentResults(data);
        }
      } catch (error) {
        toast.error("Мэдээлэл татахад алдаа гарлаа");
        console.error(error);
      }
    };

    fetchExamsAndResults();
  }, [user]);
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
  // Өгсөн, өгөөгүй оюутнуудын тоо
  const takingStudents = studentResults.filter(
    (s) => s.status === "taking"
  ).length;
  const submittedStudents = studentResults.filter(
    (s) => s.status === "submitted"
  ).length;
  const totalStudents = takingStudents + submittedStudents;

  const filteredStudents = studentResults.filter(
    (student) =>
      student.studentInfo?.firstName
        ?.toLowerCase()
        .includes(studentFilter.toLowerCase()) ||
      student.studentInfo?.lastName
        ?.toLowerCase()
        .includes(studentFilter.toLowerCase()) ||
      student.studentInfo?.email
        ?.toLowerCase()
        .includes(studentFilter.toLowerCase())
  );

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
  const renderStudentList = (status: "taking" | "submitted") =>
    studentResults
      .filter((student) => student.status === status)
      .map((student) => (
        <li
          key={`${student._id}-${student.studentInfo._id}`}
          className="flex justify-between items-center pl-2 cursor-pointer m-3"
        >
          <p>
            {student.studentInfo
              ? `${student.studentInfo.lastName.charAt(0)}.${
                  student.studentInfo.firstName
                }`
              : "Unknown"}
          </p>
        </li>
      ));

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
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="w-full border-2 border-gray-100 border-r-0 rounded-l-lg p-2"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {/*Student-ээс нэрээр нь дэлгэцэнд харуулах*/}

          {/*Starting*/}
          <div className="pt-4">
            {/* Taking exam */}
            <StudentList students={filteredStudents} status="taking" />

            {/* Submitted exam */}
            <StudentList students={filteredStudents} status="submitted" />
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
                    <div className="score">
                      <p className="text-xl font-medium pb-4">Үнэлгээ</p>
                      <div className="flex justify-space">
                        <div className="ongoing flex flex-col items-center w-1/3 border-b-2 border-sky-400 mr-4 pb-2 bg-gray-100">
                          <p className="number">
                            <b className="text-xl">{takingStudents}</b>/
                            {totalStudents}
                          </p>
                          <p>Оролцсон</p>
                        </div>
                        <div className="submitted flex flex-col items-center w-1/3 border-b-2 border-lime-400 pb-2 bg-gray-100">
                          <p className="number">
                            <b className="text-xl">{submittedStudents}</b>/{" "}
                            {totalStudents}
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
                                  .getColumn("firstName")
                                  ?.getFilterValue() as string) ?? ""
                              }
                              onChange={(event) =>
                                table
                                  .getColumn("firstName")
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
                        {studentResults
                          .filter((student) => student.status === "submitted")
                          .map((student) => (
                            <tr
                              key={student._id.toString()}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-2">
                                <AnswerReviewDrawer
                                  key={student.studentInfo._id.toString()} // drawer бүрт unique key өгөх
                                  examEdit={lastExam}
                                  studentName={`${student.studentInfo.lastName} ${student.studentInfo.firstName}`}
                                  questions={student.questions}
                                  onSave={(updatedAnswers) => {
                                    console.log(
                                      "Updated answers:",
                                      updatedAnswers
                                    );
                                    // энд оноог серверт хадгалах API дуудаж болно
                                  }}
                                />
                              </td>
                              <td className="p-2">
                                {student.score}/{lastExam.totalScore}
                              </td>
                              <td className="p-2">
                                {student.submittedAt
                                  ? new Date(
                                      student.submittedAt
                                    ).toLocaleString()
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
