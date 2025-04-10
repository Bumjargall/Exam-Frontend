import CreateExamHeader from "@/components/create-exam/QuestionList";
import QuestionList from "@/components/create-exam/CreateExamHeader";

export default function CreateExam() {
  return (
      <div className="mt-10">
      <div className="max-w-4xl mx-auto flex">
        <div className="bg-white w-full space-y-20 border border-gray-200 rounded-t-lg">
        <QuestionList />
          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-gray-100 rounded-t-lg">
              <div className="py-4 shadow">
                <p className="pl-4 text-gray-900">Шинэ асуулт</p>
              </div>
            </div>
          <CreateExamHeader/>
          </div>
        </div>
      </div>
    </div>
  );
}