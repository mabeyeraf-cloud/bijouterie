import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Bijouterie et joaillerie à Dakar`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "90px", background: "#0F0D0B", color: "#F5EFE4" }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, color: "#C9A15E" }}>BIJOUTERIE · JOAILLERIE · DAKAR</div>
        <div style={{ display: "flex", fontSize: 120, marginTop: 28, letterSpacing: 8 }}>{site.name.toUpperCase()}</div>
        <div style={{ display: "flex", width: 120, height: 2, background: "#C9A15E", marginTop: 36 }} />
        <div style={{ display: "flex", fontSize: 38, marginTop: 36, color: "#A89E92" }}>Bagues · Colliers · Alliances · Créations sur mesure</div>
      </div>
    ),
    size
  );
}
