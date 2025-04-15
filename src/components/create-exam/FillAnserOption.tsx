"use client";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

type Answer = {
  text: string;
  editMode: boolean;
};

interface FillAnswerOptionProps {
  addAnswer: Answer[];
  setAddAnswer: React.Dispatch<React.SetStateAction<Answer[]>>;
}

export default function FillAnswerOption({
  addAnswer,
  setAddAnswer,
}: FillAnswerOptionProps) {
  const handleEditText = (index: number, newText: string) => {
    const updated = [...addAnswer];
    updated[index].text = newText;
    setAddAnswer(updated);
  };

  const handleDeleteAnswer = (index: number) => {
    const updated = addAnswer.filter((_, i) => i !== index);
    setAddAnswer(updated);
  };

  const toggleEditMode = (index: number) => {
    const updated = [...addAnswer];
    updated[index].editMode = !updated[index].editMode;
    setAddAnswer(updated);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg cursor-pointer">
        <span className="text-gray-600">Answer option</span>
      </div>
      <div className="flex flex-col space-y-5 bg-gray-100 p-3 py-5">
        <div className="flex flex-col space-y-2">
          <div>
            <p>Gaps</p>
          </div>
          <div className="space-y-3">
            {addAnswer.map((answer, index) => (
              <div
                key={index}
                className="flex justify-between bg-white py-2 px-3 w-full border rounded-lg space-x-3"
              >
                <div className="flex items-center w-full">
                  {answer.editMode ? (
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => handleEditText(index, e.target.value)}
                      className="border border-gray-400 py-1 rounded-lg px-2 items-center w-full"
                    />
                  ) : (
                    <span className="text-gray-900">{answer.text}</span>
                  )}
                </div>
                <div className="flex justify-between items-center space-x-2">
                  <button
                    className="p-2 bg-red-500 rounded-lg cursor-pointer"
                    onClick={() => handleDeleteAnswer(index)}
                  >
                    <Trash2 size={18} color="white" />
                  </button>
                  <button
                    className="p-2 bg-gray-900 rounded-lg cursor-pointer"
                    onClick={() => toggleEditMode(index)}
                  >
                    <Pencil size={18} color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
