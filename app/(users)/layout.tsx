"use client";

import type { Metadata, Viewport } from "next";

import "../globals.css";
import "../globalicon.css";
import React from "react";
import { Nav } from "@/components/nav";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession();
  return (
    <div>
      <Nav />
        <div className="p-4">{children}</div>
    </div>

    // <div classNameName="w-full min-h-screen">{children}</div>
  );
}
