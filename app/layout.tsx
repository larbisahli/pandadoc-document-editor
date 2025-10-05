import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import Head from "next/head";
import { Inter } from "next/font/google";
import { RootState } from "@/lib/store";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

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

async function getBootstrapFromAPI() {
  const res = await fetch(process.env.URL_BASE + "/api/editor/bootstrap", {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Bootstrap failed");
  return res.json() as Promise<RootState>;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preloaded = await getBootstrapFromAPI();
  return (
    <StoreProvider preloadedState={preloaded}>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <html
        lang="en"
        className={clsx(
          inter.className,
          geistMono.variable,
          geistSans.variable,
        )}
      >
        <body className="relative box-border h-screen w-full">{children}</body>
      </html>
    </StoreProvider>
  );
}
