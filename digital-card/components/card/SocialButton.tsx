"use client";

type Platform = "whatsapp" | "linkedin" | "instagram" | "twitter" | "facebook" | "youtube" | "tiktok" | "website" | "email" | "phone";

const PLATFORM_CONFIG: Record<Platform, { label: string; bg: string; icon: string }> = {
  whatsapp:  { label: "Whatsapp",  bg: "#25D366", icon: "💬" },
  linkedin:  { label: "Linkedin",  bg: "#0A66C2", icon: "in" },
  instagram: { label: "Instagram", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", icon: "📷" },
  twitter:   { label: "Twitter",   bg: "#1DA1F2", icon: "𝕏" },
  facebook:  { label: "Facebook",  bg: "#1877F2", icon: "f" },
  youtube:   { label: "Youtube",   bg: "#FF0000", icon: "▶" },
  tiktok:    { label: "TikTok",    bg: "#000000", icon: "♪" },
  website:   { label: "Website",   bg: "#6366f1", icon: "🌐" },
  email:     { label: "E-posta",   bg: "#ea4335", icon: "✉" },
  phone:     { label: "Telefon",   bg: "#22c55e", icon: "📞" },
};

export default function SocialButton({ platform, url }: { platform: Platform; url: string }) {
  const cfg = PLATFORM_CONFIG[platform] ?? { label: platform, bg: "#444", icon: "🔗" };

  const href = platform === "phone"
    ? `tel:${url}`
    : platform === "email"
    ? `mailto:${url}`
    : url;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-btn">
      <div
        className="social-icon"
        style={{ background: cfg.bg, color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}
      >
        {cfg.icon}
      </div>
      <span>{cfg.label}</span>
    </a>
  );
}
