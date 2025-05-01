import { create } from "zustand";
import { persist } from "zustand/middleware";
type AnswerOption = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  type: string;
  question: string;
  answers?: AnswerOption[];
  score?: number;
};

type Exam = {
  _id?: string;
  title?: string;
  description?: string;
  questions: Question[];
  dateTime?: Date | string;
  duration?: number;
  totalScore?: number;
  status?: "active" | "inactive";
  key?: string;
  createUserById?: string;
  createdAt?: Date | string;
};

type ExamStore = {
  exam: Exam | null;
  setExam: (exam: Exam) => void;
  addQuestion: (newQuestion: Question) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (index: number, updatedQuestion: Question) => void;
  clearExam: () => void;
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      exam: null,

      setExam: (exam) => set({ exam }),
      addQuestion: (newQuestion) =>
        set((state) => {
          if (!state.exam) {
            console.warn("Exam байхгүй байна. setExam() эхэлж дуудаарай.");
            return state;
          }

          const updatedQuestions = [...state.exam.questions, newQuestion];
          return {
            exam: {
              ...state.exam,
              questions: updatedQuestions,
            },
          };
        }),

      removeQuestion: (questionId) =>
        set((state) => {
          if (!state.exam) {
            console.warn("Exam байхгүй байна. setExam() эхэлж дуудаарай.");
            return state;
          }

          const updatedQuestions = state.exam.questions.filter(
            (q) => q.id !== questionId
          );

          return {
            exam: {
              ...state.exam,
              questions: updatedQuestions,
            },
          };
        }),

      updateQuestion: (index, updatedQuestion) =>
        set((state) => {
          if (!state.exam) {
            console.warn("Exam байхгүй байна. setExam() эхэлж дуудаарай.");
            return state;
          }

          const updatedQuestions = [...state.exam.questions];
          if (index < 0 || index >= updatedQuestions.length) {
            console.warn("Индекс буруу байна.");
            return state;
          }

          updatedQuestions[index] = updatedQuestion;

          return {
            exam: {
              ...state.exam,
              questions: updatedQuestions,
            },
          };
        }),

      clearExam: () => set({ exam: null }),
    }),
    {
      name: "exam-storage",
    }
  )
);
