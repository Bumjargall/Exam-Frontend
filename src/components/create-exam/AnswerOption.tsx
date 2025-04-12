"use client";
import { useState } from "react";
import { ListOrdered, Shuffle, CheckSquare, CircleDot } from "lucide-react";
import Link from "next/link";
import { string } from "zod";
import { Switch } from "@/components/ui/switch";
import {Label} from "@/components/ui/label"

export default function AnswerOption() {
  const [open, setOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSingleSelect, setIsSingleSelect] = useState(false);
  const [addAnswer, setAddAnswer] = useState<{text:string;active:boolean}[]>([])
  const [value, setValue] = useState("");

  const handleAddAnswer = () => {
    if(value.trim() !== ""){
      setAddAnswer([...addAnswer, {text:value, active:false}])
      setValue("");
    }
  }
  const toggleAnswerActive = (index:number) =>{
    const updated = [...addAnswer];
    updated[index].active = !updated[index].active;
    setAddAnswer(updated);
  }

  return (
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
          {/* First Toggle:*/}
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isShuffled}
                onChange={() => setIsShuffled(!isShuffled)}
              />
              <div className="flex items-center space-x-2">
                <div className="relative w-20 h-8 bg-gray-200 peer-focus:outline-none rounded-lg flex items-center justify-between p-1 transition-all">
                  <div
                    className={`flex items-center justify-center w-8 h-6 rounded-md transition-all ${
                      !isShuffled ? "bg-gray-800 text-white" : "text-gray-500"
                    }`}
                  >
                    <ListOrdered size={16} />
                  </div>
                  <div
                    className={`flex items-center justify-center w-8 h-6 rounded-md transition-all ${
                      isShuffled ? "bg-gray-800 text-white" : "text-gray-500"
                    }`}
                  >
                    <Shuffle size={16} />
                  </div>
                </div>
              </div>
            </label>
            <div className="text-gray-900 text-sm">
              {isShuffled ? "Shuffled Order" : "Fixed Order"}
            </div>
          </div>

          {/* Second Toggle: Selection Mode */}
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isSingleSelect}
                onChange={() => setIsSingleSelect(!isSingleSelect)}
              />
              <div className="flex items-center space-x-2">
                <div className="relative w-20 h-8 bg-gray-200 peer-focus:outline-none rounded-lg flex items-center justify-between p-1 transition-all">
                  <div
                    className={`flex items-center justify-center w-8 h-6 rounded-md transition-all ${
                      !isSingleSelect ? "bg-gray-800 text-white" : "text-gray-500"
                    }`}
                  >
                    <CheckSquare size={16} />
                  </div>
                  <div
                    className={`flex items-center justify-center w-8 h-6 rounded-md transition-all ${
                      isSingleSelect ? "bg-gray-800 text-white" : "text-gray-500"
                    }`}
                  >
                    <CircleDot size={16} />
                  </div>
                </div>
              </div>
            </label>
            <div className="text-gray-900 text-sm">
              {isSingleSelect ? "Single Select" : "Multiple Select"}
            </div>
          </div>

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
                onClick={handleAddAnswer}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Хариулт нэмэх
              </button>
            </div>
            <div className="space-y-3">
              {addAnswer.map((addAnswer,index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span className="text-gray-800">{addAnswer.text}</span>
                  <label className="flex items-center cursor-pointer">
                     <Switch id="airplane-mode"
                     checked={addAnswer.active}
                     onChange={() => toggleAnswerActive(index)}
                     className="cursor-pointer"/>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}