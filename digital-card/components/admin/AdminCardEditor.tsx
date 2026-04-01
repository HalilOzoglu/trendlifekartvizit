"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Card, Profile, SocialLink } from "@/lib/types";
import SocialLinksEditor from "@/components/dashboard/SocialLinksEditor";

interface Props {
  card: Card | null;
  users: Profile[];
  onClose: () => void;
}

export default function AdminCardEditor({ card, users, onClose }: Props) {
  const [data, setData] = useState<Partial<Card>>(card ?? {});
  const [socialLinks, setSocialLinks] = useState<Partial<SocialLink>[]>(card?.social_links ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const f = (key: keyof Card) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!data.user_id) { setError("Kullanıcı seçimi zorunludur"); return; }
    if (!data.username?.trim()) { setError("URL adı zorunludur"); return; }
    if (!data.full_name?.trim()) { setError("Ad Soyad zorunludur"); return; }
    setError("");
    setSaving(true);
    const supabase = createClient();

    const cardData = {
      user_id: data.user_id,
      username: data.username,
      full_name: data.full_name,
      title: data.title ?? null,
      company: data.company ?? null,
      bio: data.bio ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      avatar_url: data.avatar_url ?? null,
      cover_url: data.cover_url ?? null,
      invoice_company: data.invoice_company ?? null,
      invoice_address: data.invoice_address ?? null,
      invoice_tax_office: data.invoice_tax_office ?? null,
      invoice_tax_no: data.invoice_tax_no ?? null,
      bank_name: data.bank_name ?? null,
      bank_account_holder: data.bank_account_holder ?? null,
      bank_iban: data.bank_iban ?? null,
      video_url: data.video_url ?? null,
      theme_color: data.theme_color ?? "#1a1a2e",
      is_active: data.is_active ?? true,
    };

    let cardId = card?.id;

    try {
      if (cardId) {
        const { error } = await supabase.from("cards").update(cardData).eq("id", cardId);
        if (error) throw error;
      } else {
        const { data: newCard, error } = await supabase.from("cards").insert(cardData).select().single();
        if (error) throw error;
        cardId = newCard?.id;
      }

      if (cardId) {
        await supabase.from("social_links").delete().eq("card_id", cardId);
        if (socialLinks.length > 0) {
          const { error } = await supabase.from("social_links").insert(
            socialLinks.map((l, i) => ({ card_id: cardId, platform: l.platform, url: l.url, order_index: i }))
          );
          if (error) throw error;
        }
      }
      onClose();
    } catch (err: any) {
      setError(err?.message?.includes("unique") ? "Bu URL adı zaten kullanılıyor" : `Hata: ${err?.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", padding: "24px 16px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{card ? "Kartvizit Düzenle" : "Yeni Kartvizit"}</h1>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
            ← Geri
          </button>
        </div>

        <Section title="Kullanıcı & Temel Bilgiler">
          <div className="form-group">
            <label className="form-label">Kullanıcı</label>
            <select className="form-input" value={data.user_id ?? ""} onChange={f("user_id")}>
              <option value="">Kullanıcı seçin</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="URL Adı" value={data.username ?? ""} onChange={f("username")} placeholder="uzeyir" />
            <Field label="Ad Soyad" value={data.full_name ?? ""} onChange={f("full_name")} />
            <Field label="Unvan" value={data.title ?? ""} onChange={f("title")} />
            <Field label="Şirket" value={data.company ?? ""} onChange={f("company")} />
            <Field label="Telefon" value={data.phone ?? ""} onChange={f("phone")} />
            <Field label="E-posta" value={data.email ?? ""} onChange={f("email")} />
          </div>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Biyografi</label>
            <textarea className="form-input" value={data.bio ?? ""} onChange={f("bio")} rows={3} style={{ resize: "vertical" }} />
          </div>
          <Field label="Profil Fotoğrafı URL" value={data.avatar_url ?? ""} onChange={f("avatar_url")} />
          <Field label="Kapak Fotoğrafı URL" value={data.cover_url ?? ""} onChange={f("cover_url")} />
          <div className="form-group">
            <label className="form-label">Durum</label>
            <select className="form-input" value={data.is_active ? "true" : "false"} onChange={e => setData(p => ({ ...p, is_active: e.target.value === "true" }))}>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>
        </Section>

        <Section title="Sosyal Medya">
          <SocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
        </Section>

        <Section title="Fatura Bilgileri">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Firma Adı" value={data.invoice_company ?? ""} onChange={f("invoice_company")} />
            <Field label="Vergi Dairesi" value={data.invoice_tax_office ?? ""} onChange={f("invoice_tax_office")} />
            <Field label="Vergi No" value={data.invoice_tax_no ?? ""} onChange={f("invoice_tax_no")} />
          </div>
          <Field label="Adres" value={data.invoice_address ?? ""} onChange={f("invoice_address")} />
        </Section>

        <Section title="Banka Bilgileri">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Banka" value={data.bank_name ?? ""} onChange={f("bank_name")} />
            <Field label="Hesap Sahibi" value={data.bank_account_holder ?? ""} onChange={f("bank_account_holder")} />
          </div>
          <Field label="IBAN" value={data.bank_iban ?? ""} onChange={f("bank_iban")} />
        </Section>

        <Section title="Video">
          <Field label="YouTube URL" value={data.video_url ?? ""} onChange={f("video_url")} />
        </Section>

        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: "100%", padding: 14, fontSize: "1rem" }}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {error && <p style={{ color: "#e94560", fontSize: "0.85rem", marginTop: 12, textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", padding: 20, marginBottom: 16 }}>
      <h2 style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
