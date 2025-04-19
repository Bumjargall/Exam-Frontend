"use client";

import React, { useState, useEffect } from "react";

type GapRendererProps = {
  text: string;
  onChange?: (answers: string[]) => void;
};

const GapRenderer: React.FC<GapRendererProps> = ({ text, onChange }) => {
  const parts = text.split(/(\{gap(?:-\d+)?\})/g);

  const initialAnswers = parts.filter((p) => /\{gap(?:-\d+)?\}/.test(p)).map(() => "");
  const [answers, setAnswers] = useState<string[]>(initialAnswers);

  useEffect(() => {
    if (onChange) {
      onChange(answers);
    }
  }, [answers, onChange]);

  let gapIndex = 0;

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {parts.map((part, index) => {
        if (/\{gap(?:-\d+)?\}/.test(part)) {
          const currentIndex = gapIndex++;
          return (
            <input
              key={index}
              type="text"
              className="border border-gray-300 w-28 px-3 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              placeholder={``}
              value={answers[currentIndex]}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
            />
          );
        } else {
          return (
            <span key={index} className="text-gray-900 whitespace-pre-wrap">
              {part}
            </span>
          );
        }
      })}
    </div>
  );
};

export default GapRenderer;
