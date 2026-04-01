"use client";
import { useState } from "react";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
        borderRadius: 8, border: "1px solid #ddd",
        background: copied ? "#e8f5e9" : "#f5f5f5",
        color: copied ? "#2e7d32" : "#333",
        fontSize: "0.85rem", cursor: "pointer", marginTop: 10, transition: "all 0.2s"
      }}
    >
      {copied ? "✓ Kopyalandı" : `📋 ${label}`}
    </button>
  );
}
