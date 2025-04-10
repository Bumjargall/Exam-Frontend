"use client";
import { useState } from "react";
import CreateExam from "@/components/create-exam/CreateExam";
import MultipleChoice from "@/components/ExamComponents/MultipleChoice";
import FillChoice from "@/components/ExamComponents/FillChoice";
import FreeText from "@/components/ExamComponents/FreeText";
import SimpleChoice from "@/components/ExamComponents/Simple-Choice";
import InformationBlock from "@/components/ExamComponents/Information-block";
export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const handleSelectType = (type: string) => {
    console.log("hehe")
    setSelectedType(type)
  }

  return(
    <div>
       {!selectedType &&(
      <CreateExam handleSelect={handleSelectType} />
    )}
    {selectedType === "multiple-choice" && <MultipleChoice handleSelect={handleSelectType}/>}
    {selectedType === "simple-choice" && <SimpleChoice/>}
    {selectedType === "fill-choice" && <FillChoice/>}
    {selectedType === "free-text" && <FreeText/>}
    {selectedType === "information-block" && <InformationBlock/>}
    </div>
    
   
        
  )
}