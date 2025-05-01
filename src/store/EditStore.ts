import { create } from "zustand";
import { persist } from "zustand/middleware";
type answerOption = {
  text: string;
  isCorrect: boolean;
};
type examStoreData = {
  id: string;
  type: string;
  question: string;
  answers?: answerOption[];
  score?: number;
};
type ExamStore = {
  exams: examStoreData[];
  setQuestions: (exams: examStoreData[]) => void;
  addToExam: (NewExam: examStoreData) => void;
  removeToExam: (id: string) => void;
  clearExam: () => void;
  updateExam: (index: number, newExam: examStoreData) => void;
};
export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      exams: [],
      addToExam: (NewExam) =>
        set((state) => ({
          exams: [...state.exams, NewExam],
        })),
      setQuestions: (exams) => set({ exams }),
      removeToExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((exam) => exam.id !== id),
        })),
      updateExam: (index, newExam) =>
        set((state) => {
          const updatedExams = [...state.exams]; // 1. Хуучин exams массивын хуулбарыг авна.
          updatedExams[index] = { ...updatedExams[index], ...newExam }; // 2. Тухайн index-тэй exam-ийн мэдээллийг шинэ `newExam`-оор update хийнэ.
          return { exams: updatedExams }; // 3. Шинэчлэгдсэн exams массивыг буцааж state-д хадгална.
        }),
      clearExam: () => set({ exams: [] }),
    }),
    {
      name: "exam-storage",
    }
  )
);
