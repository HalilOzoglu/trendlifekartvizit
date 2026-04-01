"use client";
import QRCode from "react-qr-code";

export default function QRModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, textAlign: "center", maxWidth: 300, width: "90%" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 20, color: "#111" }}>QR Kod</div>
        <QRCode value={url} size={200} bgColor="#ffffff" fgColor="#111111" />
        <p style={{ marginTop: 12, fontSize: "0.7rem", color: "#999", wordBreak: "break-all" }}>{url}</p>
        <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
          Kapat
        </button>
      </div>
    </div>
  );
}
