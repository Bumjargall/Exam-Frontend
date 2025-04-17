import RegisterForm from '@/components/auth/RegisterForm'
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

import React from 'react'

export default async function register() {
  const session = await getServerSession(authConfig);
  if (session) {
    redirect("/teacher");
  }
  return (
         <RegisterForm/>
   
  )
}
