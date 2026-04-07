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
          background: "#0d5cff",
          color: "#fffaf2",
          fontFamily: "sans-serif",
          fontSize: 72,
          fontWeight: 700
        }}
      >
        RX
      </div>
    ),
    { width: 200, height: 200 }
  );
}

