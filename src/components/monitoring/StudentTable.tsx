"use client";

import React from "react";
import { ExamWithStudentInfo } from "@/lib/types/interface";

interface Props {
  students: ExamWithStudentInfo[];
}

export default function StudentTable({ students }: Props) {
  return (
    <div className="mt-4 border rounded-lg shadow-md overflow-hidden">
      <table className="w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Шалгуулагчид</th>
            <th className="p-2 text-left">Оноо</th>
            <th className="p-2 text-left">Гүйцэтгэсэн хугацаа</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
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
  );
}
