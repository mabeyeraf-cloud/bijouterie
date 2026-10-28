import { ImageResponse } from "next/og";

export const alt = "Groupe SAGFA — Cabinet de gestion à Dakar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#0F4D4A", color: "#F7F5EE" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#8faa99" }}>CABINET DE GESTION · DAKAR</div>
        <div style={{ display: "flex", fontSize: 112, fontWeight: 800, marginTop: 24 }}>GROUPE SAGFA</div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 28, color: "#d8c5a5" }}>Comptabilité · Fiscalité · Paie · IPM · Informatique</div>
      </div>
    ),
    size
  );
}
