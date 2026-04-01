export type SocialLink = {
  id: string;
  card_id: string;
  platform: "whatsapp" | "linkedin" | "instagram" | "twitter" | "facebook" | "youtube" | "tiktok" | "website" | "email" | "phone";
  url: string;
  order_index: number;
};

export type Card = {
  id: string;
  user_id: string;
  username: string; // URL slug: /uzeyir
  full_name: string;
  title: string; // Yönetim Kurulu Başkanı
  company: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  // Fatura bilgileri
  invoice_company: string | null;
  invoice_address: string | null;
  invoice_tax_office: string | null;
  invoice_tax_no: string | null;
  // Banka bilgileri
  bank_name: string | null;
  bank_account_holder: string | null;
  bank_iban: string | null;
  // Video
  video_url: string | null;
  // Tema
  theme_color: string;
  is_active: boolean;
  created_at: string;
  social_links?: SocialLink[];
};

export type Profile = {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
};
