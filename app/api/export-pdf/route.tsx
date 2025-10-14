import "server-only";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs"; // important: not Edge
export const dynamic = "force-dynamic";
// export const maxDuration = 60;

const isDev = process.env.NODE_ENV !== "production";

export async function getBrowser() {
  if (isDev) {
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    const puppeteer = await import("puppeteer-core");
    // Optional: pin a known-good revision for puppeteer-core
    // (make versions of puppeteer-core and @sparticuz/chromium compatible)
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
    await page.goto(`${base}/pdf/print`, { waitUntil: "domcontentloaded" }); // or 'domcontentloaded' then extra waits

    // If you use web fonts, wait for them:
    await page.evaluateHandle("document.fonts && document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      waitForFonts: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
      footerTemplate: `
    <div style="font-size:8pt;width:100%;text-align:center;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>`,
      displayHeaderFooter: true,
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
