import Link from "next/link";
interface QuestionTypeProps {
  icon?: string;
  label: string;
  badge?: boolean;
  imageSrc?: string;
  QuestionType: string;
  handleSelect: (type: string) => void; // handleSelect-ийг энд нэмсэн
}


export default function QuestionType({ 
  icon, 
  label, 
  badge, 
  imageSrc, 
  QuestionType, 
  handleSelect 
}: QuestionTypeProps){
  return (
    <button type="button" className="relative flex flex-col space-y-2 cursor-pointer" onClick={()=> handleSelect(`${QuestionType}`)}>
      <div className="bg-gray-100 py-5 text-center rounded-lg border border-gray-200 shadow flex justify-center items-center">
        {imageSrc ? <img src={imageSrc} className="h-10" alt="" /> : <i className={`text-4xl ${icon}`}></i>}
        {badge && (
          <p className="absolute top-2 left-2 p-1 text-[10px] px-2 bg-gray-900 rounded-2xl text-white font-bold">
            A
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-900 text-center">{label}</p>
      </div>
    </button>
  );
}