"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionList from "@/components/create-exam/QuestionList";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = () => {
      console.log({
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      });
      try {
        const userJson = JSON.parse(localStorage.getItem("user") as string);
        setRole(userJson?.user.role);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (role) {
      switch (role) {
        case "teacher":
          router.push("/teacher/create-exam");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/"); // Аль ч тохирохгүй тохиолдолд үндсэн хуудас руу чиглүүлнэ
      }
    }
  }, [role, router]);

  return (
    <div>
      <div className="flex justify-center items-center h-min-screen mt-24">
        <img src="/free_exam.jpg" alt="" className="w-[40vh]" />
      </div>
    </div>
  );
}
