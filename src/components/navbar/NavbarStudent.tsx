"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu,LogOut } from "lucide-react";

export default function NavbarStudent() {
  return (
    <header className="w-full shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          Онлайн шалгалтын систем
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href={""}
            className="text-gray-700 hover:text-black text-sm border border-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5"/>
          </Link>
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
                  <Link href={""}
                    className="text-gray-600 hover:text-black text-base font-medium border-b pb-2 flex items-center space-x-2"
                  >
                    <LogOut className="h-5 w-5"/>
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
