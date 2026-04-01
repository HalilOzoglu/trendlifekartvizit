"use client";
import { useCallback } from "react";
import type { Platform, SocialLink } from "@/lib/types";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "whatsapp",  label: "WhatsApp" },
  { value: "linkedin",  label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter",   label: "Twitter / X" },
  { value: "facebook",  label: "Facebook" },
  { value: "youtube",   label: "YouTube" },
  { value: "tiktok",    label: "TikTok" },
  { value: "website",   label: "Website" },
  { value: "email",     label: "E-posta" },
  { value: "phone",     label: "Telefon" },
];

const PLACEHOLDERS: Record<Platform, string> = {
  whatsapp:  "+90 555 000 0000",
  linkedin:  "https://linkedin.com/in/kullanici",
  instagram: "https://instagram.com/kullanici",
  twitter:   "https://twitter.com/kullanici",
  facebook:  "https://facebook.com/kullanici",
  youtube:   "https://youtube.com/@kanal",
  tiktok:    "https://tiktok.com/@kullanici",
  website:   "https://website.com",
  email:     "ornek@email.com",
  phone:     "+90 555 000 0000",
};

// Yeni link için benzersiz geçici ID
let tempId = 0;
function newTempId() { return `temp_${++tempId}`; }

export type SocialLinkDraft = Partial<SocialLink> & { _tempId: string };

interface Props {
  links: SocialLinkDraft[];
  onChange: (links: SocialLinkDraft[]) => void;
}

export default function SocialLinksEditor({ links, onChange }: Props) {
  const add = useCallback(() => {
    onChange([...links, { _tempId: newTempId(), platform: "whatsapp", url: "" }]);
  }, [links, onChange]);

  const remove = useCallback((tempId: string) => {
    onChange(links.filter(l => l._tempId !== tempId));
  }, [links, onChange]);

  const update = useCallback((tempId: string, key: "platform" | "url", val: string) => {
    onChange(links.map(l => l._tempId === tempId ? { ...l, [key]: val } : l));
  }, [links, onChange]);

  return (
    <div>
      {links.map(link => (
        <div key={link._tempId} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
          <select
            value={link.platform ?? "whatsapp"}
            onChange={e => update(link._tempId, "platform", e.target.value)}
            className="form-input"
            style={{ width: 150, flexShrink: 0 }}
          >
            {PLATFORMS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <input
            className="form-input"
            value={link.url ?? ""}
            onChange={e => update(link._tempId, "url", e.target.value)}
            placeholder={PLACEHOLDERS[link.platform as Platform] ?? "URL"}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => remove(link._tempId)}
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "8px 12px", cursor: "pointer", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 16px", cursor: "pointer", width: "100%", fontSize: "0.85rem" }}
      >
        + Link Ekle
      </button>
    </div>
  );
}
