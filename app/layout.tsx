import "./globals.css";
import "./globalicon.css";
import React from "react";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="w-full h-full dark:bg-darkbg-900">
        <div className="w-full min-h-screen">{children}</div>
      </body>
    </html>
  );
}
