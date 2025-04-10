import Link from "next/link";

export default function CreateExamHeader() {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg border-b">
      <div>
        <input
          type="text"
          id="text"
          className="w-[500px] py-2 bg-white border border-gray-300 rounded-lg pl-4 placeholder-gray-500"
          placeholder="Шалгалтын нэр"
        />
      </div>
      <div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/register" className="p-2.5 bg-white border border-gray-900 rounded-lg text-gray-900 hover:bg-gray-200">
              <i className="ri-eye-line"></i>
            </Link>
          </li>
          <li>
            <Link href="/register" className="p-2.5 border border-gray-900 rounded-lg text-black hover:bg-gray-200">
              Баталгаажуулах
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}