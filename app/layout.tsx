import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/navigation/MobileNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "A secure and private travel planner for two.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground flex">
        <DesktopSidebar />
        <div className="flex-1 flex flex-col md:ml-64 pb-16 md:pb-0">
          <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
            {children}
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
