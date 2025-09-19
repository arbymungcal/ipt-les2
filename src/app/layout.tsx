// src/app/layout.tsx
import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "MangaHub",
  description: "Read and share manga online",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

        <body className="relative min-h-screen dark bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white font-sans antialiased">
          {/* Decorative background glow */}
          <div className="absolute top-[-10rem] left-1/2 w-[80%] h-[20rem] bg-emerald-500/20 blur-[10rem] -translate-x-1/2 pointer-events-none" />

          <TopNav />

          {/* Main Content */}
          <main className="relative z-10 pt-20 px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>

          {/* Toast Notifications */}
          <Toaster />

          {/* Subtle bottom glow */}
          <div className="absolute bottom-[-6rem] left-1/2 w-[70%] h-[12rem] bg-emerald-400/10 blur-[6rem] -translate-x-1/2 pointer-events-none" />
        </body>
      </html>
    </ClerkProvider>
  );
}
