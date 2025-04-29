"use client";

import { useEffect, useState } from "react";

const NAVBAR_CONTENT = {
  teacher: <div>Teacher Navbar Content</div>,
  student: <div>Student Navbar Content</div>,
  admin: <div>Admin Navbar Content</div>,
  public: <div>Public Navbar Content</div>,
};

export default function NavbarExam() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      setRole("public");
      setLoading(false);
      return;
    }

    try {
      const userJson = JSON.parse(userString);
      setRole(userJson?.user?.role || "public");
    } catch (err) {
      console.error("Хэрэглэгчийн мэдээллийг уншихад алдаа гарлаа:", err);
      setRole("public");
    } finally {
      setLoading(false);
    }
  }, []);

  // ⏳ LocalStorage-оос мэдээлэл авч байх үед
  if (loading) return null;

  // Role-д тохирох Navbar агуулгыг харуулах
  return <nav>{NAVBAR_CONTENT[role as keyof typeof NAVBAR_CONTENT]}</nav>;
}