"use client";
import { useEffect, useState } from "react";

type ScoreProps = {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  initialScore?: number;
};
export default function MarkingRules({
  score,
  setScore,
  initialScore = 0,
}: ScoreProps) {
  const [open, setOpen] = useState(false);

  const scoreUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = e.target.valueAsNumber;
    if (!isNaN(newScore)) {
      setScore(newScore);
    }
  };
  useEffect(() => {
    if (typeof initialScore !== "number") {
      setScore(initialScore);
    }
  }, [initialScore, setScore]);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex items-center justify-between w-full py-3 text-gray-900 bg-gray-100 gap-3 px-2 rounded-t-lg cursor-pointer"
      >
        <span className="text-gray-600 pl-3">Marking rules</span>
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
      {open && (
        <div className="p-5 bg-gray-100 rounded-b-lg border-b">
          <label className="font-medium text-gray-900 mb-2 block">
            Шалгалтын оноо
          </label>
          <input
            name="score"
            type="number"
            value={score}
            className="rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
            onChange={scoreUpdate}
          />
        </div>
      )}
    </div>
  );
}
