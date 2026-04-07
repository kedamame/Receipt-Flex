import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from "@/lib/app-config";

export function GET(request: NextRequest) {
  const tx = request.nextUrl.searchParams.get("tx")?.trim();
  const url = new URL("https://warpcast.com/~/compose");
  const lines = [
    "Receipt Flex on Base",
    tx ? `tx: ${tx}` : "Turn Base tx hashes into poster-bright receipt cards.",
    APP_URL
  ];

  url.searchParams.set("text", lines.join("\n"));

  return NextResponse.redirect(url);
}
