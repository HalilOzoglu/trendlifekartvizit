"use client";
import { motion } from "framer-motion";
import CopyButton from "./CopyButton";

export default function ShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        style={{ background: "#fff", borderRadius: 24, padding: 28, maxWidth: 320, width: "90%" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8, color: "#111" }}>Link İle Paylaş</div>
        <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 14 }}>
          Kartvizitinizi link yolu ile paylaşmak için linki kopyalayabilirsiniz.
        </p>
        <div style={{ background: "#f5f5f5", borderRadius: 10, padding: "10px 14px", fontSize: "0.8rem", wordBreak: "break-all", color: "#333", marginBottom: 10 }}>
          {url}
        </div>
        <CopyButton text={url} label="Link Kopyala" />
        <motion.button
          whileHover={{ background: "#333" }}
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          style={{ marginTop: 12, width: "100%", padding: "11px", background: "#111", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
        >
          Kapat
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
