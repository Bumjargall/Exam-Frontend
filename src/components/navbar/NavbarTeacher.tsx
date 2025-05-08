"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
const navItems = [
  { label: "Шалгалт үүсгэх", href: "/teacher/create-exam" },
  { label: "Шалгалтууд", href: "/teacher/exams" },
  { label: "Шалгалтын мэдээлэл", href: "/teacher/monitoring" },
];

export default function NavbarTeacher() {
  const router = useRouter();

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };
  return (
    <header className="w-full shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          <img src="/logo.jpg" alt="logo" className="w-12 rounded-xl" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-black text-sm font-medium border border-gray-900 p-2 px-4 rounded-lg hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={"/teacher/profile"}
            className="text-gray-600 hover:border p-2 rounded-lg border-gray-900"
          >
            <User className="h-5 w-5" />
          </Link>
          <Button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Гарах</span>
          </Button>
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
                <Link
                  className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                  href={""}
                >
                  <User className="h-5 w-5" />
                  <span>Хэрэглэгчийн мэдээлэл</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-black text-base font-medium border-b pb-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                  href={""}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Гарах</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
