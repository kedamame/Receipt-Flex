import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Receipt Flex webhook placeholder. Notifications are not configured in this MVP."
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Receipt Flex webhook endpoint is reachable."
  });
}

