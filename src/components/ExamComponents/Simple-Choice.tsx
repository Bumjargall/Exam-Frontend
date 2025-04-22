import React, { useState, useEffect } from "react";
import Texteditor from "@/components/rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import MarkingRules from "@/components/create-exam/MarkingRules";
import SimpleAnswerOption from "@/components/create-exam/SimpleAnswerOption";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ListOrdered,
  Shuffle,
  CheckSquare,
  CircleDot,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";

type functionType = {
  handleSelect: (type: string | null) => void;
  exam: { type: string; question: string; answers: any[]; score: number }[];
  setExam: React.Dispatch<
    React.SetStateAction<
      { type: string; question: string; answers: any[]; score: number }[]
    >
  >;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
};
export default function SimpleChoice({
  handleSelect,
  exam,
  setExam,
  editingIndex,
  setEditingIndex,
  setSelectedType,
}: functionType) {
  const [questionData, setQuestionData] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [addAnswer, setAddAnswer] = useState<
    { text: string; isCorrect: true; editMode: boolean }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSingleSelect, setIsSingleSelect] = useState(false);
  const [value, setValue] = useState("");
  const HandleAddAnswer = () => {
    if (value.trim() !== "") {
      setAddAnswer([
        ...addAnswer,
        { text: value, isCorrect: true, editMode: false },
      ]);
    }
    setValue("");
  };
  useEffect(() => {
    if (editingIndex !== null) {
      const current = exam[editingIndex];
      setQuestionData(current.question);
      setAddAnswer(current.answers);
      setScore(current.score);
    }
  }, [editingIndex, exam]);

  // simple answer options
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
  // save btn
  const handleSave = () => {
    if (!questionData.trim()) {
      toast("Асуултын текст хоосон байна!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    if (score === 0) {
      toast("Та оноогоо тохируулж өгнө үү!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    const newQuestion = {
      type: "simple-choice",
      question: questionData,
      answers: addAnswer,
      score: score,
    };
    console.log("Add options----> ", newQuestion);

    setExam((prev) => {
      const updatedExam = [...prev, newQuestion];
      console.log("exam after add--->", updatedExam);
      return updatedExam;
    });
    handleSelect(null); // Form-oo хаах
    setEditingIndex(null);
    setSelectedType(null);
  };

  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="flex justify-between items-center bg-gray-100">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Богино хариулт</p>
        </div>
        <button
          type="button"
          className="cursor-pointer pr-4"
          onClick={() => {
            handleSelect(null);
            setEditingIndex(null);
            setSelectedType(null);
          }}
        >
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <Texteditor
          questionData={questionData}
          setQuestionData={setQuestionData}
        />
        <div className="max-w-2xl mx-auto">
          {/* Answer Option Toggle */}
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg cursor-pointer"
          >
            <span className="text-gray-600">Answer option</span>
            <svg
              className={`w-3 h-3 transform transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>

          {/* Toggles */}
          {open && (
            <div className="flex flex-col space-y-5 bg-gray-100 p-3 py-5">
              {/* Input and Button */}
              <div className="flex flex-col space-y-5">
                <div>
                  <input
                    type="text"
                    className="bg-white py-2.5 px-3 w-full border rounded-lg"
                    placeholder="...."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
                    onClick={HandleAddAnswer}
                  >
                    Хариулт нэмэх
                  </button>
                </div>
                <div className="space-y-3">
                  {addAnswer.map((addAnswer, index) => (
                    <div
                      key={index}
                      className="flex justify-between bg-white py-2 px-3 w-full border rounded-lg space-x-3"
                    >
                      <div className="flex items-center w-full">
                        {addAnswer.editMode ? (
                          <input
                            type="text"
                            value={addAnswer.text}
                            onChange={(e) =>
                              handleEditText(index, e.target.value)
                            }
                            className="border border-gray-400 py-1 rounded-lg px-2 items-center w-full"
                          />
                        ) : (
                          <span className="text-gray-900">
                            {addAnswer.text}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center space-x-2">
                        <div className="flex space-x-2">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <MarkingRules score={score} setScore={setScore} />
      </div>
      {/*Save button */}
      <div className="rounded-b-lg border-t">
        <div className="py-5">
          <div className="text-center text-gray-900">
            <button
              className="py-2 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100"
              onClick={handleSave}
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
