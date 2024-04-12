"use client";

import type { Metadata, Viewport } from "next";
import "../globals.css";
import "../globalicon.css";
import React from "react";
import { getServerSession } from "next-auth";
import { AdminNav } from "@/components/adminnav";
import { AdminHeader } from "@/components/adminheader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession();
  return (
    <div>
      <AdminNav />
      <div className="p-4 sm:ml-64">
        <AdminHeader />
        {children}</div>
    </div>
  );
}
