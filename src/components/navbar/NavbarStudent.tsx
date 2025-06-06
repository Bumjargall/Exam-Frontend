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
import { useAuth } from "@/store/useAuth";
export default function NavbarStudent() {
  const router = useRouter();
  const [exams, setExams] = useState<StudentExam>();
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const initialize = () => {
      if (!user) return;
      const id = user._id;
      if (id) {
        setUserId(id);
      } else {
        console.warn("Хэрэглэгчийн ID олдсонгүй");
      }
    };
    try {
      initialize();
    } catch (err) {
      console.error(
        "💥 localStorage-с хэрэглэгчийн мэдээлэл авахад алдаа:",
        err
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      toast.error("Шалгалтын түлхүүр хоосон байна.");
      return;
    }

    try {
      const response = await getExamByKey(inputValue.trim());
      if (!response || !response.data) {
        toast.error("Ийм түлхүүртэй шалгалт олдсонгүй.");
        return;
      }

      const data = response.data;

      if (!data._id || !user?._id) {
        toast.error("Шалгалт эсвэл хэрэглэгчийн мэдээлэл дутуу байна.");
        return;
      }

      if (data.status === "inactive") {
        toast.warning("Энэ шалгалт хаагдсан байна.");
        return;
      }

      const now = new Date();
      const examStartTime = new Date(data.dateTime);
      if (examStartTime > now) {
        toast.warning("Шалгалт хараахан эхлээгүй байна.");
        return;
      }

      const status = await checkedResultByExamUser(data._id, user._id);

      if (status === "submitted") {
        toast.error("Та энэ шалгалтыг өмнө нь өгсөн байна.");
      } else if (status === "taking") {
        router.push(`/student/exam/${data._id}`);
      } else {
        const examResult = {
          status: "taking",
          userId: user._id,
          examId: data._id,
          score: 0,
          pending: "off",
        };
        const createResultUser = await createResult(examResult);
        localStorage.setItem("ResultId", createResultUser.data._id);
        setInputValue("");
        router.push(`/student/exam/${data._id}-${createResultUser.data._id}`);
      }
    } catch (error) {
      toast.error("Шалгалтын мэдээлэл авч чадсангүй.");
      console.error(error);
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
            placeholder="Шалгалтын түлхүүр"
            className="block w-full py-2.5 pr-12 pl-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
          <Button
            onClick={handleSearch}
            type="button"
            className="absolute top-0 right-0 h-full px-4 rounded-r-full bg-green-500 hover:bg-green-700 text-white border border-green-500 transition cursor-pointer"
          >
            <MoveRight size={18} />
          </Button>
        </div>
      </nav>
    </>
  );
}
