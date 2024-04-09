import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./globalicon.css";
import React from "react";
import Footer from "@/components/footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";

const APP_NAME = "WageWizard";
const APP_DEFAULT_TITLE = "WageWizard";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Work time and wage assistant.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#313131",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="fr" className="fixed touch-pan-y">
      <body className="flex flex-col" id="app">
        {session ? (
          <Providers>
            <div className="basis-[90%]">{children}</div>
            <Footer />
          </Providers>
        ) : (
          <div className="h-full w-full">{children}</div>
        )}
      </body>
    </html>
  );
}
