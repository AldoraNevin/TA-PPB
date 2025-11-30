export function getTraitIcon(traitName) {
  const clean = traitName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const path = `/Assets/traits/trait_icon_10_${clean}.png`;

  return path;
}
