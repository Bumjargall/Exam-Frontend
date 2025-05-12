"use client";

import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import NavbarStudent from "./NavbarStudent";

const navItemsMap: Record<string, { label: string; href: string }[]> = {
  teacher: [
    { label: "Шалгалт үүсгэх", href: "/teacher/create-exam" },
    { label: "Шалгалтууд", href: "/teacher/exams" },
    { label: "Хянах", href: "/teacher/monitoring" },
  ],
  student: [],
  admin: [
    { label: "Шалгалтууд", href: "/admin/exams" },
    { label: "Админ самбар", href: "/admin/dashboard" },
  ],
};

const guestNavItems = [{ label: "Нэвтрэх", href: "/login" }];

export default function NavbarExam() {
  const { user, logout } = useAuth();
  const role = user?.role.toLowerCase() || null;
  const router = useRouter();

  const logoutUser = async () => {
    await logout();
    router.push("/");
  };

  const navItems = role ? navItemsMap[role] || [] : guestNavItems;

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
          {role === "student" && <NavbarStudent />}
          {role && (
            <>
              <button
                onClick={logoutUser}
                className="text-gray-600 hover:border p-2 rounded-lg border-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
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
                {role && (
                  <Link
                    href={`/${role}/profile`}
                    className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span>Профайл</span>
                  </Link>
                )}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-black text-base font-medium border-b pb-2"
                  >
                    {item.label}
                  </Link>
                ))}
                {role && (
                  <button
                    onClick={logoutUser}
                    className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Гарах</span>
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
