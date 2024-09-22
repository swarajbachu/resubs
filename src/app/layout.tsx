import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/layout/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resubs",
  description:
    "Resubs is a subscription management tool that helps you track your subscriptions and save money.",
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <QueryProvider>
        <body className={inter.className}>
          <Toaster richColors />
          {children}
        </body>
      </QueryProvider>
    </html>
  );
}
