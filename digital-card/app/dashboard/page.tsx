import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: card } = await supabase
    .from("cards")
    .select("*, social_links(*)")
    .eq("user_id", user.id)
    .single();

  return <DashboardClient initialCard={card} userId={user.id} />;
}
