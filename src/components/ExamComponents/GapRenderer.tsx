"use client";

import React, { useState, useEffect } from "react";

type GapRendererProps = {
  text: string;
  onChange?: (answers: string[]) => void;
};

const GapRenderer: React.FC<GapRendererProps> = ({ text = "", onChange }) => {
  const parts = text.split(/(\{gap(?:-\d+)?\})/g);

  const hasGap = parts.some((p) => /\{gap(?:-\d+)?\}/.test(p));

  const initialAnswers = parts
    .filter((p) => /\{gap(?:-\d+)?\}/.test(p))
    .map(() => "");

  const [answers, setAnswers] = useState<string[]>(initialAnswers);

  useEffect(() => {
    if (onChange) {
      onChange(answers);
    }
  }, [answers, onChange]);

  const handleInputChange = (index: number, value: string) => {
    if (index < 0 || index >= answers.length) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const stripHtml = (html: string) => {
    if (typeof document !== "undefined") {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html;
  };

  if (!hasGap) {
    return (
      <span className="text-gray-900 whitespace-pre-wrap">
        {stripHtml(text)}
      </span>
    );
  }

  let gapIndex = 0;

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
              placeholder={`...`}
              value={answers[currentIndex]}
              onChange={(e) => handleInputChange(currentIndex, e.target.value)}
            />
          );
        } else {
          return (
            <span key={index} className="text-gray-900 whitespace-pre-wrap">
              {stripHtml(part)}
            </span>
          );
        }
      })}
    </div>
  );
};

export default GapRenderer;
