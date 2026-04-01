"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/lib/types";
import QRModal from "./QRModal";
import ShareModal from "./ShareModal";
import CopyButton from "./CopyButton";

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

const FIXED_BUTTONS = [
  { key: "qr",       label: "QR Kod",       bg: "#e53935", icon: <QRIcon /> },
  { key: "contact",  label: "Rehbere Ekle", bg: "#fb8c00", icon: <ContactIcon /> },
  { key: "phone",    label: "Telefon",      bg: "#43a047", icon: <PhoneIcon /> },
  { key: "website",  label: "Website",      bg: "#00897b", icon: <WebIcon /> },
  { key: "location", label: "Konum",        bg: "#f9a825", icon: <LocationIcon /> },
  { key: "share",    label: "Paylaş",       bg: "#e53935", icon: <ShareIcon /> },
];

const SOCIAL_COLORS: Record<string, string> = {
  whatsapp: "#25D366", linkedin: "#0A66C2", instagram: "#E1306C",
  twitter: "#1DA1F2", facebook: "#1877F2", youtube: "#FF0000",
  tiktok: "#010101", email: "#ea4335", phone: "#43a047", website: "#00897b",
};
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <WhatsappIcon />, linkedin: <LinkedinIcon />, instagram: <InstagramIcon />,
  twitter: <TwitterIcon />, facebook: <FacebookIcon />, youtube: <YoutubeIcon />,
  tiktok: <TiktokIcon />, email: <EmailIcon />, phone: <PhoneIcon />, website: <WebIcon />,
};
const SOCIAL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp", linkedin: "LinkedIn", instagram: "Instagram",
  twitter: "Twitter", facebook: "Facebook", youtube: "YouTube",
  tiktok: "TikTok", email: "E-posta", phone: "Telefon", website: "Website",
};

/* Animasyon varyantları */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.06, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } }),
};

interface Props { card: Card; baseUrl: string; }

export default function CardView({ card, baseUrl }: Props) {
  const cardUrl = `${baseUrl}/${card.username}`;
  const [loaded, setLoaded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [socialPage, setSocialPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const socialLinks = (card.social_links ?? []).sort((a, b) => a.order_index - b.order_index);
  const socialPerPage = 3;
  const totalSocialPages = Math.ceil(socialLinks.length / socialPerPage);
  const visibleSocial = socialLinks.slice(socialPage * socialPerPage, (socialPage + 1) * socialPerPage);

  const invoiceText = [
    card.invoice_company,
    card.invoice_address,
    [card.invoice_tax_office, card.invoice_tax_no].filter(Boolean).join(" / "),
  ].filter(Boolean).join("\n");

  const handleFixedBtn = (key: string) => {
    if (key === "qr") setShowQR(true);
    else if (key === "share") setShowShare(true);
    else if (key === "phone" && card.phone) window.open(`tel:${card.phone}`);
    else if (key === "website" && card.website) window.open(card.website, "_blank");
    else if (key === "contact") downloadVCard(card);
    else if (key === "location" && card.website) window.open(card.website, "_blank");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflowX: "hidden" }}>

      {/* Yükleme ekranı */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #f0f0f0", borderTopColor: "#e53935" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "0.85rem", color: "#aaa", letterSpacing: 1 }}
            >
              Yükleniyor...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arka plan dekoratif daireler */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #e53935, transparent)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", bottom: 100, left: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, #1877F2, transparent)" }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo / Şirket Adı */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: "#fff", padding: "28px 24px 16px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}
        >
          {card.cover_url ? (
            <Image src={card.cover_url} alt={card.company ?? "logo"} width={280} height={80} style={{ objectFit: "contain", maxHeight: 80 }} />
          ) : (
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#111", letterSpacing: "-1px", textTransform: "lowercase" }}>
              {card.company ?? card.full_name}
            </div>
          )}
        </motion.div>

        {/* Video */}
        {card.video_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ margin: "0 16px", borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", background: "#000", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            <iframe
              src={getYoutubeEmbedUrl(card.video_url)}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        )}

        {/* İsim + Unvan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", padding: "20px 24px 8px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111" }}>{card.full_name}</span>
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={loaded ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
          {card.title && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              style={{ fontSize: "0.95rem", color: "#555", marginTop: 4 }}
            >
              {card.title}
            </motion.div>
          )}
        </motion.div>

        {/* Sabit 6 buton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 20px" }}>
          {FIXED_BUTTONS.map((btn, i) => (
            <motion.button
              key={btn.key}
              custom={i}
              variants={scaleIn}
              initial="hidden"
              animate={loaded ? "visible" : "hidden"}
              whileHover={{ scale: 1.07, boxShadow: `0 8px 24px ${btn.bg}55` }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleFixedBtn(btn.key)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 8px", borderRadius: 18, background: btn.bg, border: "none", cursor: "pointer", color: "#fff" }}
            >
              <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {btn.icon}
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{btn.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Sosyal medya butonları */}
        {socialLinks.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", padding: "0 8px 16px", gap: 4 }}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setSocialPage(p => Math.max(0, p - 1))}
              disabled={socialPage === 0}
              style={{ background: "none", border: "none", cursor: socialPage === 0 ? "default" : "pointer", color: socialPage === 0 ? "#ccc" : "#333", fontSize: "1.4rem", padding: "0 4px", flexShrink: 0 }}
            >‹</motion.button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, flex: 1 }}>
              <AnimatePresence mode="wait">
                {visibleSocial.map((link, i) => (
                  <motion.a
                    key={`${link.id}-${socialPage}`}
                    custom={i}
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                    whileHover={{ scale: 1.07, boxShadow: `0 8px 24px ${SOCIAL_COLORS[link.platform] ?? "#555"}55` }}
                    whileTap={{ scale: 0.93 }}
                    href={link.platform === "phone" ? `tel:${link.url}` : link.platform === "email" ? `mailto:${link.url}` : link.url}
                    target={link.platform !== "phone" && link.platform !== "email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 8px", borderRadius: 18, background: SOCIAL_COLORS[link.platform] ?? "#555", textDecoration: "none", color: "#fff" }}
                  >
                    <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {SOCIAL_ICONS[link.platform] ?? <DefaultIcon />}
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                      {SOCIAL_LABELS[link.platform] ?? link.platform}
                    </span>
                  </motion.a>
                ))}
                {visibleSocial.length < 3 && Array.from({ length: 3 - visibleSocial.length }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setSocialPage(p => Math.min(totalSocialPages - 1, p + 1))}
              disabled={socialPage >= totalSocialPages - 1}
              style={{ background: "none", border: "none", cursor: socialPage >= totalSocialPages - 1 ? "default" : "pointer", color: socialPage >= totalSocialPages - 1 ? "#ccc" : "#333", fontSize: "1.4rem", padding: "0 4px", flexShrink: 0 }}
            >›</motion.button>
          </div>
        )}

        {/* Alt bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #eee", display: "flex", alignItems: "center", zIndex: 10 }}
        >
          <motion.button
            whileHover={{ background: "#333" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowInvoice(true)}
            style={{ flex: 1, padding: "14px 8px", background: "#222", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "background 0.2s" }}
          >
            Fatura Bilgileri
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            style={{ padding: "14px 16px", background: "#c0392b", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
          >
            🇹🇷
          </motion.button>
          <motion.button
            whileHover={{ background: "#333" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowBank(true)}
            style={{ flex: 1, padding: "14px 8px", background: "#222", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "background 0.2s" }}
          >
            Banka Bilgileri
          </motion.button>
        </motion.div>
      </div>

      {/* Modaller */}
      <AnimatePresence>
        {showQR && <QRModal url={cardUrl} onClose={() => setShowQR(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showShare && <ShareModal url={cardUrl} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showInvoice && (
          <BottomSheet title="Fatura Bilgileri" onClose={() => setShowInvoice(false)}>
            <div style={{ fontSize: "0.9rem", lineHeight: 2, color: "#333" }}>
              {card.invoice_company && <div style={{ fontWeight: 700, fontSize: "1rem" }}>{card.invoice_company}</div>}
              {card.invoice_address && <div>{card.invoice_address}</div>}
              {(card.invoice_tax_office || card.invoice_tax_no) && (
                <div>{[card.invoice_tax_office, card.invoice_tax_no].filter(Boolean).join(" / ")}</div>
              )}
            </div>
            {invoiceText && <CopyButton text={invoiceText} label="Bilgileri Kopyala" />}
          </BottomSheet>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBank && (
          <BottomSheet title="Banka Bilgileri" onClose={() => setShowBank(false)}>
            <div style={{ fontSize: "0.9rem", lineHeight: 2, color: "#333" }}>
              {card.bank_name && <div style={{ fontWeight: 700, fontSize: "1rem" }}>{card.bank_name}</div>}
              {card.bank_account_holder && <div>{card.bank_account_holder}</div>}
              {card.bank_iban && <div style={{ fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>{card.bank_iban}</div>}
            </div>
            {card.bank_iban && <CopyButton text={card.bank_iban} label="İban Kopyala" />}
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Animasyonlu Bottom Sheet */
function BottomSheet({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{ position: "relative", background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", maxWidth: 480, width: "100%", margin: "0 auto" }}
      >
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, background: "#e0e0e0", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111" }}>{title}</span>
          <motion.button whileTap={{ scale: 0.85 }} onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#666" }}>✕</motion.button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* vCard */
function downloadVCard(card: Card) {
  const vcard = ["BEGIN:VCARD", "VERSION:3.0", `FN:${card.full_name}`,
    card.title ? `TITLE:${card.title}` : "", card.company ? `ORG:${card.company}` : "",
    card.phone ? `TEL:${card.phone}` : "", card.email ? `EMAIL:${card.email}` : "",
    card.website ? `URL:${card.website}` : "", "END:VCARD"].filter(Boolean).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
  a.download = `${card.full_name}.vcf`;
  a.click();
}

/* QR ve Share modal'larını da animasyonlu yapalım */

/* SVG İkonlar */
function QRIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>;
}
function ContactIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function PhoneIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function WebIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function LocationIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function ShareIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
function WhatsappIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
}
function LinkedinIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
}
function InstagramIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}
function TwitterIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}
function FacebookIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
}
function YoutubeIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0000"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;
}
function TiktokIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>;
}
function EmailIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function DefaultIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
}
