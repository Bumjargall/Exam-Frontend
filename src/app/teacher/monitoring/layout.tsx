import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.js" 
        strategy="lazyOnload"
      />
       

      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}