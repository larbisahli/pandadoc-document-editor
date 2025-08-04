import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document Editor",
  description: "Customize your documents faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className="relative box-border h-screen w-full">
          <div className="flex h-full w-full flex-col">
            <Header />
            <main className="relative h-full w-full flex-1">{children}</main>
          </div>
        </body>
      </html>
    </StoreProvider>
  );
}
