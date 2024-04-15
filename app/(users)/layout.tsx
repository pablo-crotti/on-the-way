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
  return (
    <div>
      <Nav />
        <div className="p-4">{children}</div>
    </div>

  );
}
