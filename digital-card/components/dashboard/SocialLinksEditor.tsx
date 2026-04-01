"use client";
import type { SocialLink } from "@/lib/types";

const PLATFORMS = ["whatsapp", "linkedin", "instagram", "twitter", "facebook", "youtube", "tiktok", "website", "email", "phone"] as const;

interface Props {
  links: Partial<SocialLink>[];
  onChange: (links: Partial<SocialLink>[]) => void;
}

export default function SocialLinksEditor({ links, onChange }: Props) {
  const add = () => onChange([...links, { platform: "whatsapp", url: "" }]);
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof SocialLink, val: string) =>
    onChange(links.map((l, idx) => idx === i ? { ...l, [key]: val } : l));

  return (
    <div>
      {links.map((link, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
          <select
            value={link.platform ?? "whatsapp"}
            onChange={e => update(i, "platform", e.target.value)}
            className="form-input"
            style={{ width: 140, flexShrink: 0 }}
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input
            className="form-input"
            value={link.url ?? ""}
            onChange={e => update(i, "url", e.target.value)}
            placeholder="URL veya numara"
            style={{ flex: 1 }}
          />
          <button
            onClick={() => remove(i)}
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "8px 12px", cursor: "pointer", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 16px", cursor: "pointer", width: "100%", fontSize: "0.85rem" }}
      >
        + Link Ekle
      </button>
    </div>
  );
}
