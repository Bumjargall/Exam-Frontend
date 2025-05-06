import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import NavbarExam from "@/components/navbar/NavbarExam";

export const metadata: Metadata = {
  title: "Examly",
  description: "Exam Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />


        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css"
        />
      </head>
      <body>
        <div>
          <Navbar />
          <main className="">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
