"use client";

import type { Metadata, Viewport } from "next";
import { AdminNav } from "@/components/adminnav";
import { AdminHeader } from "@/components/adminheader";
import "../globals.css";
import "../globalicon.css";
import React from "react";
import { getServerSession } from "next-auth";

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
        <div>
          <AdminHeader />
        </div>

        {children}
      </div>
    </div>

    // <div classNameName="w-full min-h-screen">{children}</div>
  );
}
