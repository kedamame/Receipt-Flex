import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          padding: "84px 78px",
          background:
            "linear-gradient(170deg, #ffd84d 0%, #ff8c42 34%, #fff8ef 34%, #fff8ef 100%)",
          color: "#111111",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: 58,
            borderRadius: 46,
            background: "rgba(255, 250, 242, 0.94)"
          }}
        >
          <div style={{ fontSize: 54 }}>Save PNG or share a deep link.</div>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -3 }}>Zero backend needed.</div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}

