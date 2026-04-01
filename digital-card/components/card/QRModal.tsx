"use client";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

export default function QRModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        style={{ background: "#fff", borderRadius: 24, padding: 32, textAlign: "center", maxWidth: 300, width: "90%" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 20, color: "#111" }}>QR Kod</div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
        >
          <QRCode value={url} size={200} bgColor="#ffffff" fgColor="#111111" style={{ width: "100%", height: "auto" }} />
        </motion.div>
        <p style={{ marginTop: 12, fontSize: "0.7rem", color: "#999", wordBreak: "break-all" }}>{url}</p>
        <motion.button
          whileHover={{ background: "#333" }}
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          style={{ marginTop: 16, width: "100%", padding: "11px", background: "#111", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
        >
          Kapat
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
