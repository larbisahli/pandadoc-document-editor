// Anywhere in your app (server action or client fetch)
export async function exportPdf() {
  const resp = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Agreement v1",
      content: `
          <p>Hello <strong>world</strong> 👋</p>
          <ul><li>Bullet 1</li><li>Bullet 2</li></ul>
          <img src="https://picsum.photos/seed/doc/800/200" />
        `,
      // Optional: add per-request CSS
      inlineCss: `.prose p { font-size: 12pt }`,
      // Optional puppeteer PDF options
      pdfOptions: {
        margin: { top: "16mm", bottom: "16mm", left: "12mm", right: "12mm" },
      },
    }),
  });

  if (!resp.ok) throw new Error("Export failed");
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "agreement.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
