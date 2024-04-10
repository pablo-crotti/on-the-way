import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./globalicon.css";
import React from "react";
import Footer from "@/components/footer";
// import { Providers } from "./providers";
import { getServerSession } from "next-auth";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="fr">
      <body className="w-full h-full dark:bg-gray-900">
        <div className="w-full min-h-screen">{children}</div>
            
      </body>
    </html>
  );
}
