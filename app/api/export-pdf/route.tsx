import "server-only";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs"; // important: not Edge

const isDev = process.env.NODE_ENV !== "production";

async function getBrowser() {
  if (isDev) {
    // Local dev: use full puppeteer (bundled Chrome) — no executablePath needed
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    // Prod/serverless: puppeteer-core + @sparticuz/chromium
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const base = `${url.protocol}//${url.host}`;

    const browser = await getBrowser();
    const page = await browser.newPage();

    // Go to the SSR page that renders your HTML
    await page.goto(`${base}/pdf/print`, { waitUntil: "domcontentloaded" });

    // If you use web fonts, wait for them:
    await page.evaluateHandle("document.fonts && document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      waitForFonts: true,
      margin: { top: "16mm", right: "16mm", bottom: "16mm", left: "16mm" },
    });

    await page.close();
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error generating PDF" },
      { status: 500 },
    );
  }
}
