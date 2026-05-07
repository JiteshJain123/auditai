import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuditAI — Free AI Spend Audit for Startups",
  description:
    "Find out where your team is overspending on AI tools. Get an instant audit with specific savings recommendations — free, no login required.",
  openGraph: {
    title: "AuditAI — Free AI Spend Audit for Startups",
    description:
      "Find out where your team is overspending on AI tools. Get an instant audit with specific savings recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditAI — Free AI Spend Audit for Startups",
    description:
      "Find out where your team is overspending on AI tools. Get an instant audit with specific savings recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
