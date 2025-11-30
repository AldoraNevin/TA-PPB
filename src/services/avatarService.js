import supabase from "./supabaseClient";

export async function uploadAvatar(file) {
  console.log("Uploading file:", file);

  const ext = file.name.split(".").pop();
  const fileName = `avatar_${Date.now()}.${ext}`;
  const filePath = `avatars/${fileName}`;

  const { data, error } = await supabase.storage
    .from("profile_assets")
    .upload(filePath, file, { upsert: true });

  console.log("UPLOAD RESULT:", data, error);

  if (error) {
    alert("Upload failed: " + error.message);
    return null;
  }

  const { data: url } = supabase.storage
    .from("profile_assets")
    .getPublicUrl(filePath);

  console.log("AVATAR PUBLIC URL:", url.publicUrl);

  return url.publicUrl;
}
