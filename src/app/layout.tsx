import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodFlow (ফুডফ্লো) — খাঁটি ও পুষ্টিকর খাবারের বিশ্বস্ত অনলাইন শপ",
  description: "ঘি, সরিষার তেল, সুন্দরবনের মধু, ড্রাই ফ্রুটস ও মসলা। সারাদেশে দ্রুত হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
