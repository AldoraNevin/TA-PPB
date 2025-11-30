export function getTierChampionImage(name) {
  if (!name) return "/fallback.png";

  const fileName = `tft10_${name.toLowerCase().replace(/[^a-z0-9]/g, "")}_mobile.png`;

  return `/assets/champions/${fileName}`;
}
