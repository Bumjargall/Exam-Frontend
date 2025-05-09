"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { StudentExam } from "@/lib/types/interface";
import { getExams } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getExamByKey } from "@/lib/api";
import { set } from "mongoose";
import { createResult } from "@/lib/api";
import { checkedResultByExamUser } from "@/lib/api";
import { channel } from "diagnostics_channel";
export default function NavbarStudent() {
  const router = useRouter();
  const [exams, setExams] = useState<StudentExam>();
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(user?._id);
    if (!user) {
      router.push("/login");
    }
  }, []);
  const handleSearch = async () => {
    if (!inputValue.trim()) {
      toast.error("Exam key хоосон байна.");
      return;
    }

    try {
      const response = await getExamByKey(inputValue.trim());
      if (!response) {
        toast.error("Ийм түлхүүртэй шалгалт олдсонгүй.");
        return;
      }
      const data = response.data;
      if (!data._id || !userId) {
        return;
      }
      const status = await checkedResultByExamUser(data._id, userId);
      console.log("checked", status);
      if (status === "submitted") {
        toast.error("Хэрэглэгч энэ шалгалтыг өгсөн байна...");
      } else if (status === "taking") {
        router.push(`/student/exam/${response.data._id}`);
      } else {
        const examResult = {
          status: "taking",
          userId,
          examId: data._id,
          score: 0,
          pending: "off",
        };
        const createResultUser = await createResult(examResult);
        console.log("data", createResultUser.data._id);
        router.push(
          `/student/exam/${response.data._id}-${createResultUser.data._id}`
        );
      }
    } catch (error) {
      toast.error("Шалгалтын мэдээлэл авч чадсангүй.");
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            placeholder="Exam Key"
            className="block p-2.5 w-full text-gray-900 bg-white border border-gray-900 rounded-lg placeholder:text-gray-900"
          />
          <Button
            onClick={handleSearch}
            type="button"
            className="absolute top-0 end-0 p-2.5 h-full font-medium text-black bg-white border border-gray-900 rounded-e-lg cursor-pointer hover:bg-gray-100"
          >
            <MoveRight />
          </Button>
        </div>
      </nav>
    </>
  );
}
