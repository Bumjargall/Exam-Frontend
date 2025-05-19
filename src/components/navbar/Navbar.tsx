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
  admin: [{ label: "Шалгалтууд", href: "/admin/exams" }],
};

const guestNavItems = [{ label: "Нэвтрэх", href: "/login" }];

export default function NavbarExam() {
  const { user, logout } = useAuth();
  const role = user?.role.toLowerCase() || null;
  const router = useRouter();

  const logoutUser = async () => {
    await logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("exam-storage");
    localStorage.clear();
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
            <div key={item.href}>
              {item.href === "/teacher/create-exam" ? (
                <Link href={item.href} legacyBehavior>
                  <a className="text-white text-sm font-medium border border-white p-2 px-4 rounded-lg hover:bg-green-600 bg-green-500">
                    {item.label}
                  </a>
                </Link>
              ) : (
                <Link href={item.href} legacyBehavior>
                  <a className="text-white text-sm font-medium border border-white p-2 px-4 rounded-lg hover:bg-green-600 bg-green-500">
                    {item.label}
                  </a>
                </Link>
              )}
            </div>
          ))}
          {role === "student" && <NavbarStudent />}
          {role && (
            <>
              <button
                onClick={logoutUser}
                className="text-white bg-green-500 hover:border p-2 rounded-lg border-white-900 cursor-pointer"
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
            <SheetContent
              side="left"
              className="w-64 bg-green-500 text-white px-6 py-6"
            >
              <nav className="flex flex-col space-y-4">
                {role && (
                  <Link
                    href={`/${role}/profile`}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium tracking-wide">
                      Профайл
                    </span>
                  </Link>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition text-sm font-medium tracking-wide"
                  >
                    {item.label}
                  </Link>
                ))}

                {role && (
                  <button
                    onClick={logoutUser}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 transition text-sm font-medium tracking-wide"
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
