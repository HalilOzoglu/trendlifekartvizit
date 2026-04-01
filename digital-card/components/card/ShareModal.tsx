"use client";
import CopyButton from "./CopyButton";

export default function ShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 320, width: "90%" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8, color: "#111" }}>Link İle Paylaş</div>
        <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 14 }}>
          Kartvizitinizi link yolu ile paylaşmak için linki kopyalayabilirsiniz.
        </p>
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "10px 14px", fontSize: "0.8rem", wordBreak: "break-all", color: "#333", marginBottom: 10 }}>
          {url}
        </div>
        <CopyButton text={url} label="Link Kopyala" />
        <button onClick={onClose} style={{ marginTop: 12, width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
          Kapat
        </button>
      </div>
    </div>
  );
}
