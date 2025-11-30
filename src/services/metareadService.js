import supabase from "./supabaseClient";

export async function postTierlistToMetaRead(title, data, guest_id, link) {
  const payload = {
    guest_id,
    type: "tierlist",
    title,
    data,
    link,
    thumbnail: null,
  };

  const { error } = await supabase
    .from("metaread_posts")
    .insert(payload);

  if (error) {
    console.error("POST TO METAREAD ERROR:", error);
    return false;
  }

  return true;
}

export async function postBuilderToMetaRead(title, data, guest_id, link) {
  const payload = {
    guest_id,
    type: "builder",
    title,
    data,
    link,
    thumbnail: null,
  };

  const { error } = await supabase
    .from("metaread_posts")
    .insert(payload);

  if (error) {
    console.error("POST TO METAREAD ERROR:", error);
    return false;
  }

  return true;
}
