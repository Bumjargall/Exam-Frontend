"use client";
import TextEditor from "@/components/rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import FillAnswerOption from "../create-exam/FillAnserOption";
import MarkingRules from "@/components/create-exam/MarkingRules";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import FillTextEditor from "@/components/rich-text/FillTextEditor";

type functionType = {
  handleSelect: (type: string | null) => void;
};

export default function FillChoice({ handleSelect }: functionType) {
  const editorRef = useRef<any>(null);
  const [addAnswer, setAddAnswer] = useState<
    { text: string; editMode: boolean }[]
  >([]);

  const handleAddGap = (gapText: string) => {
    setAddAnswer((prev) => [
      ...prev,
      { text: `Gap ${prev.length + 1}`, editMode: false },
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Нөхөх</p>
        </div>
        <button className="cursor-pointer pr-4" onClick={() => handleSelect(null)}>
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <FillTextEditor onAddGap={handleAddGap} ref={editorRef} />
        <FillAnswerOption
          addAnswer={addAnswer}
          setAddAnswer={setAddAnswer}
        />
        <MarkingRules />
      </div>
      <SaveQuestion text="Хадгалах" />
    </div>
  );
}
