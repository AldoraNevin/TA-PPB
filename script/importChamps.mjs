import fs from "fs";
import path from "path";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function cleanName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function run() {
  console.log("Fetching JSON...");

  const { data } = await axios.get(
    "https://raw.communitydragon.org/pbe/cdragon/tft/en_us.json"
  );

  // --- FIX PENTING ---
  const set10 = data.sets["10"];
  if (!set10) {
    console.error("SET 10 tidak ditemukan!");
    return;
  }

  // Folder assets lokal
  const assetsPath = path.join(process.cwd(), "../Assets/champions");
  const files = fs.readdirSync(assetsPath);

  // Convert object → array
  const champions = Object.entries(set10.champions).map(([apiId, champ]) => {
    const clean = cleanName(champ.name);

    // cari gambar _mobile dulu
    const mobileFile = files.find((f) =>
      f.toLowerCase() === `tft10_${clean}_mobile.png`
    );

    // jika tidak ada, cari file apapun yang cocok
    const anyFile = files.find((f) =>
      f.toLowerCase().startsWith(`tft10_${clean}`)
    );

    const iconFile = mobileFile || anyFile || null;

    return {
      id: apiId,
      name: champ.name,
      cost: champ.cost,
      traits: champ.traits,
      fileName: iconFile,
    };
  });

  // hanya champion dengan gambar yang akan diimport
  const withImage = champions.filter((c) => c.fileName !== null);

  console.log("Mengimport:", withImage.length, "champions yang punya gambar.");

  const { error } = await supabase.from("champions").upsert(withImage);

  if (error) console.error("Supabase Error:", error);
  else console.log("Selesai!");
}

run();
