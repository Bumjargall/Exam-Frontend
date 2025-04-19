"use client";

import { useEffect, useState } from "react";
import NavbarPublic from "@/components/navbar/NavbarPublic";
import NavbarAdmin from "@/components/navbar/NavbarAdmin";
import NavbarStudent from "@/components/navbar/NavbarStudent";
import NavbarTeacher from "@/components/navbar/NavbarTeacher";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const userJson = JSON.parse(userString);
      setRole(userJson?.user?.role || null);
    } catch (err) {
      console.error("Хэрэглэгчийн мэдээллийг уншихад алдаа гарлаа:", err);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⏳ LocalStorage-оос мэдээлэл авч байх үед
  if (loading) return null;
  // 👥 Хэрэглэгч байхгүй үед Public Navbar
  if (!role) return <NavbarPublic />;
  if (role == "teacher") return <NavbarTeacher />;
  if (role == "student") return <NavbarStudent />;
  if (role == "admin") return <NavbarAdmin />;
  return <NavbarPublic />;
}
