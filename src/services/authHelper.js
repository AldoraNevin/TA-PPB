import supabase from "./supabaseClient";

export async function ensureProfileExists() {
  const { data: { user }} = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) return; // already exists

  await supabase.from("profiles").insert({
    id: user.id,
    username: user.email.split("@")[0],
    avatar_url: "/default-avatar.png"
  });
}
