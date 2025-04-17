"use client"
import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
 function login() {
 
  return (
    <div>
        <LoginForm/>
    </div>
  )
}

export default login