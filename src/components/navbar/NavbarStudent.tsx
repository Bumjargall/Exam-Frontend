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
    setUserId(user?.user?._id);
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
      const checked = await checkedResultByExamUser(data._id, userId);
      console.log("checked", checked);
      if (checked === true) {
        toast.error("Хэрэглэгч энэ шалгалтыг өгсөн байна...");
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
    <header className="w-full shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          <img src="/logo.jpg" alt="logo" className="w-12 rounded-xl" />
        </Link>

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
          <Link
            href=""
            className="text-gray-700 hover:text-black text-sm border border-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 m-6">
                <Button
                  onClick={() => {
                    localStorage.clear();
                    router.push("/");
                  }}
                  className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Гарах</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
