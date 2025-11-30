import supabase from "./supabaseClient";
import { getGuestId } from "./guestId";

export async function saveBuild(name, placed) {
  const guest_id = getGuestId();

  const payload = {
    guest_id,
    name,
    data: placed,
  };

  const { error } = await supabase.from("builder_saves").insert(payload);

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    return false;
  }

  return true;
}
