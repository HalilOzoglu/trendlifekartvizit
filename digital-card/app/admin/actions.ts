"use server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Service role client - sadece server'da kullanılır
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function createUser(email: string, password: string, role: "admin" | "user") {
  const supabase = createAdminClient();

  // Auth'da kullanıcı oluştur
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return { error: error.message };

  // Profiles tablosuna role ile ekle (trigger zaten ekler ama role'ü güncelle)
  await supabase
    .from("profiles")
    .update({ role })
    .eq("id", data.user.id);

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}
