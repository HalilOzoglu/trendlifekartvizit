"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Card } from "@/lib/types";
import SocialLinksEditor, { type SocialLinkDraft } from "@/components/dashboard/SocialLinksEditor";

interface Props {
  initialCard: Card | null;
  userId: string;
}

// DB'den gelen linkleri draft formatına çevir
function toDrafts(links: Card["social_links"]): SocialLinkDraft[] {
  return (links ?? []).map(l => ({ ...l, _tempId: l.id }));
}

export default function DashboardClient({ initialCard, userId }: Props) {
  const router = useRouter();
  const [card, setCard] = useState<Partial<Card>>(initialCard ?? {});
  const [socialLinks, setSocialLinks] = useState<SocialLinkDraft[]>(toDrafts(initialCard?.social_links));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Sayfa refresh sonrası initialCard değişirse state'i güncelle
  useEffect(() => {
    setCard(initialCard ?? {});
    setSocialLinks(toDrafts(initialCard?.social_links));
  }, [initialCard?.id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    if (!card.username?.trim()) { showToast("URL adı zorunludur"); return; }
    if (!card.full_name?.trim()) { showToast("Ad Soyad zorunludur"); return; }

    // Boş URL'li linkleri filtrele
    const validLinks = socialLinks.filter(l => l.url?.trim() && l.platform);

    setSaving(true);
    const supabase = createClient();

    const cardData = {
      user_id: userId,
      username: card.username.trim().toLowerCase().replace(/\s+/g, "-"),
      full_name: card.full_name,
      title: card.title ?? null,
      company: card.company ?? null,
      bio: card.bio ?? null,
      phone: card.phone ?? null,
      email: card.email ?? null,
      website: card.website ?? null,
      avatar_url: card.avatar_url ?? null,
      cover_url: card.cover_url ?? null,
      invoice_company: card.invoice_company ?? null,
      invoice_address: card.invoice_address ?? null,
      invoice_tax_office: card.invoice_tax_office ?? null,
      invoice_tax_no: card.invoice_tax_no ?? null,
      bank_name: card.bank_name ?? null,
      bank_account_holder: card.bank_account_holder ?? null,
      bank_iban: card.bank_iban ?? null,
      video_url: card.video_url ?? null,
      theme_color: card.theme_color ?? "#1a1a2e",
    };

    let cardId = initialCard?.id;

    try {
      if (cardId) {
        const { error } = await supabase.from("cards").update(cardData).eq("id", cardId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("cards").insert(cardData).select().single();
        if (error) throw error;
        cardId = data?.id;
      }

      if (cardId) {
        await supabase.from("social_links").delete().eq("card_id", cardId);
        if (validLinks.length > 0) {
          const { error } = await supabase.from("social_links").insert(
            validLinks.map((l, i) => ({
              card_id: cardId,
              platform: l.platform,
              url: l.url!.trim(),
              order_index: i,
            }))
          );
          if (error) throw error;
        }
      }
      showToast("Kaydedildi ✓");
      router.refresh();
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("unique") || msg.includes("duplicate")) {
        showToast("Bu URL adı zaten kullanılıyor");
      } else {
        showToast(`Hata: ${msg || "Bilinmeyen hata"}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const f = (key: keyof Card) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCard(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", padding: "24px 16px", color: "#fff" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Kartvizitim</h1>
            {card.username && (
              <a href={`/${card.username}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#e94560" }}>
                /{card.username} →
              </a>
            )}
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem" }}>
            Çıkış
          </button>
        </div>

        <Section title="Kişisel Bilgiler">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="URL Adı" value={card.username ?? ""} onChange={f("username")} placeholder="uzeyir" />
            <Field label="Ad Soyad" value={card.full_name ?? ""} onChange={f("full_name")} placeholder="Üzeyir Çalışır" />
            <Field label="Unvan" value={card.title ?? ""} onChange={f("title")} placeholder="Yönetim Kurulu Başkanı" />
            <Field label="Şirket" value={card.company ?? ""} onChange={f("company")} placeholder="Designsoft" />
            <Field label="Telefon" value={card.phone ?? ""} onChange={f("phone")} placeholder="+90 555 000 0000" />
            <Field label="E-posta" value={card.email ?? ""} onChange={f("email")} placeholder="ornek@email.com" />
            <Field label="Website" value={card.website ?? ""} onChange={f("website")} placeholder="https://..." />
          </div>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Biyografi</label>
            <textarea className="form-input" value={card.bio ?? ""} onChange={f("bio")} rows={3} placeholder="Kısa bir tanıtım..." style={{ resize: "vertical" }} />
          </div>
          <Field label="Logo / Kapak Görseli URL" value={card.cover_url ?? ""} onChange={f("cover_url")} placeholder="https://..." />
          <Field label="Profil Fotoğrafı URL" value={card.avatar_url ?? ""} onChange={f("avatar_url")} placeholder="https://..." />
        </Section>

        <Section title="Sosyal Medya Linkleri">
          <SocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
        </Section>

        <Section title="Fatura Bilgileri">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Firma Adı" value={card.invoice_company ?? ""} onChange={f("invoice_company")} />
            <Field label="Vergi Dairesi" value={card.invoice_tax_office ?? ""} onChange={f("invoice_tax_office")} />
            <Field label="Vergi No" value={card.invoice_tax_no ?? ""} onChange={f("invoice_tax_no")} />
          </div>
          <Field label="Firma Adresi" value={card.invoice_address ?? ""} onChange={f("invoice_address")} />
        </Section>

        <Section title="Banka Bilgileri">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Banka Adı" value={card.bank_name ?? ""} onChange={f("bank_name")} placeholder="Akbank" />
            <Field label="Hesap Sahibi" value={card.bank_account_holder ?? ""} onChange={f("bank_account_holder")} />
          </div>
          <Field label="IBAN" value={card.bank_iban ?? ""} onChange={f("bank_iban")} placeholder="TR..." />
        </Section>

        <Section title="Video">
          <Field label="YouTube Video URL" value={card.video_url ?? ""} onChange={f("video_url")} placeholder="https://youtube.com/watch?v=..." />
        </Section>

        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "14px", fontSize: "1rem", marginTop: 8 }}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", padding: 20, marginBottom: 16 }}>
      <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</h2>
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
