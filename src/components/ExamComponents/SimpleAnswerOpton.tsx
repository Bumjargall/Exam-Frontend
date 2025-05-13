"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListOrdered, Shuffle, Trash2, Pencil } from "lucide-react";

type AnswerOptionProps = {
  onOptionsChange: (options: { text: string }[]) => void;
  initialOptions?: { text: string }[];
};

export default function AnswerOption({
  onOptionsChange,
  initialOptions = [],
}: AnswerOptionProps) {
  const [open, setOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [addAnswer, setAddAnswer] = useState<
    { text: string; editMode: boolean }[]
  >([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setAddAnswer(
        initialOptions.map((option) => ({
          text: option.text,
          editMode: false,
        }))
      );
    }
  }, [initialOptions]);

  useEffect(() => {
    if (isShuffled) {
      shuffleAnswer();
    }
  }, [isShuffled]);

  const shuffleAnswer = () => {
    const shuffled = [...addAnswer].sort(() => Math.random() - 0.5);
    setAddAnswer(shuffled);
    syncToParent(shuffled);
  };

  const syncToParent = (updatedAnswers: typeof addAnswer) => {
    const optionsToSend = updatedAnswers.map((a) => ({
      text: a.text,
    }));
    onOptionsChange(optionsToSend);
  };

  const handleAddAnswer = () => {
    if (!value.trim()) {
      toast("Хариултын текст хоосон байна!", {
        action: { label: "Хаах", onClick: () => console.log("OK") },
      });
      return;
    }
    const updated = [...addAnswer, { text: value, editMode: false }];
    setAddAnswer(updated);
    syncToParent(updated);
    setValue("");
  };

  const handleStartEdit = (index: number) => {
    setCurrentEditIndex(index);
  };

  const handleFinishEdit = () => {
    setCurrentEditIndex(null);
  };

  const handleEditText = (index: number, newText: string) => {
    const updated = [...addAnswer];
    updated[index].text = newText;
    setAddAnswer(updated);
    syncToParent(updated);
  };

  const handleDeleteAnswer = (index: number) => {
    if (confirm("Энэ хариултыг устгах уу?")) {
      const updated = addAnswer.filter((_, i) => i !== index);
      setAddAnswer(updated);
      syncToParent(updated);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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

      {open && (
        <div className="flex flex-col space-y-5 bg-gray-100 p-3 py-5">
          {/* Shuffle toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isShuffled}
                onChange={() => setIsShuffled(!isShuffled)}
              />
              <div className="relative w-20 h-8 bg-gray-200 rounded-lg flex items-center justify-between p-1">
                <div
                  className={`flex items-center justify-center w-8 h-6 rounded-md ${
                    !isShuffled ? "bg-gray-800 text-white" : "text-gray-500"
                  }`}
                >
                  <ListOrdered size={16} />
                </div>
                <div
                  className={`flex items-center justify-center w-8 h-6 rounded-md ${
                    isShuffled ? "bg-gray-800 text-white" : "text-gray-500"
                  }`}
                >
                  <Shuffle size={16} />
                </div>
              </div>
            </label>
            <div className="text-sm">
              {isShuffled ? "Shuffled Order" : "Fixed Order"}
            </div>
          </div>

          {/* Input & Add Button */}
          <div className="flex flex-col space-y-5">
            <input
              type="text"
              className="bg-white py-2.5 px-3 w-full border rounded-lg"
              placeholder="...."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddAnswer}
              disabled={!value.trim()}
              className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg text-sm px-5 py-2.5 cursor-pointer"
            >
              Хариулт нэмэх
            </button>

            {/* Answer list */}
            <div className="space-y-3">
              {addAnswer.map((a, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-white py-2 px-3 w-full border rounded-lg space-x-3"
                >
                  <div className="flex items-center w-full">
                    {currentEditIndex === index ? (
                      <input
                        type="text"
                        value={a.text}
                        autoFocus
                        onChange={(e) => handleEditText(index, e.target.value)}
                        onBlur={handleFinishEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleFinishEdit();
                          }
                        }}
                        className="border border-gray-400 py-1 rounded-lg px-2 w-full"
                      />
                    ) : (
                      <span className="text-gray-800">{a.text}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      aria-label="Delete answer"
                      className="p-2 bg-red-500 rounded-lg"
                      onClick={() => handleDeleteAnswer(index)}
                    >
                      <Trash2 size={18} color="white" />
                    </button>
                    <button
                      className="p-2 bg-gray-800 rounded-lg"
                      onClick={() => handleStartEdit(index)}
                    >
                      <Pencil size={18} color="white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
