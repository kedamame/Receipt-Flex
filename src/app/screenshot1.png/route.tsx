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
          padding: "84px 78px",
          background:
            "linear-gradient(180deg, #0d5cff 0%, #0d5cff 42%, #fff8ef 42%, #fff8ef 100%)",
          color: "#111111",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ color: "#fffaf2", fontSize: 132, fontWeight: 800 }}>{APP_NAME}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 34,
            padding: 48,
            borderRadius: 46,
            background: "rgba(255, 250, 242, 0.94)"
          }}
        >
          <div style={{ fontSize: 72 }}>Paste any Base tx hash.</div>
          <div style={{ fontSize: 48, opacity: 0.72 }}>Instant receipt preview. No account required.</div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}

