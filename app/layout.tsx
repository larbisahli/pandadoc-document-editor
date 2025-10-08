import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import Head from "next/head";
import { Inter } from "next/font/google";
import { RootState } from "@/lib/store";
import clsx from "clsx";
import { NodeKind, Templates } from "@/interfaces/enum";
import { EMPTY_DOC } from "@/lib/features/instance/instanceSlice";

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

const url =
  process.env.NODE_ENV === "production"
    ? "https://pandadoc-document-editor.vercel.app"
    : "http://localhost:3000";

async function getBootstrapFromAPI() {
  const res = await fetch(url + "/api/editor/bootstrap", {
    cache: "force-cache",
  });
  if (!res.ok)
    return {
      document: {
        id: "doc_aabwbtdbgk5c",
        title: "Simple invoice",
        pageIds: ["page_n261uo3yzqhq"],
      },
      layout: {
        pages: {
          ["page_n261uo3yzqhq"]: {
            rootId: "root_ts7vv3b74iuk",
            byId: {
              root_ts7vv3b74iuk: {
                id: "root_ts7vv3b74iuk",
                parentId: null,
                kind: NodeKind.Container,
                direction: "column",
                children: ["node_qm5dtiyiavdu"],
                layoutStyle: {},
              },
              node_qm5dtiyiavdu: {
                id: "node_qm5dtiyiavdu",
                kind: NodeKind.BlockRef,
                parentId: "root_ts7vv3b74iuk",
                instanceId: "inst_z0w6lgm234iq",
                layoutStyle: {},
              },
            },
            overlayIds: [],
          },
        },
        visiblePageId: "page_n261uo3yzqhq",
      },
      instances: {
        byId: {
          inst_z0w6lgm234iq: {
            id: "inst_z0w6lgm234iq",
            templateId: Templates.Text,
            data: {
              content: EMPTY_DOC,
            },
          },
        },
      },
    };
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
