import { useEffect, useState } from "react";
import { fetchSet10WithAssets } from "../services/communityDragon";


export default function Gallery() {
const [items, setItems] = useState([]);


useEffect(() => {
let mounted = true;
async function load() {
const champs = await fetchSet10WithAssets();


// preload image, tampilkan hanya jika load sukses
const filtered = await Promise.all(
champs.map(ch => {
return new Promise(resolve => {
const img = new Image();
img.src = ch.src;
img.onload = () => resolve({ ...ch, ok: true });
img.onerror = () => resolve({ ...ch, ok: false });
});
})
);


if (mounted) setItems(filtered.filter(c => c.ok));
}
load();
return () => (mounted = false);
}, []);


return (
<div className="min-h-screen p-6">
<h1 className="text-2xl font-bold text-center">TFT Set 10 Gallery</h1>


<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
{items.map(ch => (
<div key={ch.apiName} className="bg-slate-800 rounded-lg p-3 text-center">
<img src={ch.src} className="w-full h-28 object-contain" />
<div className="mt-2 text-sm font-semibold">{ch.name}</div>
</div>
))}
</div>
</div>
);
}