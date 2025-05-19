import QuestionType from "@/components/create-exam/QuestionType";
import {
  CircleDot,
  Info,
  Text,
  Menu,
  Code,
  List,
  TextCursorInput,
} from "lucide-react";

type functionType = {
  handleSelect: (type: string) => void;
};
export default function QuestionList({ handleSelect }: functionType) {
  return (
    <div className="max-w-2xl mx-auto mb-20">
      <div className="bg-green-400 rounded-t-2xl flex justify-between items-center">
        <div className="py-4">
          <p className="pl-4 text-white">Шинэ асуулт</p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-b-lg">
        <div className="flex flex-col space-y-10 p-6">
          <div className="flex items-center">
            <div className="border text-[10px] p-1 px-2 bg-gray-900 text-white font-bold rounded-2xl mr-1">
              A
            </div>
            <p className="text-[14px] text-gray-900">= Автомат тест</p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-gray-900">
            <QuestionType
              icon={<Info size={40} />}
              label="Мэдээлэл"
              QuestionType="information-block"
              handleSelect={handleSelect}
            />
            <QuestionType
              icon={<List size={40} />}
              label="Олон сонголт"
              QuestionType="multiple-choice"
              handleSelect={handleSelect}
              badge
            />
            <QuestionType
              icon={<Menu size={40} />}
              label="Богино хариулт"
              QuestionType="simple-choice"
              handleSelect={handleSelect}
              badge
            />
            <QuestionType
              icon={<Text size={40} />}
              label="Текст талбар"
              QuestionType="free-text"
              handleSelect={handleSelect}
            />
            <QuestionType
              icon={<Code size={40} />}
              label="Код"
              QuestionType="code"
              handleSelect={handleSelect}
            />
            <QuestionType
              icon={<TextCursorInput size={40} />}
              label="Нөхөх"
              QuestionType="fill-choice"
              handleSelect={handleSelect}
              badge
            />
          </div>
        </div>
      </div>
    </div>
  );
}
