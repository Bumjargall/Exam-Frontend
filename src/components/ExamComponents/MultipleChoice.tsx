import React from "react";
import TextEditor from "@/components/rich-text/TextEditor";
import SaveQuestion from "@/components/ui/savequestion";
import AnswerOption from "@/components/create-exam/AnswerOption";
import MarkingRules from "@/components/create-exam/MarkingRules";
import { X } from "lucide-react";
import RichTextEditor from "../rich-text";
type functionType = {
  handleSelect: (type: string | null) => void;
}
export default function MultipleChoice({handleSelect}: functionType) {
  return (
    <div className="max-w-2xl mx-auto mb-20 shadow">
      <div className="bg-gray-100 flex items-center justify-between">
        <div className="py-4">
          <p className="pl-4 text-gray-900">Олон сонголт</p>
        </div>
        <button type="button" className="cursor-pointer pr-4" onClick={() => handleSelect(null)}>
          <X />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <TextEditor />
        <AnswerOption />
        <MarkingRules />
      </div>
      <SaveQuestion text="Хадгалах" />
    </div>
  );
}
