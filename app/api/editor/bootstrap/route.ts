// src/app/api/editor/bootstrap/route.ts
import { NextResponse } from "next/server";
import { doc } from "./data";

export async function GET() {
  // Fetch from your DB here (server only)
  const payload = doc;
  return NextResponse.json(payload, { status: 200 });
}
