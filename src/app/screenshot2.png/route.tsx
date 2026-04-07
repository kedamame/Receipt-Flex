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
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(150deg, #111111 0%, #243c9c 44%, #3ae7ff 100%)",
          color: "#fffaf2",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            width: 980,
            display: "flex",
            flexDirection: "column",
            gap: 36,
            padding: 58,
            borderRadius: 48,
            border: "4px solid rgba(255,250,242,0.28)",
            background: "rgba(17,17,17,0.32)"
          }}
        >
          <div style={{ fontSize: 58, opacity: 0.72 }}>Theme switcher</div>
          <div style={{ fontSize: 120, fontWeight: 800 }}>Receipt cards built to post.</div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 }
  );
}

