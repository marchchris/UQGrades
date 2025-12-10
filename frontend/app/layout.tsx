import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

import { ModeToggle } from "@/components/modetoggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UQ Grades",
  description: "Final grade calculator for UQ courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dot-grid`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex items-center justify-center">
              {children}
            </main>
            <footer className="p-4 flex flex-col items-center justify-center">
              <a className="text-xs font-bold" href="/">
                UQ Grades
              </a>
              <p className="text-xs">
                <a href="https://chrismarchand.dev/">Chris Marchand</a> |{" "}
                <a href="https://github.com/marchchris/UQGrades">Github</a>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
