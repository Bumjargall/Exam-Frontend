import { Types } from "mongoose";
import { ReactNode } from "react";
export type AnswerOption = {
  text: string;
  isCorrect?: boolean;
};

export interface Question {
  _id: string;
  question: string;
  answers?: AnswerOption[];
  score?: number;
  type:
    | "multiple-choice"
    | "simple-choice"
    | "fill-choice"
    | "free-text"
    | "information-block"
    | "code";
}
export interface StudentWithExamInfo {
  examId: string;
  _id: string;
  score: number;
  submittedAt: Date | string;
  examInfo: {
    _id: string;
    title: string;
    createdAt: string;
    totalScore: number;
    key: string;
  };
}
export interface SubmitExam {
  examId: string;
  studentId: string;
  questions: {
    questionId: string;
    answer?: string | number | string[] | number[];
    score: number;
  }[];
  score: number;
  submittedAt: Date | string;
  status: string;
  pending: string;
}
export interface ExamInput {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  questions: Question[];
  dateTime: Date | string;
  duration: number;
  totalScore: number;
  status: "active" | "inactive";
  key: string;
  createUserById: Types.ObjectId | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
export interface StudentExam {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  questions: Question[];
  dateTime: Date | string;
  duration: number;
  totalScore: number;
  status: "active" | "inactive";
  key: string;
  createUserById: Types.ObjectId | string;
  createdAt: Date | string;
}

export interface User {
  _id: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "teacher" | "student";
  updateAt: Date;
  createdAt: Date;
}

export interface Exam extends ExamInput {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Result {
  _id: Types.ObjectId | string;
  examId: Types.ObjectId | string;
  studentId: User;
  score: number;
  answers: {
    questionId: string;
    answer: number | number[] | string;
    isCorrect: boolean;
  }[];
  submittedAt: Date;
  status: "taking" | "submitted";
}

export interface ExamWithStudentInfo {
  _id: string;
  examId: string;
  submittedAt: Date | string;
  score: number;
  status: "taking" | "submitted";
  questions: {
    questionId: string;
    answer: string | number | string[] | number[];
    score: number;
  }[];
  duration?: number;
  studentInfo: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  examInfo: {
    _id: string;
    title: string;
  };
}
//handleExamSelect calls onClickExam
export type GetResultByUsersResponse = {
  success: boolean;
  count: number;
  data: ExamWithStudentInfo[];
};
