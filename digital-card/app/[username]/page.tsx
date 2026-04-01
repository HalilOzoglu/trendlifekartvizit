import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import CardView from "@/components/card/CardView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cards")
    .select("full_name, title, company")
    .eq("username", username)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Kartvizit bulunamadı" };

  return {
    title: `${data.full_name} | ${data.title ?? ""}`,
    description: `${data.full_name} - ${data.company ?? ""}`,
  };
}

export default async function CardPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("cards")
    .select("*, social_links(*)")
    .eq("username", username)
    .eq("is_active", true)
    .single();

  if (!card) notFound();

  // SSR'da doğru base URL'i al
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;

  return <CardView card={card} baseUrl={baseUrl} />;
}
