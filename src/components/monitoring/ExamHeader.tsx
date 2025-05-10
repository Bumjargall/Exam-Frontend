"use client";

import React, { useState, useRef, useEffect } from "react";
import { Exam } from "@/lib/types/interface";
import { toast } from "sonner";
import { updateExamStatus } from "@/lib/api";

interface ExamHeaderProps {
  exam: Exam;
  refreshResults: () => void;
  setExam: (exam: Exam) => void;
}

export default function ExamHeader({
  exam,
  refreshResults,
  setExam,
}: ExamHeaderProps) {
  const [dropdownStates, setDropdownStates] = useState({
    key: false,
    status: false,
  });
  const keyRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyRef.current && !keyRef.current.contains(event.target as Node)) {
        setDropdownStates((prev) => ({ ...prev, key: false }));
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setDropdownStates((prev) => ({ ...prev, status: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (err) {
      toast.error("Хуулахад алдаа гарлаа");
    }
  };

  const handleStatusChange = async (newStatus: "active" | "inactive") => {
    try {
      await updateExamStatus(exam._id.toString(), newStatus);
      setExam({ ...exam, status: newStatus });
      toast.success("Төлөв амжилттай шинэчлэгдлээ!");
      refreshResults();
    } catch (error) {
      toast.error("Шинэчлэх үед алдаа гарлаа");
    } finally {
      setDropdownStates({ key: false, status: false });
    }
  };

  return (
    <div className="text-left px-4 py-2">
      <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>

      <div className="mb-2" ref={keyRef}>
        <span className="mr-4">Түлхүүр:</span>
        <button
          className="border px-2 py-1 rounded hover:text-blue-600"
          onClick={() => toggleDropdown("key")}
        >
          {exam.key} ▼
        </button>
        {dropdownStates.key && (
          <div className="absolute bg-white border shadow mt-2 z-10">
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCopy(exam.key, "Түлхүүр хуулагдлаа")}
              >
                Түлхүүр хуулах
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  handleCopy(`https://exam.com/${exam.key}`, "Линк хуулагдлаа")
                }
              >
                Шалгалтын линк хуулах
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="mb-2" ref={statusRef}>
        <span className="mr-4">Төлөв:</span>
        <button
          className="border px-2 py-1 rounded hover:text-blue-600"
          onClick={() => toggleDropdown("status")}
        >
          {exam.status === "active" ? "Нээлттэй" : "Хаалттай"} ▼
        </button>
        {dropdownStates.status && (
          <div className="absolute bg-white border shadow mt-2 z-10">
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStatusChange("active")}
              >
                Нээлттэй
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStatusChange("inactive")}
              >
                Хаалттай
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
