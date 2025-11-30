export function getChampionImage(name, variant = null) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const v = variant ? variant.toLowerCase() : null;

  const images = import.meta.glob(
    "/src/assets/champions/*.{png,jpg,jpeg}",
    { eager: true }
  );

  const files = Object.keys(images).map((p) => p.toLowerCase());

  // 1️⃣ Jika ada variant → cari file spesifik variant_mobile
  if (v) {
    const variantMobile = files.find((p) =>
      p.includes(`tft10_${clean}_${v}_mobile`)
    );
    if (variantMobile) return images[variantMobile].default;

    // fallback variant tanpa mobile
    const variantNormal = files.find((p) =>
      p.includes(`tft10_${clean}_${v}.png`)
    );
    if (variantNormal) return images[variantNormal].default;
  }

  // 2️⃣ Default champion_mobile
  const mobile = files.find((p) =>
    p.includes(`tft10_${clean}_mobile`)
  );
  if (mobile) return images[mobile].default;

  // 3️⃣ Default tanpa mobile
  const normal = files.find((p) =>
    p.includes(`tft10_${clean}.png`)
  );
  if (normal) return images[normal].default;

  // 4️⃣ Fallback terakhir
  return "/placeholder.png";
}
