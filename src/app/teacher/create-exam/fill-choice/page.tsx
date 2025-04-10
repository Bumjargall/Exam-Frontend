import React from 'react'
import CreateExamHeader from '@/components/create-exam/CreateExamHeader'
import Texteditor from "@/components/rich-text/TextEditor"
import SaveQuestion from '@/components/ui/savequestion'
import AnswerOption from '@/components/create-exam/AnswerOption'
import MarkingRules from '@/components/create-exam/MarkingRules'
import Link from 'next/link'
import SimpleAnswerOption from '@/components/create-exam/SimpleAnswerOption'
export default function FillChoice() {
  return (
    <div className="mt-20">
      <div className="max-w-4xl mx-auto flex">
        <div className="bg-white w-full space-y-20 border border-gray-200 rounded-lg">
          <CreateExamHeader />
          <div className="max-w-2xl mx-auto mb-20 shadow">
            <div className="bg-gray-100">
              <div className="py-4 shadow">
                <p className="pl-4 text-gray-900">Multiple Choice</p>
              </div>
            </div>
            <div className='p-5 space-y-3'>
                <Texteditor/>
                <div className="flex text-center text-gray-900 items-start">
                    <Link href="" className="py-1 border border-gray-900 px-4 rounded-2xl hover:bg-gray-100">Gap</Link>
                </div>
                <SimpleAnswerOption/>
                <MarkingRules/>
            </div>
            <SaveQuestion text = "Хадгалах"/>
          </div>
        </div>
      </div>
    </div>
  )
}