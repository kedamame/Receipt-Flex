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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(140deg, #0d5cff 0%, #3ae7ff 48%, #ffd84d 100%)",
          color: "#101010",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            width: 820,
            height: 820,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 128,
            border: "12px solid rgba(16,16,16,0.12)",
            background: "rgba(255,255,255,0.26)",
            transform: "rotate(-8deg)"
          }}
        >
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -4 }}>{APP_NAME}</div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}

