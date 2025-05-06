import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExamInput, Question, AnswerOption } from "@/lib/types/interface";

type ExamStore = {
  exam: ExamInput | null;
  setExam: (exam: ExamInput) => void;
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
