"use client";
import NavbarPublic from "@/components/navbar/NavbarPublic";
import NavbarAdmin from "@/components/navbar/NavbarAdmin";
import NavbarStudent from "@/components/navbar/NavbarStudent";
import NavbarTeacher from "@/components/navbar/NavbarTeacher";
import { useEffect, useState } from "react";

interface userType {}
export default function Navbar() {
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const userJson = JSON.parse(localStorage.getItem("user") as string);
    setUser(userJson?.user.email);
    setRole(userJson?.user.role);
  }, [user]);

  if (!user) return <NavbarPublic />;
  if (role == "teacher") return <NavbarTeacher />;
  if (role == "student") return <NavbarStudent />;
  return <div>Logged Nav Bar</div>;
}
