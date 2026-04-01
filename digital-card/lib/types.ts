export type Platform = "whatsapp" | "linkedin" | "instagram" | "twitter" | "facebook" | "youtube" | "tiktok" | "website" | "email" | "phone";

export type SocialLink = {
  id: string;
  card_id: string;
  platform: Platform;
  url: string;
  order_index: number;
};

export type Card = {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  title: string | null;
  company: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  invoice_company: string | null;
  invoice_address: string | null;
  invoice_tax_office: string | null;
  invoice_tax_no: string | null;
  bank_name: string | null;
  bank_account_holder: string | null;
  bank_iban: string | null;
  video_url: string | null;
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
