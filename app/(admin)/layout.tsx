
import "../globals.css";
import "../globalicon.css";
import React from "react";
import { AdminNav } from "@/components/adminnav";
import { AdminHeader } from "@/components/adminheader";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'On The Way - Podcasts | Admin',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="w-full h-full dark:bg-darkbg-900">
        <div>
          <AdminNav />
          <div className="p-4 sm:ml-64">
            <AdminHeader />
            {children}</div>
        </div>
      </body>
    </html>
  );
}
