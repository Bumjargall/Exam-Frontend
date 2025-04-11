import QuestionType from "@/components/create-exam/QuestionType";
type functionType = {
  handleSelect:(type:string)=>void;
}
export default function QuestionList({handleSelect}:functionType) {
  return (
    <div className="border border-gray-200">
      <div className="flex flex-col space-y-10 p-6">
        <div className="flex items-center">
          <div className="border text-[10px] p-1 px-2 bg-gray-900 text-white font-bold rounded-2xl mr-1">A</div>
          <p className="text-[14px] text-gray-900">= Автомат тест</p>
        </div>
        <div className="grid grid-cols-4 gap-4 text-gray-900">
          <QuestionType icon="ri-information-line" label="Мэдээлэл" QuestionType="information-block" handleSelect={handleSelect}/>
          <QuestionType imageSrc="/multiplechoice.svg" label="Олон сонголт" QuestionType="multiple-choice" handleSelect={handleSelect} badge/>
          <QuestionType icon="ri-menu-line" label="Богино хариулт" QuestionType="simple-choice" handleSelect={handleSelect} badge />
          <QuestionType icon="ri-file-text-line" label="Текст талбар" QuestionType="free-text" handleSelect={handleSelect} />
          <QuestionType icon="ri-code-s-slash-line" label="Код" QuestionType="free-text" handleSelect={handleSelect} />
          <QuestionType imageSrc="/fill.svg" label="Нөхөх" QuestionType="fill-choice" handleSelect={handleSelect} badge />
        </div>
      </div>
    </div>
  );
}