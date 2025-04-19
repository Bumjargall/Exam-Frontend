"use client";
import { useEffect, useState } from "react";
import { fetchHelloMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import QuestionList from "@/components/create-exam/QuestionList";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = () => {
      console.log({NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL});
      try {
        const userJson = JSON.parse(localStorage.getItem("user") as string);
        setRole(userJson?.user.role);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  if (role === "teacher") router.push("/teacher/create-exam");
  else if (role === "student") router.push("/student")
  else (<div></div>)

  return <div></div>;
}
