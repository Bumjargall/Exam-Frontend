"use client"
import React, {useEffect, useState} from "react";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import { ExamsData } from "@/data/ExamsData";
import { StudentsExamScore } from "@/data/StudetsExamScore";
import { UserData } from "@/data/UserData";
import { SelectExamComponent } from "@/Components/SelectExamComponent";
import { set } from "react-hook-form";

const studentScoreData = StudentsExamScore
const userData = UserData
const examData = ExamsData

export default function Page() {
    const [isExamTitleVisible, setExamTitleVisible] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDropdownStatus, setIsDropdownStatus] = useState(false)
    
    const [lastExam, setLastExam] = useState(
        examData.length >0 
        ? examData.slice(-1)[0] 
        : {id:"",title: "Шалгалтын гарчиг...", key:"0",status:"active"}
    )
    const key = lastExam.key
    const [isStatus, setIsStatus] = useState(false)
    //дарах үед солигдох функц
    const toggleTitleDropdown =()=> {
        setExamTitleVisible(!isExamTitleVisible)
    }
    const toggleDropdown =()=> {
        setIsDropdownOpen(!isDropdownOpen)
    }
    const toggleStatusDropdown =()=> {
        setIsDropdownStatus(!isDropdownStatus)
    }
    const toggleStatus = ()=> {
        setIsStatus(!isStatus)
    }
    //гарчигийг хаах функц
    const closeMenu =()=> {
        setExamTitleVisible(false)
        setIsDropdownOpen(false)
        setIsStatus(false)
    }
    //шалгалтын гарчиг дээр дарах үед гарчигийг харуулах функц
    const clickExam = (exam: {id: number; title: string}) => {
        setLastExam(exam);
        closeMenu();
    }



    return (
      <div className="max-w-7xl mx-auto">
        <div className=" flex justify-between h-24">
            {/*Monitoring Left banner -> Exam title, student names*/}
            <div className="left_container w-1/5 px-2">
                <div onClick={toggleTitleDropdown} className="last_exam flex border-b-2 bg-sky-200 px-2 relative cursor-pointer" id="menu-button" aria-expanded={isExamTitleVisible} aria-haspopup="true">
                    <p className="text-[20px]">{lastExam.title}</p>
                    <i className="ri-arrow-down-s-fill absolute right-2 text-2xl"></i>
                </div>
                {/*Гарчиг*/}
                {isExamTitleVisible && <SelectExamComponent exams={examData} onMouseLeave={closeMenu} onClickExam={clickExam}/>}
                
                {/*Student-ээс нэрээр нь хайх*/}
                <div className="searchStudent flex justify-between items-center pt-6 ">
                    <input type="text" placeholder="Хайх нэр..." className="w-full border-2 border-gray-100 border-r-0 rounded-l-lg p-2"/>
                    <i className="ri-search-line border-2 border-gray-100 border-l-0 rounded-r-lg py-2 pr-2"></i>
                </div>
                {/*Student-ээс нэрээр нь дэлгэцэнд харуулах*/}
                <div className="pt-4">

                    {/*Starting*/}
                    <div className="starting">
                        <p className="font-medium w-full border-b-1">Starting</p>
                        <ul>
                            {studentScoreData.filter((s) => s?.status == "taking").map((s) => (
                                <li key={s?.studentId} className="flex justify-between items-center pl-2 cursor-pointer">
                                    <p>{s?.studentId}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="submitted">
                        <p className="font-medium w-full border-b-1">Submitted</p>
                        <ul>
                            {studentScoreData.filter((s) => s?.status === "submitted").map((s) => (
                                <li key={s?.studentId} className="flex justify-between items-center pl-2 cursor-pointer">
                                    <p>{s?.studentId}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/*Main*/}
            <div className="w-3/5 mx-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="monitoring_header flex justify-between items-center text-gray-500 font-bold focus:outline-none">
                    <div className="flex justify-center py-2 w-1/2 border-b-2 border-sky-400 bg-white text-sky-400 rounded-t-2xl cursor-pointer">
                        <button className="">Хянах</button>
                    </div>
                    <div className="flex justify-center py-2 w-1/2 border-b-2 border-l-2 border-gray-200 cursor-pointer">
                        <button>Хариу</button>
                    </div>
                    
                </div>

                <div className="container my-4 mx-2">
                    <p className=" text-[18px] mb-4">{lastExam.title}</p>
                    <div className="flex justify-around">
                            <div className="left w-1/2">
                                <div className="flex justify-between pr-6 py-2">
                                    <p className="mr-4">Exam key</p>
                                    <button className="px-2 border-2  rounded-2xl cursor-pointer relative hover:text-yellow-500"
                                    onClick={toggleDropdown} id="key"
                                    >{key} <i className="ri-arrow-down-s-fill"></i></button>
                                    {isDropdownOpen && (
                                        <div className="absolute mt-6 bg-white border-1 border-slate-500 m-6 rounded-2xl z-10" onMouseLeave={closeMenu}>
                                            <ul className="">
                                                <li className="px-1 py-1 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                                onClick={()=> {
                                                    navigator.clipboard.writeText(key)
                                                    closeMenu()
                                                }}
                                                ><i className="ri-file-copy-line mr-2"></i>Түлхүүр хуулах</li>
                                                <li className="px-1 py-1 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                                onClick={()=> {
                                                    navigator.clipboard.writeText(`https://exam.com/${key}`)
                                                    closeMenu()
                                                }}
                                                ><i className="ri-link mr-2"></i>Шалгалтын линк хуулах</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between pr-6 py-2">
                                    <p className="mr-4">Төлөв</p>
                                    <button className="px-2 border-2  rounded-2xl cursor-pointer relative hover:text-yellow-500"
                                    onClick={toggleStatus}
                                    > {isStatus=="active" ? (
                                        <>
                                        <i className="ri-circle-fill text-[12px] text-lime-500"></i> Нээлттэй
                                        </>
                                    ): (
                                        <>
                                        <i className="ri-close-circle-fill text-[12px] text-red-500"></i> Хаалттай
                                        </>
                                    ) }
                                        <i className="ri-arrow-down-s-fill"></i></button>
                                    {isStatus && (
                                        <div className="absolute left-2/6 mt-[28px] bg-white border-1 border-slate-500 m-6 rounded-2xl z-10" onMouseLeave={closeMenu}>
                                            <ul className="">
                                                <li className="px-1 py-1 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                                onClick={()=> {
                                                    navigator.clipboard.readText().then((text) => {
                                                    setIsStatus(text)
                                                    closeMenu()
                                                    })
                                                    .catch((err) => {
                                                        console.log("Status алдаа : "+ err)
                                                    })
                                                }}
                                                ><i className="ri-circle-fill text-[12px] text-lime-500"></i> Нээлттэй</li>
                                                <li className="px-1 py-1 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                                onClick={()=> {
                                                    navigator.clipboard.readText()
                                                    .then((text) => {setIsStatus(text)
                                                    closeMenu()
                                                    })
                                                    .catch((err) => {
                                                        console.log("Status алдаа : "+ err)
                                                    })
                                                }}
                                                ><i className="ri-circle-fill text-[12px] text-red-500"></i> Хаалттай</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="share_link flex justify-between pr-6 py-2 align-center">
                                    <p className="mr-4">Илгээх</p>
                                    <i className="ri-share-fill px-1 border-2  rounded-full cursor-pointer relative hover:text-yellow-500"
                                    onClick={()=> {
                                        alert("Илгээх мэйлээ оруулна уу?")
                                    }}
                                    ></i>
                                </div>
                                <div className="score">
                                    <p className="text-xl font-medium pb-4">Үнэлгээ</p>
                                    <div className="flex justify-space"> 
                                        <div className="ongoing flex flex-col items-center w-1/3 border-b-2 border-sky-400 mr-4 pb-2 bg-gray-100">
                                            <p className="number"><b className="text-xl">0</b>/1</p>
                                            <p>Оролцсон</p>
                                        </div>
                                        <div className="submitted flex flex-col items-center w-1/3 border-b-2 border-lime-400 pb-2 bg-gray-100">
                                            <p className="number"><b className="text-xl">1</b>/1</p>
                                            <p>Дууссан</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right w-1/2 flex flex-col items-center">
                                <button className="flex items-center justify-center w-4/5 wx-auto bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2 duration-[.3s]"><i className="ri-expand-right-line text-[14px] mr-2"></i> Шалгалтаас хасах</button>
                                <button className="flex items-center justify-center w-4/5 wx-auto bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2  duration-[.3s]"><i className="ri-eye-line text-[14px] mr-2"></i>Материал харах</button>
                                <button className="flex items-center justify-center w-4/5 wx-auto bg-slate-200 rounded-full my-2 py-1 hover:bg-white hover:border-2  duration-[.3s]"><i className="ri-printer-line text-[14px] mr-2"></i>Хэвлэх<i className="ri-arrow-down-s-fill"></i></button>
                            </div>
                    </div>
                </div>
                
            </div>
            {/*Right*/}
            <div className="right_container  w-1/5 bg-black text-white px-2 ">
                3
            </div>
        </div>
      </div>
    );
}