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
          <QuestionType icon="ri-information-line" label="Мэдээлэл" handType="information-block" handleSelect={handleSelect}/>
          <QuestionType imageSrc="/multiplechoice.svg" label="Олон сонголт" handType="multiple-choice" badge/>
          <QuestionType icon="ri-menu-line" label="Богино хариулт" handType="simple-choice" badge />
          <QuestionType icon="ri-file-text-line" label="Текст талбар" handType="free-text" />
          <QuestionType icon="ri-code-s-slash-line" label="Код" handType="free-text" />
          <QuestionType imageSrc="/fill.svg" label="Нөхөх" handType="fill-choice" badge />
        </div>
      </div>
    </div>
  );
}