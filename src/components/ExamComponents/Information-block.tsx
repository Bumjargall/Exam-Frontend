import React from "react";
import Texteditor from "@/components//rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import AnswerOption from "@/components/create-exam/AnswerOption";
import MarkingRules from "@/components/create-exam/MarkingRules";
import SimpleAnswerOption from "@/components/create-exam/SimpleAnswerOption";
import { X } from "lucide-react";
type functionType = {
  handleSelect: (type: string | null) => void;
}
export default function InformationBlock({handleSelect}:functionType) {
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Мэдээлэл</p>
        </div>
        <button className="cursor-pointer pr-4" onClick={() => handleSelect(null)}>
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <Texteditor />
      </div>
      <SaveQuestion text="Хадгалах" />
    </div>
  );
}
