import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/app-config";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background:
            "linear-gradient(135deg, #0d5cff 0%, #42f5d7 44%, #ffd84d 100%)",
          color: "#101010",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span>BASE MINIAPP</span>
          <span>FARCASTER READY</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -6 }}>{APP_NAME}</div>
          <div style={{ maxWidth: 820, fontSize: 34 }}>{APP_TAGLINE}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderRadius: 28,
            background: "rgba(255, 250, 242, 0.72)",
            fontSize: 28
          }}
        >
          <span>Paste tx hash</span>
          <span>Save PNG</span>
          <span>Share flex</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

