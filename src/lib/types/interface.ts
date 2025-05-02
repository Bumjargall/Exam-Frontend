import { Types } from "mongoose";

export type AnswerOption = {
  text: string;
  isCorrect: boolean;
};

export interface Question {
  id: string;
  question: string;
  options?: string[];
  answers?: AnswerOption[];
  score: number;
  type:
    | "multiple-choice"
    | "simple-choice"
    | "fill-choice"
    | "free-text"
    | "information-block"
    | "code";
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
  createdAt: Date | string;
  updatedAt?: Date | string;
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
