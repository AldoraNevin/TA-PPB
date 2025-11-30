import axios from "axios";


// gambar berada di public/Assets/
const ASSET_PATH = "/Assets/";


export async function fetchSet10WithAssets() {
const res = await axios.get(
"https://raw.communitydragon.org/pbe/cdragon/tft/en_us.json"
);


const sets = res.data.sets;
const champions = sets["10"].champions;


return champions.map(c => {
const slug = c.apiName.replace("TFT10_", "").toLowerCase();
const file = `tft10_${slug}.png`;


return {
...c,
assetFile: file,
src: ASSET_PATH + file
};
});
}