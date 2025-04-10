import React from 'react'
import CreateExamHeader from '@/components/create-exam/CreateExamHeader'
import Texteditor from "@/components/rich-text/TextEditor"
import SaveQuestion from '@/components/ui/savequestion'
import AnswerOption from '@/components/create-exam/AnswerOption'
import MarkingRules from '@/components/create-exam/MarkingRules'
export default function MultipleChoice(handleSelect:any) {
  return (
    <div className="mt-20">
      <div className="max-w-4xl mx-auto flex">
        <div className="bg-white w-full space-y-20 border border-gray-200 rounded-lg">
          <CreateExamHeader />
          <div className="max-w-2xl mx-auto mb-20 shadow">
            <div className="bg-gray-100">
              <div className="py-4 shadow">
                <p className="pl-4 text-gray-900">Олон сонголт</p>
              </div>
            </div>
            <div className='p-5 space-y-3'>
            <Texteditor/>
            <AnswerOption/>
            <MarkingRules/>
            </div>
            <SaveQuestion text = "Хадгалах"/>
          </div>
        </div>
      </div>
    </div>
  )
}