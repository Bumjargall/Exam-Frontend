// components/monitoring/AnswerReviewDrawer.tsx
"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamQuestion, StudentAnswer } from "@/lib/types/interface"; // Та өөрийн interface-аасаа тохируулна

type Props = {
  studentName: string;
  questions: StudentAnswer[];
  onSave: (updatedAnswers: StudentAnswer[]) => void;
};

const AnswerReviewDrawer: React.FC<Props> = ({
  studentName,
  questions,
  onSave,
}) => {
  const [editedAnswers, setEditedAnswers] =
    useState<StudentAnswer[]>(questions);

  const handleScoreChange = (questionId: string, newScore: number) => {
    const updated = editedAnswers.map((q) =>
      q.questionId === questionId ? { ...q, score: newScore } : q
    );
    setEditedAnswers(updated);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <p className="cursor-pointer text-blue-600 hover:underline">
          {studentName}
        </p>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>Хариу засах - {studentName}</DrawerTitle>
          <DrawerDescription>
            Гар үнэлгээ шаардлагатай асуултууд
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 max-h-[70vh] overflow-auto">
          {editedAnswers.map((q, idx) => (
            <div
              key={q.questionId}
              className="border p-3 rounded-md bg-white shadow"
            >
              <p className="font-semibold">
                {idx + 1}. {q.questionText}
              </p>
              <p className="text-sm text-gray-600 mb-2">Хариулт:</p>
              <Textarea value={q.answer} readOnly className="mb-2" />

              <Input
                type="number"
                value={q.score ?? ""}
                placeholder="Оноо оруулах"
                onChange={(e) =>
                  handleScoreChange(q.questionId, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onSave(editedAnswers)}>Хадгалах</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AnswerReviewDrawer;
