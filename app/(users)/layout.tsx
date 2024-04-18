"use client";

import "../globals.css";
import "../globalicon.css";
import React from "react";
import { Nav } from "@/components/nav";
import { Analytics } from "@vercel/analytics/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="w-full h-full dark:bg-darkbg-900">
        <div>
          <Nav />
          <div className="p-4">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
