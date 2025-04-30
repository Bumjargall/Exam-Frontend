// store/examStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AnswerOption = {
  text: string;
  isCorrect: boolean;
};

type ExamQuestion = {
  id: string;
  type: string;
  question: string;
  answers?: AnswerOption[];
  score?: number;
};

interface ExamState {
  questions: ExamQuestion[];
  setQuestions: (questions: ExamQuestion[]) => void;
  removeToExam: (id: string) => void;
  updateQuestion: (index: number, newExam: ExamQuestion) => void;
}

export const useEditStore = create<ExamState>()(
  persist(
    (set) => ({
      questions: [],
      setQuestions: (questions) => set({ questions }),
      updateQuestion: (index, newExam) =>
        set((state) => {
          const updatedExams = [...state.questions];
          updatedExams[index] = { ...updatedExams[index], ...newExam };
          return { questions: updatedExams };
        }),
      removeToExam: (id) =>
        set((state) => ({
          questions: state.questions.filter((question) => question.id !== id),
        })),
    }),
    {
      name: "exam-storage",
    }
  )
);
