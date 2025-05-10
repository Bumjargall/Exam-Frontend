"use client";

import React from "react";
import SelectExamComponent from "@/app/teacher/monitoring/components/SelectExamComponent";
import { Exam, ExamWithStudentInfo } from "@/lib/types/interface";

interface Props {
  exams: Exam[];
  studentResults: ExamWithStudentInfo[];
  onExamSelect: (exam: Exam) => void;
  isExamTitleVisible: boolean;
  setExamTitleVisible: (val: boolean) => void;
  lastExam: Exam;
}

export default function StudentList({
  exams,
  studentResults,
  onExamSelect,
  isExamTitleVisible,
  setExamTitleVisible,
  lastExam,
}: Props) {
  const renderStudentList = (status: "taking" | "submitted") => (
    <ul>
      {studentResults
        .filter((data) => data.status === status)
        .map((data) => (
          <li
            key={`${data._id}-${data.studentInfo._id}`}
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
    <div className="left_container w-1/5 px-2">
      <div
        onClick={() => setExamTitleVisible(!isExamTitleVisible)}
        className="last_exam flex border-b-2 bg-gray-200 px-2 relative cursor-pointer rounded-lg"
        id="menu-button"
      >
        <p className="text-[18px]">{lastExam.title}</p>
        <i className="ri-arrow-down-s-fill absolute right-2 text-2xl"></i>
      </div>

      {isExamTitleVisible && (
        <SelectExamComponent
          exams={exams.map((e) => ({ id: e._id.toString(), title: e.title }))}
          onClickExam={(e) => {
            const foundExam = exams.find((ex) => ex._id.toString() === e.id);
            if (foundExam) {
              onExamSelect(foundExam);
              setExamTitleVisible(false);
            }
          }}
          onMouseLeave={() => setExamTitleVisible(false)}
        />
      )}

      <div className="searchStudent flex justify-between items-center pt-6 ">
        <input
          type="text"
          placeholder="Хайх нэр..."
          className="w-full border-2 border-gray-100 border-r-0 rounded-l-lg p-2"
        />
        <i className="ri-search-line border-2 border-gray-100 border-l-0 rounded-r-lg py-2 pr-2"></i>
      </div>

      <div className="pt-4">
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
  );
}
