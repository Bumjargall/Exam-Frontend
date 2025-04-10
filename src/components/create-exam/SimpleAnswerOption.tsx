"use client";
import { useState } from "react";
import { ListOrdered, Shuffle, CheckSquare, CircleDot } from "lucide-react";
import Link from "next/link";

export default function AnswerOption() {
  const [open, setOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSingleSelect, setIsSingleSelect] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Answer Option Toggle */}
      <Link
        href=""
        onClick={() => setOpen(!open)}
        type="button"
        className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg"
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
      </Link>

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
              />
            </div>
            <div>
              <Link href=""
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Асуулт нэмэх
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}