import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Examly",
  description: "Exam Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

// 👇 client-only wrapper-г import хийж байна (зөвхөн ашигласан хэсэг)
import ClientLayout from "@/app/client-layout";
