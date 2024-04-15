"use client";

import "../globals.css";
import "../globalicon.css";
import React from "react";
import { Nav } from "@/components/nav";
import { GoogleAnalytics } from '@next/third-parties/google'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GA_ID || "";
  return (
    <html lang="fr">
      <body className="w-full h-full dark:bg-darkbg-900">
        <div>
          <Nav />
          <div className="p-4">{children}</div>
        </div>
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}
