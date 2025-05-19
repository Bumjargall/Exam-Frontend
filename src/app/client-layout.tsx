"use client";

import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </div>
  );
}
