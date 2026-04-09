'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/shared/Toast";
import SessionWatcher from "@/components/shared/SessionWatcher";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/staker') || pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider>
            <SessionWatcher>
              {!isDashboard && <Navbar />}
              <main className={!isDashboard ? "pt-20" : ""}>
                <div className="blob blob-violet" />
                <div className="blob blob-indigo" />
                <div className="blob blob-fuchsia" />
                {children}
              </main>
              {!isDashboard && <Footer />}
            </SessionWatcher>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
