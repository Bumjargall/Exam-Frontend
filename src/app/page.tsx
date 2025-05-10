"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      router.push("/teacher/create-exam");
    } else if (user.role === "student") {
      router.push("/student");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user]);

  return (
    <div>
      <div className="flex justify-center items-center h-min-screen mt-24">
        <img src="/free_exam.jpg" alt="Free Exam" className="w-[40vh]" />
      </div>
    </div>
  );
}
