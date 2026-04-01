"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Card, Profile } from "@/lib/types";
import AdminCardEditor from "@/components/admin/AdminCardEditor";
import { createUser, deleteUser, updateUserRole } from "./actions";

interface Props {
  cards: (Card & { profiles?: { email: string } })[];
  users: Profile[];
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }
    setLoading(true);
    setError("");
    const result = await createUser(email, password, role);
    if (result.error) { setError(result.error); setLoading(false); return; }
    router.refresh();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <h3 style={{ marginBottom: 20, fontSize: "1.1rem", fontWeight: 700 }}>Yeni Kullanıcı</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="En az 6 karakter" />
          </div>
          <div className="form-group">
            <label className="form-label">Rol</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value as any)}>
              <option value="user">Kullanıcı</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p style={{ color: "#e94560", fontSize: "0.8rem", marginBottom: 12 }}>{error}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 10, cursor: "pointer" }}>
              İptal
            </button>
            <button className="btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminClient({ cards, users }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"cards" | "users">("cards");
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Bu kartviziti silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    await supabase.from("cards").delete().eq("id", id);
    router.refresh();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("cards").update({ is_active: !current }).eq("id", id);
    router.refresh();
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`"${email}" kullanıcısını silmek istediğinize emin misiniz?`)) return;
    const result = await deleteUser(id);
    if (result.error) alert(result.error);
    else router.refresh();
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Rolü "${newRole}" olarak değiştirmek istediğinize emin misiniz?`)) return;
    await updateUserRole(id, newRole as any);
    router.refresh();
  };

  if (editingCard || creatingNew) {
    return (
      <AdminCardEditor
        card={editingCard}
        users={users}
        onClose={() => { setEditingCard(null); setCreatingNew(false); router.refresh(); }}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff" }}>
      {showCreateUser && <CreateUserModal onClose={() => setShowCreateUser(false)} />}

      <div className="admin-layout">
        <aside className="sidebar">
          <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>Admin Panel</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Dijital Kartvizit</div>
          </div>
          {[
            { key: "cards", label: "Kartvizitler", icon: "🪪" },
            { key: "users", label: "Kullanıcılar", icon: "👥" },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as any)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "12px 20px", background: tab === item.key ? "rgba(233,69,96,0.15)" : "transparent",
                border: "none", color: tab === item.key ? "#e94560" : "rgba(255,255,255,0.6)",
                cursor: "pointer", fontSize: "0.9rem", borderLeft: tab === item.key ? "3px solid #e94560" : "3px solid transparent",
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={{ position: "absolute", bottom: 24, left: 0, width: 240, padding: "0 20px" }}>
            <button onClick={handleLogout} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>
              Çıkış Yap
            </button>
          </div>
        </aside>

        <main className="main-content">
          {tab === "cards" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Kartvizitler ({cards.length})</h1>
                <button className="btn-primary" onClick={() => setCreatingNew(true)}>+ Yeni Kartvizit</button>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {cards.length === 0 && (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>Henüz kartvizit yok</div>
                )}
                {cards.map(card => (
                  <div key={card.id} style={{ background: "#1a1a2e", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{card.full_name}</div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{card.title} · {card.company}</div>
                      <div style={{ fontSize: "0.75rem", color: "#e94560", marginTop: 2 }}>/{card.username}</div>
                      {card.profiles?.email && (
                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{card.profiles.email}</div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleToggleActive(card.id, card.is_active)}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: "0.75rem", background: card.is_active ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: card.is_active ? "#22c55e" : "#ef4444" }}
                      >
                        {card.is_active ? "Aktif" : "Pasif"}
                      </button>
                      <button onClick={() => setEditingCard(card)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: "0.75rem" }}>
                        Düzenle
                      </button>
                      <a href={`/${card.username}`} target="_blank" style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textDecoration: "none" }}>
                        Görüntüle
                      </a>
                      <button onClick={() => handleDeleteCard(card.id)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", fontSize: "0.75rem" }}>
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "users" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Kullanıcılar ({users.length})</h1>
                <button className="btn-primary" onClick={() => setShowCreateUser(true)}>+ Yeni Kullanıcı</button>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {users.length === 0 && (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>Henüz kullanıcı yok</div>
                )}
                {users.map(user => (
                  <div key={user.id} style={{ background: "#1a1a2e", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.email}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                        {new Date(user.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", cursor: "pointer", border: "none", background: user.role === "admin" ? "rgba(233,69,96,0.2)" : "rgba(99,102,241,0.2)", color: user.role === "admin" ? "#e94560" : "#818cf8" }}
                      >
                        {user.role}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        style={{ padding: "4px 12px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
