import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/app-config";

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
          padding: "44px",
          background:
            "linear-gradient(145deg, #fff8ef 0%, #d5ecff 48%, #ffd84d 100%)",
          color: "#111111",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ fontSize: 28 }}>Tap into the receipt arcade</div>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -4 }}>{APP_NAME}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "18px 22px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 28,
            fontSize: 30
          }}
        >
          <span>Base tx</span>
          <span>PNG</span>
          <span>Share</span>
        </div>
      </div>
    ),
    { width: 900, height: 600 }
  );
}

