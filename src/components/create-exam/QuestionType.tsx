import Link from "next/link";
interface QuestionTypeProps {
  icon?: React.ReactNode;
  label: string;
  badge?: boolean;
  imageSrc?: string;
  QuestionType: string;
  handleSelect: (type: string) => void;
}

export default function QuestionType({
  icon,
  label,
  badge,
  imageSrc,
  QuestionType,
  handleSelect,
}: QuestionTypeProps) {
  return (
    <button
      type="button"
      className="relative flex flex-col space-y-2 cursor-pointer"
      onClick={() => handleSelect(`${QuestionType}`)}
    >
      <div className="bg-gray-100 py-5 text-center rounded-lg border border-gray-200 shadow flex justify-center items-center">
        {icon}
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
