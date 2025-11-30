// src/services/profileService.js
import supabase from "./supabaseClient";
import { getUserIdentifier } from "./guestId";

// Ambil atau buat profile
export async function getProfile() {
  const id = getUserIdentifier();

  // Coba ambil profil
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Jika sudah ada, langsung return
  if (data) return data;

  // Jika tidak ada → buat baru
  const newProfile = {
    id,
    username: "Pengguna",
    avatar_url: null,
  };

  const { data: inserted } = await supabase
    .from("profiles")
    .insert(newProfile)
    .select()
    .single();

  return inserted;
}

// Update profile
export async function updateProfile({ username, avatar_url }) {
  const id = getUserIdentifier();

  // Coba update
  let { data, error } = await supabase
    .from("profiles")
    .update({ username, avatar_url })
    .eq("id", id)
    .select()
    .single();

  // Jika row tidak ada → insert baru
  if (error) {
    console.warn("Update failed, creating new profile...");
    const insertRes = await supabase
      .from("profiles")
      .insert({ id, username, avatar_url })
      .select()
      .single();
    return insertRes.data;
  }

  return data;
}
